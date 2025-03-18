import axios from "axios";

// Definir a URL base da API do Django
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/";

// Criar uma instância do Axios para facilitar as chamadas
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Função para buscar usuários
export const getUsers = async () => {
  const response = await api.get("users/");
  return response.data;
};

// Função para buscar programas da igreja
export const getChurchPrograms = async () => {
  const response = await api.get("church_programs/");
  return response.data;
};

// Função para buscar voluntários em eventos
export const getEventVolunteers = async () => {
  const response = await api.get("event_volunteers/");
  return response.data;
};

// Função para buscar notificações
export const getNotifications = async () => {
  const response = await api.get("notifications/");
  return response.data;
};

// Função para buscar dados analíticos (dashboards)
export const getAnalytics = async () => {
  const response = await api.get("analytics/");
  return response.data;
};
