const { ApolloServer, gql } = require('apollo-server');
const { mergeTypeDefs } = require('@graphql-tools/merge');
const { mergeResolvers } = require('@graphql-tools/merge');
// Schemas
const bookmarkSchema = require('./graphql/schemas/bookmark');
const hiloSchema = require('./graphql/schemas/hilo');

// Resolvers
const bookmarkResolvers = require('./graphql/resolvers/bookmark');
const hiloResolvers = require('./graphql/resolvers/hilo');

// Schemas
const songSchema = require('./graphql/schemas/song');
const postSchema = require('./graphql/schemas/post');

// Resolvers
const songResolvers = require('./graphql/resolvers/song');
const postResolvers = require('./graphql/resolvers/post');

// Merge
const rootSchema = gql`type Query { _empty: String } type Mutation { _empty: String }`;
const typeDefs = mergeTypeDefs([
  rootSchema,
  songSchema,
  postSchema,
  bookmarkSchema,
  hiloSchema
]);

const resolvers = mergeResolvers([
  songResolvers,
  postResolvers,
  bookmarkResolvers,
  hiloResolvers
]);


const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 GraphQL Gateway ready at ${url}`);
});
