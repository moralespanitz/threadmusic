const { gql } = require('apollo-server');

module.exports = gql`
  type User {
    usuario: String!
    correo: String!
    contrasena: String
  }

  type Cliente {
    user: User!
    nombre: String!
    apellido: String!
  }

  input CreateUserInput {
    usuario: String!
    correo: String!
    contrasena: String!
  }

  input CreateClienteInput {
    user: CreateUserInput!
    nombre: String!
    apellido: String!
  }

  extend type Query {
    clientes: [Cliente]
    cliente(usuario: String!): Cliente
  }

  extend type Mutation {
    createCliente(input: CreateClienteInput!): Cliente
  }
`;
