const { gql } = require('apollo-server');

module.exports = gql`
  type Hilo {
    id: ID
    text: String
    user: String
    post: String
    likes: Int
  }

  input CreateHiloInput {
    text: String!
    user: String!
    post: String!
  }

  input UpdateHiloInput {
    text: String
    user: String
    post: String
    likes: Int
  }

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
    hilos: [Hilo]
    hilo(id: ID!): Hilo
    bookmarksByUser(userId: String!): [Bookmark]
  }

  extend type Mutation {
    createHilo(input: CreateHiloInput!): Hilo
    updateHilo(id: ID!, input: UpdateHiloInput!): Hilo
    deleteHilo(id: ID!): Boolean
    likeHilo(id: ID!): Hilo

    createBookmark(input: CreateBookmarkInput!): Bookmark
    deleteBookmark(id: ID!): Boolean
  }
`;
