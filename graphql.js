const isLocal = process.env.LOCAL;
const { ApolloServer, gql } = isLocal ? require('apollo-server') : require('apollo-server-lambda');
const addNotificationToken = require('./src/addNotificationToken');
const addEvent = require('./src/addEvent');
const addOrganizedEvent = require('./src/addOrganizedEvent');
const addTweet = require('./src/addTweet');
const addUser = require('./src/addUser');
const addJoinedEvent = require('./src/addJoinedEvent');
const removeJoinedEvent = require('./src/removeJoinedEvent');
const fetchJoinedEvent = require('./src/fetchJoinedEvent');
const fetchConnpassEvents = require('./src/fetchConnpassEvents');
const fetchInternalEvents = require('./src/fetchInternalEvents');
const fetchInternalEvent = require('./src/fetchInternalEvent');
const fetchTweets = require('./src/fetchTweets');
const fetchUser = require('./src/fetchUser');
const publishNotification = require('./src/publishNotification');
const utils = require('./src/utils');

const typeDefs = gql`
  type Query {
    hello: String
    count: Int
    connpass(searchQuery: String, page: Int, count: Int): Connpass
    internalEvents: [InternalEvent]
    internalEvent(hashtag: String): InternalEvent
    tweets(hashtag: String, limit: Int, startId: String, uid: String): Tweets
  }
  type Mutation {
    registerNotification(token: String): Subscribe
    publishNotification(target: String): Publish
    createEvent(event: inputEvent): CreateEvent
    createTweet(tweet: inputTweet): CreateTweet
    createUser(user: inputUser): CreateUser
    fetchUser(uid: String): User
  }
  type Connpass {
    events: [Event]
    results_returned: Int
    results_available: Int
    results_start: Int
  }
  type Event {
    event_id: Int
    title: String
    catch: String
    description: String
    event_url: String
    address: String
    place: String
    started_at: String
    ended_at: String
  }
  type InternalEvent {
    id: String
    title: String
    catchMessage: String
    place: String
    hashtag: String
    startedAt: String
    endedAt: String
    name: String
  }
  type Tweets {
    tweetList: [Tweet]
    startId: String
    event: InternalEvent
    joined: Boolean
  }
  type Tweet {
    id: String
    hashtag: String
    name: String
    uid: String
    text: String
    time: String
  }
  type User {
    uid: String
    displayName: String
  }
  type Subscribe {
    result: String
  }
  type Publish {
    result: String
  }
  type CreateEvent {
    result: String
  }
  type CreateTweet {
    result: String
  }
  type CreateUser {
    result: String
  }
  input inputEvent {
    uid: String
    name: String
    title: String
    catchMessage: String
    place: String
    hashtag: String
    startedAt: String
    endedAt: String
  }
  input inputTweet {
    hashtag: String
    name: String
    uid: String
    text: String
    time: String
  }
  input inputUser {
    uid: String
    displayName: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello World',
    count: () => Math.floor(Math.random() * 10),
    connpass: (_, props) => fetchConnpassEvents(props),
    internalEvents: () => fetchInternalEvents(),
    internalEvent: (_, props) => fetchInternalEvent(props),
    tweets: async (_, props) => {
      const [{ tweetList, startId }, event] = await Promise.all([
        fetchTweets(props),
        fetchInternalEvent(props),
      ]);
      const joined = await fetchJoinedEvent({ userid: props.uid, eventid: event.id });
      return { tweetList, startId, event, joined: !!joined };
    },
  },
  Mutation: {
    registerNotification: (_, { token }) => addNotificationToken(token),
    publishNotification: (_, { target }) => publishNotification(target),
    createTweet: async (_, { tweet }) => {
      const { text, uid, hashtag } = tweet;
      const join = utils.joinTweet(text);
      const leave = utils.leaveTweet(text);
      const event = (join || leave) && (await fetchInternalEvent({ hashtag }));
      const actions = [
        join && addJoinedEvent({ ...event, eventid: event.id, userid: uid }),
        leave && removeJoinedEvent({ eventid: event.id, userid: uid }),
        addTweet(tweet),
      ].filter(Boolean);
      const [result] = await Promise.all(actions);
      return result;
    },
    createEvent: async (_, { event }) => {
      const { result, id } = await addEvent(event);
      return result === 'OK'
        ? await addOrganizedEvent({ eventid: id, uerid: event.uid, ...event })
        : { result };
    },
    createUser: (_, { user }) => addUser(user),
    fetchUser: (_, { uid }) => fetchUser(uid),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

if (isLocal) {
  server.listen().then(({ url }) => console.log(`🚀 Server ready at ${url}`));
} else {
  exports.graphqlHandler = server.createHandler({
    cors: { origin: '*', credentials: true },
  });
}
