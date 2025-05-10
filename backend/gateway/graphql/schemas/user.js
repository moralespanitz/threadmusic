// schema.js
const { gql } = require('apollo-server');

module.exports = gql`
  type User {
    id: ID!
    usuario: String!
    correo: String!
    contrasena: String
  }

  input CreateUserInput {
    usuario: String!
    correo: String!
    contrasena: String!
  }

  input UpdateUserInput {
    correo: String
    contrasena: String
  }
  extend type Query {
    users: [User]
    user(id: ID!): User
    userByEmail(correo: String!): User    # ← este es el que falta
  }
  extend type Mutation {
    createUser(input: CreateUserInput!): User
    updateUser(id: ID!, input: UpdateUserInput!): User
    deleteUser(id: ID!): Boolean
    deleteUserByEmail(correo: String!): Boolean
  }
`;
