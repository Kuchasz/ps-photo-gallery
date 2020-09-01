import * as express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
 
// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Like {
    id: String!
    count: Int!
  }

  type Query {
    likes: [Like!]
  }
`;
 
// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    likes: () => [{id: 0, count: 1},{id: 1, count: 3},{id: 2, count: 202},{id: 3, count: 7},{id: 4, count: 12},{id: 5, count: 20},{id: 6, count: 10}],
  },
};
 
const server = new ApolloServer({ typeDefs, resolvers });
 
const app = express();
server.applyMiddleware({ app });
 
app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);