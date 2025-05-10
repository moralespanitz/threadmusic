// resolvers.js
const axios = require('axios');
require('dotenv').config();
const BASE_URL = process.env.AUTH_API_URL; // ej: http://localhost:8000/api

function cleanUser(user) {
  return { id: user.id, usuario: user.username, correo: user.email };
}

function cleanCliente(c) {
  return { user: cleanUser(c.user), nombre: c.nombre, apellido: c.apellido };
}

module.exports = {
  Query: {
    clientes: async () => {
      const res = await axios.get(`${BASE_URL}/clientes/`);
      return res.data.map(cleanCliente);
    },
    cliente: async (_, { id }) => {
      const res = await axios.get(`${BASE_URL}/clientes/${id}/`);
      return cleanCliente(res.data);
    },
    clienteByEmail: async (_, { correo }) => {
      // Opción A: si tienes acción personalizada /get_by_email
      // const res = await axios.get(`${BASE_URL}/clientes/get_by_email/`, { params: { email: correo } });
      // return cleanCliente(res.data);

      // Opción B: usar filtro en list
      const res = await axios.get(`${BASE_URL}/clientes/`, { params: { 'user__email': correo } });
      if (!res.data.length) throw new Error('Cliente no encontrado');
      return cleanCliente(res.data[0]);
    },
  },

  Mutation: {
    createCliente: async (_, { input }) => {
      const { user: u, nombre, apellido } = input;
      const payload = {
        user: { username: u.usuario, email: u.correo, password: u.contrasena },
        nombre, apellido,
      };
      const res = await axios.post(`${BASE_URL}/clientes/`, payload);
      return cleanCliente(res.data);
    },

    updateCliente: async (_, { id, input }) => {
      // parcheo parcial
      const current = await axios.get(`${BASE_URL}/clientes/${id}/`);
      const data = { ...current.data, ...input };
      const res = await axios.patch(`${BASE_URL}/clientes/${id}/`, data);
      return cleanCliente(res.data);
    },

    deleteCliente: async (_, { id }) => {
      await axios.delete(`${BASE_URL}/clientes/${id}/`);
      return true;
    },

    deleteClienteByEmail: async (_, { correo }) => {
      // obtenemos el id primero
      const list = await axios.get(`${BASE_URL}/clientes/`, { params: { 'user__email': correo } });
      if (!list.data.length) throw new Error('Cliente no encontrado');
      const id = list.data[0].user.id;
      await axios.delete(`${BASE_URL}/clientes/${id}/`);
      return true;
    },
  },
};
