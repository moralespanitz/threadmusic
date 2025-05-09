const { gql } = require('apollo-server');

module.exports = gql`
  type User {
    usuario: String!
    correo: String!
    contrasena: String
  }

  type Artista {
    user: User!
    nombre_artistico: String!
    genero_principal: String!
  }

  input CreateArtistaUserInput {
    usuario: String!
    correo: String!
    contrasena: String!
  }

  input CreateArtistaInput {
    user: CreateArtistaUserInput!
    nombre_artistico: String!
    genero_principal: String!
  }

  extend type Query {
    artistas: [Artista]
    artista(usuario: String!): Artista
  }

  extend type Mutation {
    createArtista(input: CreateArtistaInput!): Artista
  }
`;
