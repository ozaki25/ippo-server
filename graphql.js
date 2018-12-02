const isLocal = process.env.LOCAL;
const { ApolloServer, gql } = isLocal ? require('apollo-server') : require('apollo-server-lambda');

const typeDefs = gql`
  type Query {
    hello: String
    count: Int
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello World',
    count: () => Math.floor(Math.random() * 10),
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
