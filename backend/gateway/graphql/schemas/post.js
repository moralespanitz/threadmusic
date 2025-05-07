const { gql } = require('apollo-server');

module.exports = gql`
  type Post {
    postId: ID
    userId: String
    songId: String
    content: String
    release_date: String
    createdAt: String
    updatedAt: String
  }

  type Hilo {
    id: ID
    text: String
    user: String
    post: String
    likes: Int
  }

  type PostWithHilos {
    post: Post
    hilos: [Hilo]
  }

  input CreatePostInput {
    userId: String!
    songId: String!
    content: String!
    release_date: String
  }

  input UpdatePostInput {
    userId: String
    songId: String
    content: String
    release_date: String
  }

  extend type Query {
    posts: [Post]
    post(id: ID!): PostWithHilos 
  }

  extend type Mutation {
    createPost(input: CreatePostInput!): Post
    updatePost(id: ID!, input: UpdatePostInput!): Post
    deletePost(id: ID!): Boolean
  }
`;

