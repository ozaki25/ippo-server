const isLocal = process.env.LOCAL;
const { ApolloServer, gql } = isLocal ? require('apollo-server') : require('apollo-server-lambda');
const fetchConnpassEvents = require('./src/fetchConnpassEvent');
const addNotificationToken = require('./src/addNotificationToken');
const publishNotification = require('./src/publishNotification');

const typeDefs = gql`
  type Query {
    hello: String
    count: Int
    connpass(searchQuery: String): Connpass
  }
  type Mutation {
    registerNotification(token: String): Subscribe
    publishNotification(target: String): Publish
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
  type Subscribe {
    result: String
  }
  type Publish {
    result: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello World',
    count: () => Math.floor(Math.random() * 10),
    connpass: (_, { searchQuery }) => fetchConnpassEvents(searchQuery),
  },
  Mutation: {
    registerNotification: (_, { token }) => addNotificationToken(token),
    publishNotification: (_, { target }) => publishNotification(target),
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
