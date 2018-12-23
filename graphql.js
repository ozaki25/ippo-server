const isLocal = process.env.LOCAL;
const { ApolloServer, gql } = isLocal ? require('apollo-server') : require('apollo-server-lambda');
const addNotificationToken = require('./src/addNotificationToken');
const addEvent = require('./src/addEvent');
const addTweet = require('./src/addTweet');
const fetchConnpassEvents = require('./src/fetchConnpassEvent');
const fetchInternalEvents = require('./src/fetchInternalEvent');
const fetchTweets = require('./src/fetchTweets');
const publishNotification = require('./src/publishNotification');

const typeDefs = gql`
  type Query {
    hello: String
    count: Int
    connpass(searchQuery: String, page: Int, count: Int): Connpass
    internalEvents: [InternalEvent]
    tweets(hashtag: String, limit: Int, startId: String): [Tweet]
  }
  type Mutation {
    registerNotification(token: String): Subscribe
    publishNotification(target: String): Publish
    createEvent(event: inputEvent): CreateEvent
    createTweet(tweet: inputTweet): CreateTweet
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
  }
  type Tweet {
    id: String
    hashtag: String
    name: String
    text: String
    time: String
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
  input inputEvent {
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
    text: String
    time: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello World',
    count: () => Math.floor(Math.random() * 10),
    connpass: (_, props) => fetchConnpassEvents(props),
    internalEvents: () => fetchInternalEvents(),
    tweets: (_, props) => fetchTweets(props),
  },
  Mutation: {
    registerNotification: (_, { token }) => addNotificationToken(token),
    publishNotification: (_, { target }) => publishNotification(target),
    createTweet: (_, { tweet }) => addTweet(tweet),
    createEvent: (_, { event }) => addEvent(event),
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
