const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    hello: String
    number: Int
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello World',
    number: () => Math.floor(Math.random() * 10),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
