const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.HILOS_API_URL;

module.exports = {
  Query: {
    hilos: async () => {
      const res = await axios.get(`${BASE_URL}/hilos`);
      return res.data;
    },
    hilo: async (_, { id }) => {
      const res = await axios.get(`${BASE_URL}/hilos/${id}`);
      return res.data;
    },
    bookmarksByUser: async (_, { userId }) => {
      const res = await axios.get(`${BASE_URL}/bookmarks/user/${userId}`);
      return res.data;
    }
  },

  Mutation: {
    createHilo: async (_, { input }) => {
      const res = await axios.post(`${BASE_URL}/hilos`, input);
      return res.data;
    },
    updateHilo: async (_, { id, input }) => {
      const res = await axios.put(`${BASE_URL}/hilos/${id}`, input);
      return res.data;
    },
    deleteHilo: async (_, { id }) => {
      await axios.delete(`${BASE_URL}/hilos/${id}`);
      return true;
    },
    likeHilo: async (_, { id }) => {
      const res = await axios.post(`${BASE_URL}/hilos/${id}/like`);
      return res.data;
    },
    createBookmark: async (_, { input }) => {
      const res = await axios.post(`${BASE_URL}/bookmarks`, input);
      return res.data;
    },
    deleteBookmark: async (_, { id }) => {
      await axios.delete(`${BASE_URL}/bookmarks/${id}`);
      return true;
    }
  }
};
