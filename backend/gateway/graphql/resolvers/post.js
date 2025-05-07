const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.API_URL;

// 🔧 Limpieza profunda del objeto Post para evitar ciclos
function cleanPost(post) {
  const cleaned = {
    ...post,
    songId: post.songId && typeof post.songId === 'object' ? post.songId.songId : post.songId
  };

  // Elimina cualquier posible ciclo
  return JSON.parse(JSON.stringify(cleaned));
}

module.exports = {
  Query: {
    posts: async () => {
      try {
        const res = await axios.get(`${BASE_URL}/post`);
        return res.data.map(cleanPost);
      } catch (error) {
        console.error('[ERROR posts]:', error.message);
        throw new Error('Error al obtener los posts');
      }
    },
    post: async (_, { id }) => {
      try {
        const res = await axios.get(`${BASE_URL}/post/${id}`);
        return cleanPost(res.data);
      } catch (error) {
        console.error('[ERROR post]:', error.message);
        throw new Error('Error al obtener el post');
      }
    }
  },
  Mutation: {
    createPost: async (_, { input }) => {
      try {
        const res = await axios.post(`${BASE_URL}/post`, input);
        console.log('[DEBUG post recibido]:', res.data);
        return cleanPost(res.data);
      } catch (error) {
        console.error('[ERROR createPost]:', error.message);
        throw new Error('Error al crear el post');
      }
    },
    updatePost: async (_, { id, input }) => {
      try {

        const current = await axios.get(`${BASE_URL}/post/${id}`);
        const original = current.data;

        const safeInput = {
          ...original,
          ...input // lo nuevo reemplaza lo viejo
        };

        const res = await axios.patch(`${BASE_URL}/post/${id}`, safeInput);
        return cleanPost(res.data);
      } catch (error) {
        console.error('[ERROR updatePost]:', error.message);
        console.error('[RESPONSE NEST]:', error.response?.data);
        throw new Error('Error al actualizar el post');
      }
    },
    deletePost: async (_, { id }) => {
      try {
        await axios.delete(`${BASE_URL}/post/${id}`);
        return true;
      } catch (error) {
        console.error('[ERROR deletePost]:', error.message);
        throw new Error('Error al eliminar el post');
      }
    }
  }
};
