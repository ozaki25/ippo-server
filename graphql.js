const isLocal = process.env.LOCAL;
const { ApolloServer } = isLocal ? require('apollo-server') : require('apollo-server-lambda');
const resolvers = require('./src/resolver');
const typeDefs = require('./src/schema');

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
