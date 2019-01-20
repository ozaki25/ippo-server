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
const fetchCategorizedEvents = require('./src/fetchCategorizedEvents');
const fetchExternalEvents = require('./src/fetchExternalEvents');
const fetchInternalEvents = require('./src/fetchInternalEvents');
const fetchInternalEvent = require('./src/fetchInternalEvent');
const fetchTweet = require('./src/fetchTweet');
const fetchTweets = require('./src/fetchTweets');
const fetchUser = require('./src/fetchUser');
const publishNotification = require('./src/publishNotification');
const excuteUpdateExternalEvents = require('./src/excuteUpdateExternalEvents');
const utils = require('./src/utils');

const typeDefs = gql`
  type Query {
    allEvents(uid: String, limit: Int): AllEvents
    externalEvents(limit: Int, startId: String): Events
    internalEvents(limit: Int): Events
    internalEvent(hashtag: String): Event
    joinedEvents(uid: String, limit: Int, startId: String): Events
    organizedEvents(uid: String, limit: Int, startId: String): Events
    recommendedEvents(uid: String, limit: Int, startId: String): Events
    tweet(hashtag: String, id: String): Tweet
    tweets(hashtag: String, limit: Int, startId: String, uid: String): Tweets
    fetchUser(uid: String): User
  }
  type Mutation {
    registerNotification(token: String): Subscribe
    unregisterNotification(token: String): Unsubscribe
    publishNotification(target: String): Publish
    createEvent(event: inputEvent): CreateEvent
    createTweet(tweet: inputTweet): CreateTweet
    createUser(user: inputUser): CreateUser
    excuteUpdateExternalEvents: String
  }
  type AllEvents {
    joined: [Event]
    recommended: [Event]
    internal: [Event]
    external: [Event]
    organized: [Event]
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
    timestamp: String
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
    categories: String
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
    name: String
    uid: String
    text: String
    time: String
    parentId: String
    parentHashtag: String
  }
  input inputUser {
    uid: String
    displayName: String
    categories: String
  }
`;

const resolvers = {
  Query: {
    allEvents: async (_, props) => {
      const [joined, internal, external, organized, recommended] = await Promise.all([
        fetchJoinedEvents({ userid: props.uid, ...props }),
        fetchInternalEvents(props),
        fetchExternalEvents(props),
        fetchOrganizedEvents({ userid: props.uid, ...props }),
        (async () => {
          const { categories } = await fetchUser(props.uid);
          return categories
            ? fetchCategorizedEvents({
                categories: categories.split(','),
                ...props,
              })
            : { items: [] };
        })(),
      ]);
      return {
        joined: joined.items,
        internal: internal.items,
        external: external.items,
        organized: organized.items,
        recommended: recommended.items,
      };
    },
    externalEvents: (_, props) => fetchExternalEvents(props),
    internalEvents: (_, props) => fetchInternalEvents(props),
    internalEvent: (_, props) => fetchInternalEvent(props),
    joinedEvents: (_, props) => fetchJoinedEvents({ userid: props.uid, ...props }),
    organizedEvents: (_, props) => fetchOrganizedEvents({ userid: props.uid, ...props }),
    recommendedEvents: async (_, props) => {
      const { categories } = await fetchUser(props.uid);
      return categories
        ? fetchCategorizedEvents({
            categories: categories.split(','),
            ...props,
          })
        : { items: [] };
    },
    tweet: (_, props) => fetchTweet(props),
    tweets: async (_, props) => {
      const [{ tweetList, startId }, event] = await Promise.all([
        fetchTweets(props),
        fetchInternalEvent(props),
      ]);
      const joined = event
        ? await fetchJoinedEvent({ userid: props.uid, eventid: event.id })
        : false;
      return { tweetList, startId, event, joined: !!joined };
    },
    fetchUser: (_, { uid }) => fetchUser(uid),
  },
  Mutation: {
    registerNotification: (_, { token }) => addNotificationToken(token),
    unregisterNotification: (_, { token }) => removeNotificationToken(token),
    publishNotification: (_, { target }) => publishNotification(target),
    createTweet: async (_, { tweet }) => {
      const { text, uid, parentId, parentHashtag } = tweet;
      if (parentId && parentHashtag) {
        const parentTweet = await fetchTweet({ id: parentId, hashtag: parentHashtag });
        const comments = parentTweet.comments || [];
        return addTweet({ ...parentTweet, comments: [...comments, tweet] });
      } else {
        const join = utils.joinTweet(text);
        const leave = utils.leaveTweet(text);
        const hashtagList = utils.detectHashtag(text);
        const list = hashtagList.length ? hashtagList : 'none';
        try {
          const actions = hashtagList.map(async hashtag => {
            const event = (join || leave) && (await fetchInternalEvent({ hashtag }));
            await Promise.all(
              [
                join && addJoinedEvent({ ...event, eventid: event.id, userid: uid }),
                leave && removeJoinedEvent({ eventid: event.id, userid: uid }),
                addTweet({ ...tweet, hashtag }),
              ].filter(Boolean),
            );
          });
          await Promise.all(actions);
          return { result: 'OK' };
        } catch (e) {
          return { result: e.toString() };
        }
      }
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
