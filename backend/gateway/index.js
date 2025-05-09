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

// User
const userResolvers = require('./graphql/resolvers/user');
const userSchemas = require('./graphql/schemas/user');

// Client
const clientResolvers = require('./graphql/resolvers/client');
const clientSchemas = require('./graphql/schemas/client');

// Artist
const artistResolvers = require('./graphql/resolvers/artist');
const artistSchemas = require('./graphql/schemas/artist');

// Merge
const rootSchema = gql`type Query { _empty: String } type Mutation { _empty: String }`;
const typeDefs = mergeTypeDefs([
  rootSchema,
  songSchema,
  postSchema,
  bookmarkSchema,
  hiloSchema,
  userSchemas,
  clientSchemas,
  artistSchemas,
]);

const resolvers = mergeResolvers([
  songResolvers,
  postResolvers,
  bookmarkResolvers,
  hiloResolvers,
  userResolvers,
  clientResolvers,
  artistResolvers
]);


const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 GraphQL Gateway ready at ${url}`);
});
