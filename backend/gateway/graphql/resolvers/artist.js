const axios = require('axios');
require('dotenv').config();
const BASE_URL = process.env.AUTH_API_URL;  // p.ej. http://localhost:8000/api

function cleanUser(user) {
  return {
    id:      user.id,
    usuario: user.username,
    correo:  user.email,
  };
}

function cleanArtista(a) {
  return {
    user:             cleanUser(a.user),
    nombre_artistico: a.nombre_artistico,
    genero_principal: a.genero_principal,
  };
}

module.exports = {
  Query: {
    artistas: async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/artistas/`);
        return data.map(cleanArtista);
      } catch (err) {
        console.error('[ERROR artistas]:', err.response?.data || err.message);
        throw new Error('Error al obtener artistas');
      }
    },
    artista: async (_, { id }) => {
      try {
        const { data } = await axios.get(`${BASE_URL}/artistas/${id}/`);
        return cleanArtista(data);
      } catch (err) {
        console.error('[ERROR artista]:', err.response?.data || err.message);
        throw new Error('Error al obtener artista');
      }
    },
    artistaByEmail: async (_, { correo }) => {
      try {
        const { data } = await axios.get(`${BASE_URL}/artistas/`, {
          params: { 'user__email': correo }
        });
        if (!data.length) throw new Error('Artista no encontrado');
        return cleanArtista(data[0]);
      } catch (err) {
        console.error('[ERROR artistaByEmail]:', err.response?.data || err.message);
        throw new Error('Error al obtener artista por correo');
      }
    },
  },

  Mutation: {
    createArtista: async (_, { input }) => {
      try {
        // Desempaquetamos el input plano
        const {
          usuario,
          correo,
          contrasena,
          nombre_artistico,
          genero_principal
        } = input;

        // Montamos el payload EXACTO que tu DRF espera
        const payload = {
          user: {
            username: usuario,
            email:    correo,
            password: contrasena,
          },
          nombre_artistico,
          genero_principal,
        };

        const { data } = await axios.post(
          `${BASE_URL}/artistas/`,
          payload,
          { headers: { 'Content-Type': 'application/json' } }
        );
        return cleanArtista(data);
      } catch (err) {
        console.error(
          '[ERROR createArtista]:',
          err.response?.status,
          err.response?.data || err.message
        );
        throw new Error('Error al crear artista');
      }
    },

    updateArtista: async (_, { id, input }) => {
      try {
        const { data } = await axios.patch(
          `${BASE_URL}/artistas/${id}/`,
          input,
          { headers: { 'Content-Type': 'application/json' } }
        );
        return cleanArtista(data);
      } catch (err) {
        console.error(
          '[ERROR updateArtista]:',
          err.response?.status,
          err.response?.data || err.message
        );
        throw new Error('Error al actualizar artista');
      }
    },

    deleteArtista: async (_, { id }) => {
      try {
        await axios.delete(`${BASE_URL}/artistas/${id}/`);
        return true;
      } catch (err) {
        console.error('[ERROR deleteArtista]:', err.response?.data || err.message);
        throw new Error('Error al eliminar artista');
      }
    },

    deleteArtistaByEmail: async (_, { correo }) => {
      try {
        const { data } = await axios.get(`${BASE_URL}/artistas/`, {
          params: { 'user__email': correo }
        });
        if (!data.length) throw new Error('Artista no encontrado');
        await axios.delete(`${BASE_URL}/artistas/${data[0].user.id}/`);
        return true;
      } catch (err) {
        console.error(
          '[ERROR deleteArtistaByEmail]:',
          err.response?.status,
          err.response?.data || err.message
        );
        throw new Error('Error al eliminar artista por correo');
      }
    },
  },
};
