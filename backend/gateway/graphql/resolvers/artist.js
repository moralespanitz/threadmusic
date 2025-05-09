const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.AUTH_API_URL;

function cleanArtista(artista) {
  return JSON.parse(JSON.stringify(artista));
}

module.exports = {
  Query: {
    artistas: async () => {
      try {
        const res = await axios.get(`${BASE_URL}/artistas/`);
        return res.data.map(cleanArtista);
      } catch (error) {
        console.error('[ERROR artistas]:', error.message);
        throw new Error('Error al obtener artistas');
      }
    },
    artista: async (_, { usuario }) => {
      try {
        const res = await axios.get(`${BASE_URL}/artistas/${usuario}/`);
        return cleanArtista(res.data);
      } catch (error) {
        console.error('[ERROR artista]:', error.message);
        throw new Error('Error al obtener artista');
      }
    }
  },
  Mutation: {
    createArtista: async (_, { input }) => {
        try {
          // Si no hay username explícito, usa el valor de usuario
          input.user.username = input.user.usuario;
      
          const res = await axios.post(`${BASE_URL}/artistas/`, input);
          return cleanArtista(res.data);
        } catch (error) {
          console.error('[ERROR createArtista]:', error.message, error.response?.data);
          throw new Error('Error al crear artista');
        }
      }

  }
};
