const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.AUTH_API_URL; // ← asegúrate de que esto esté en tu `.env`

function cleanUser(user) {
  return {
    ...user,
    contrasena: user.contrasena ?? null   
  };
}

module.exports = {
  Query: {
    users: async () => {
      try {
        const res = await axios.get(`${BASE_URL}/users/`);
        return res.data.map(cleanUser);
      } catch (error) {
        console.error('[ERROR users]:', error.message);
        throw new Error('Error al obtener los usuarios');
      }
    },
    user: async (_, { usuario }) => {
      try {
        const res = await axios.get(`${BASE_URL}/users/${usuario}/`);
        return cleanUser(res.data);
      } catch (error) {
        console.error('[ERROR user]:', error.message);
        throw new Error('Error al obtener el usuario');
      }
    }
  },
  Mutation: {
    createUser: async (_, { input }) => {
      try {
        const res = await axios.post(`${BASE_URL}/users/`, input);
        return cleanUser(res.data);
      } catch (error) {
        console.error('[ERROR createUser]:', error.message);
        throw new Error('Error al crear el usuario');
      }
    },
    updateUser: async (_, { usuario, input }) => {
      try {
        const current = await axios.get(`${BASE_URL}/users/${usuario}/`);
        const original = current.data;

        const safeInput = {
          ...original,
          ...input
        };

        const res = await axios.patch(`${BASE_URL}/users/${usuario}/`, safeInput);
        return cleanUser(res.data);
      } catch (error) {
        console.error('[ERROR updateUser]:', error.message);
        throw new Error('Error al actualizar el usuario');
      }
    },
    deleteUser: async (_, { usuario }) => {
      try {
        await axios.delete(`${BASE_URL}/users/${usuario}/`);
        return true;
      } catch (error) {
        console.error('[ERROR deleteUser]:', error.message);
        throw new Error('Error al eliminar el usuario');
      }
    }
  }
};
