const isLocal = process.env.LOCAL;
const { ApolloServer, gql } = isLocal ? require('apollo-server') : require('apollo-server-lambda');
const fetchConnpassEvents = require('./src/fetchConnpassEvent');

const typeDefs = gql`
  type Query {
    hello: String
    count: Int
    connpass: Connpass
  }
  type Mutation {
    subscriber(token: String): subscriber
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
  }
  type Subscriber {
    token: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello World',
    count: () => Math.floor(Math.random() * 10),
    connpass: async () => await fetchConnpassEvents(),
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
