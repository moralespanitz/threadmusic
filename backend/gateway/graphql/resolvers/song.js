const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.API_URL;

// Limpia el objeto song (por ahora no necesita transformación)
function cleanSong(song) {
  return JSON.parse(JSON.stringify(song));
}

module.exports = {
  Query: {
    songs: async () => {
      try {
        const res = await axios.get(`${BASE_URL}/song`);
        return res.data.map(cleanSong);
      } catch (error) {
        console.error('[ERROR songs]:', error.message);
        throw new Error('Error al obtener las canciones');
      }
    },
    song: async (_, { id }) => {
      try {
        const res = await axios.get(`${BASE_URL}/song/${id}`);
        return cleanSong(res.data);  
      } catch (error) {
        console.error('[ERROR song]:', error.message);
        throw new Error('Error al obtener la canción');
      }
    }
    
  },
  Mutation: {
    createSong: async (_, { input }) => {
      try {
        const res = await axios.post(`${BASE_URL}/song`, input);
        console.log('[DEBUG canción creada]:', res.data);
        return cleanSong(res.data);
      } catch (error) {
        console.error('[ERROR createSong]:', error.message);
        throw new Error('Error al crear la canción');
      }
    },
    updateSong: async (_, { id, input }) => {
      try {
        // Obtener la canción actual para combinar si es necesario
        const current = await axios.get(`${BASE_URL}/song/${id}`);
        const original = current.data;

        const safeInput = {
          ...original,
          ...input
        };

        const res = await axios.patch(`${BASE_URL}/song/${id}`, safeInput);
        return cleanSong(res.data);
      } catch (error) {
        console.error('[ERROR updateSong]:', error.message);
        console.error('[RESPONSE NEST]:', error.response?.data);
        throw new Error('Error al actualizar la canción');
      }
    },
    deleteSong: async (_, { id }) => {
      try {
        await axios.delete(`${BASE_URL}/song/${id}`);
        return true;
      } catch (error) {
        console.error('[ERROR deleteSong]:', error.message);
        throw new Error('Error al eliminar la canción');
      }
    }
  }
};
