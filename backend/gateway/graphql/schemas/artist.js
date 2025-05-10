const { gql } = require('apollo-server');

module.exports = gql`
  type User {
    id: ID!
    usuario: String!
    correo: String!
  }

  type Artista {
    user:             User!
    nombre_artistico: String!
    genero_principal: String!
  }

  input CreateUserInput {
    usuario:    String!
    correo:     String!
    contrasena: String!
  }

  input CreateArtistaInput {
    user:             CreateUserInput!
    nombre_artistico: String!
    genero_principal: String!
  }

  input UpdateArtistaInput {
    nombre_artistico: String
    genero_principal: String
  }

  extend type Query {
    artistas: [Artista!]!
    artista(id: ID!): Artista
    artistaByEmail(correo: String!): Artista
  }

  extend type Mutation {
    createArtista(input: CreateArtistaInput!): Artista!
    updateArtista(id: ID!, input: UpdateArtistaInput!): Artista!
    deleteArtista(id: ID!): Boolean!
    deleteArtistaByEmail(correo: String!): Boolean!
  }
`;
