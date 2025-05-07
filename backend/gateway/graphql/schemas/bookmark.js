const { gql } = require('apollo-server');

module.exports = gql`
  type Bookmark {
    id: ID
    user: String
    post: String
  }

  input CreateBookmarkInput {
    user: String!
    post: String!
  }

  extend type Query {
    bookmarksByUser(userId: String!): [Bookmark]
  }

  extend type Mutation {
    createBookmark(input: CreateBookmarkInput!): Bookmark
    deleteBookmark(id: ID!): Boolean
  }
`;
