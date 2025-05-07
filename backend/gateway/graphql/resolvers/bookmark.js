const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.HILOS_API_URL;

module.exports = {
  Query: {
    bookmarksByUser: async (_, { userId }) => {
      try {
        const res = await axios.get(`${BASE_URL}/bookmarks/user/${userId}`);
        return res.data;
      } catch (error) {
        console.error('[ERROR getBookmarksByUser]:', error.message);
        throw new Error('Error al obtener los bookmarks del usuario');
      }
    }
  },

  Mutation: {
    createBookmark: async (_, { input }) => {
      try {
        const res = await axios.post(`${BASE_URL}/bookmarks`, input);
        return res.data;
      } catch (error) {
        console.error('[ERROR createBookmark]:', error.message);
        throw new Error('Error al crear el bookmark');
      }
    },

    deleteBookmark: async (_, { id }) => {
      try {
        await axios.delete(`${BASE_URL}/bookmarks/${id}`);
        return true;
      } catch (error) {
        console.error('[ERROR deleteBookmark]:', error.message);
        throw new Error('Error al eliminar el bookmark');
      }
    }
  }
};
