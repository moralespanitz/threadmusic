const { gql } = require('apollo-server');

module.exports = gql`
  type User {
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
    user(usuario: String!): User
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): User
    updateUser(usuario: String!, input: UpdateUserInput!): User
    deleteUser(usuario: String!): Boolean
  }
`;
