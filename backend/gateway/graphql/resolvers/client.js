const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.AUTH_API_URL;

function cleanCliente(cliente) {
  return JSON.parse(JSON.stringify(cliente));
}

module.exports = {
  Query: {
    clientes: async () => {
      try {
        const res = await axios.get(`${BASE_URL}/clientes/`);
        return res.data.map(cleanCliente);
      } catch (error) {
        console.error('[ERROR clientes]:', error.message);
        throw new Error('Error al obtener clientes');
      }
    },
    cliente: async (_, { usuario }) => {
      try {
        const res = await axios.get(`${BASE_URL}/clientes/${usuario}/`);
        return cleanCliente(res.data);
      } catch (error) {
        console.error('[ERROR cliente]:', error.message);
        throw new Error('Error al obtener cliente');
      }
    }
  },
  Mutation: {
    createCliente: async (_, { input }) => {
      try {
        const res = await axios.post(`${BASE_URL}/clientes/`, input);
        return cleanCliente(res.data);
      } catch (error) {
        console.error('[ERROR createCliente]:', error.message, error.response?.data);
        throw new Error('Error al crear cliente');
      }
    }
  }
};
