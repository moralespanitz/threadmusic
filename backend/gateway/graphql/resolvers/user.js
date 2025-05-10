// resolvers.js
const axios = require('axios');
require('dotenv').config();
const BASE_URL = process.env.AUTH_API_URL; // ej: https://mi-backend.com/auth

function cleanUser(user) {
  return {
    id: user.id,
    usuario: user.username,
    correo: user.email,
    contrasena: user.password ?? null,
  };
}

module.exports = {
  Query: {
    users: async () => {
      try {
        const res = await axios.get(`${BASE_URL}/users/`);
        return res.data.map(cleanUser);
      } catch (err) {
        console.error('[ERROR users]:', err.message);
        throw new Error('No se pudieron listar los usuarios');
      }
    },

    user: async (_, { id }) => {
      try {
        const res = await axios.get(`${BASE_URL}/users/${id}/`);
        return cleanUser(res.data);
      } catch (err) {
        console.error('[ERROR user]:', err.message);
        throw new Error('Usuario no encontrado');
      }
    },

    userByEmail: async (_, { correo }) => {
      try {
        const res = await axios.get(
          `${BASE_URL}/users/get_by_email/?email=${encodeURIComponent(correo)}`
        );
        return cleanUser(res.data);
      } catch (err) {
        console.error('[ERROR userByEmail]:', err.message);
        throw new Error('No se encontró usuario con ese correo');
      }
    },
  },

  Mutation: {
    createUser: async (_, { input }) => {
      try {
        const payload = {
          username: input.usuario,
          email:    input.correo,
          password: input.contrasena,
        };
        const res = await axios.post(`${BASE_URL}/users/`, payload);
        return cleanUser(res.data);
      } catch (err) {
        console.error('[ERROR createUser]:', err.message);
        throw new Error('No se pudo crear el usuario');
      }
    },

    updateUser: async (_, { id, input }) => {
      try {
        // 1) Traer estado actual
        const current = await axios.get(`${BASE_URL}/users/${id}/`);
        const original = current.data;
        // 2) Mezclar solo lo que vino en input
        const payload = {
          ...original,
          ...(input.correo    ? { email:    input.correo    } : {}),
          ...(input.contrasena? { password: input.contrasena } : {}),
        };
        // 3) Patch
        const res = await axios.patch(`${BASE_URL}/users/${id}/`, payload);
        return cleanUser(res.data);
      } catch (err) {
        console.error('[ERROR updateUser]:', err.message);
        throw new Error('No se pudo actualizar el usuario');
      }
    },

    deleteUser: async (_, { id }) => {
      try {
        await axios.delete(`${BASE_URL}/users/${id}/`);
        return true;
      } catch (err) {
        console.error('[ERROR deleteUser]:', err.message);
        throw new Error('No se pudo eliminar el usuario');
      }
    },

    deleteUserByEmail: async (_, { correo }) => {
      try {
        await axios.delete(
          `${BASE_URL}/users/delete_by_email/?email=${encodeURIComponent(correo)}`
        );
        return true;
      } catch (err) {
        console.error('[ERROR deleteUserByEmail]:', err.message);
        throw new Error('No se pudo eliminar el usuario por correo');
      }
    },
  },
};
