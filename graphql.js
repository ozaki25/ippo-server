const isLocal = process.env.LOCAL;
const { ApolloServer, gql } = isLocal ? require('apollo-server') : require('apollo-server-lambda');
const addNotificationToken = require('./src/addNotificationToken');
const removeNotificationToken = require('./src/removeNotificationToken');
const addEvent = require('./src/addEvent');
const addOrganizedEvent = require('./src/addOrganizedEvent');
const addTweet = require('./src/addTweet');
const addUser = require('./src/addUser');
const addCategorizedEvent = require('./src/addCategorizedEvent');
const addJoinedEvent = require('./src/addJoinedEvent');
const removeJoinedEvent = require('./src/removeJoinedEvent');
const fetchJoinedEvent = require('./src/fetchJoinedEvent');
const fetchJoinedEvents = require('./src/fetchJoinedEvents');
const fetchOrganizedEvents = require('./src/fetchOrganizedEvents');
const fetchExternalEvents = require('./src/fetchExternalEvents');
const fetchInternalEvents = require('./src/fetchInternalEvents');
const fetchInternalEvent = require('./src/fetchInternalEvent');
const fetchTweets = require('./src/fetchTweets');
const fetchUser = require('./src/fetchUser');
const publishNotification = require('./src/publishNotification');
const excuteUpdateExternalEvents = require('./src/excuteUpdateExternalEvents');
const utils = require('./src/utils');

const typeDefs = gql`
  type Query {
    externalEvents(limit: Int, startId: String): Events
    internalEvents(limit: Int): Events
    internalEvent(hashtag: String): Event
    joinedEvents(uid: String, limit: Int, startId: String): Events
    organizedEvents(uid: String, limit: Int, startId: String): Events
    tweets(hashtag: String, limit: Int, startId: String, uid: String): Tweets
  }
  type Mutation {
    registerNotification(token: String): Subscribe
    unregisterNotification(token: String): Unsubscribe
    publishNotification(target: String): Publish
    createEvent(event: inputEvent): CreateEvent
    createTweet(tweet: inputTweet): CreateTweet
    createUser(user: inputUser): CreateUser
    fetchUser(uid: String): User
    excuteUpdateExternalEvents: String
  }
  type Events {
    items: [Event]
    startId: String
  }
  type Event {
    id: String
    connpassId: Int
    title: String
    eventUrl: String
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
    event: Event
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
  type Unsubscribe {
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
    categories: String
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
    categories: String
  }
`;

const resolvers = {
  Query: {
    externalEvents: (_, props) => fetchExternalEvents(props),
    internalEvents: (_, props) => fetchInternalEvents(props),
    internalEvent: (_, props) => fetchInternalEvent(props),
    joinedEvents: (_, props) => fetchJoinedEvents({ userid: props.uid, ...props }),
    organizedEvents: (_, props) => fetchOrganizedEvents({ userid: props.uid, ...props }),
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
    unregisterNotification: (_, { token }) => removeNotificationToken(token),
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
      if (result !== 'OK') return { result };
      const promises = event.categories
        .split(',')
        .map(category => addCategorizedEvent({ eventid: id, category, ...event }));
      await Promise.all([
        ...promises,
        addOrganizedEvent({ eventid: id, userid: event.uid, ...event }),
      ]);
      return { result };
    },
    createUser: (_, { user }) => addUser(user),
    fetchUser: (_, { uid }) => fetchUser(uid),
    excuteUpdateExternalEvents: () => excuteUpdateExternalEvents(),
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
