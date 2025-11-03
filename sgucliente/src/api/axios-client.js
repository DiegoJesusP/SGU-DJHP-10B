import axios from "axios";

const ENV = import.meta.env;

const API_URL = `http://${ENV.VITE_API_HOST}:${ENV.VITE_API_PORT}${ENV.VITE_API_BASE}`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const callToAPI = async () => {
  try {
    const res = await api.get("/test");
    console.log("Respuesta del back:", res.data);
  } catch (error) {
    console.error("Error al llamar a /test:", error);
  }
};

export default api;
