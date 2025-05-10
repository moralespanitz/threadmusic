// schema.js
const { gql } = require('apollo-server');

module.exports = gql`
  type User {
    id: ID!
    usuario: String!
    correo: String!
  }

  type Cliente {
    user:     User!
    nombre:   String!
    apellido: String!
  }

  input CreateUserInput {
    usuario:   String!
    correo:    String!
    contrasena:String!
  }

  input CreateClienteInput {
    user:     CreateUserInput!
    nombre:   String!
    apellido: String!
  }

  input UpdateClienteInput {
    nombre:   String
    apellido: String
  }

  extend type Query {
    clientes: [Cliente!]!
    cliente(id: ID!): Cliente
    clienteByEmail(correo: String!): Cliente # ← nuevo
  }



  extend type Mutation {
    createCliente(input: CreateClienteInput!): Cliente!
    updateCliente(id: ID!, input: UpdateClienteInput!): Cliente!  # ← opcional
    deleteCliente(id: ID!): Boolean                             # ← opcional
    deleteClienteByEmail(correo: String!): Boolean              # ← nuevo
  }
`;
