const { gql } = require('apollo-server');

module.exports = gql`
  type Song {
    songId: ID
    title: String
    artistId: String
    genre: String
    release_date: String
    createdAt: String
    updatedAt: String
    posts: [Post]  # 👈 Agregado
  }

  type Post {
    postId: ID
    userId: String
    songId: String
    content: String
    release_date: String
    createdAt: String
    updatedAt: String
  }

  input CreateSongInput {
    title: String!
    artistId: String!
    genre: String!
    release_date: String
  }

  input UpdateSongInput {
    title: String
    artistId: String
    genre: String
    release_date: String
  }

  extend type Query {
    songs: [Song]
    song(id: ID!): Song
  }

  extend type Mutation {
    createSong(input: CreateSongInput!): Song
    updateSong(id: ID!, input: UpdateSongInput!): Song
    deleteSong(id: ID!): Boolean
  }
`;
