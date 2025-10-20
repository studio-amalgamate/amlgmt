import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: async (username, password) => {
    const response = await api.post('/auth/register', { username, password });
    return response.data;
  },

  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export const projectAPI = {
  getAll: async () => {
    const response = await api.get('/projects');
    return response.data;
  },

  getAllAdmin: async () => {
    const response = await api.get('/admin/projects');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  create: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  update: async (id, projectData) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
};

export const mediaAPI = {
  upload: async (projectId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/projects/${projectId}/media`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (projectId, mediaId) => {
    const response = await api.delete(`/projects/${projectId}/media/${mediaId}`);
    return response.data;
  },

  toggleFeatured: async (projectId, mediaId, featured) => {
    const response = await api.put(`/projects/${projectId}/media/${mediaId}/featured?featured=${featured}`);
    return response.data;
  },

  reorder: async (projectId, mediaOrder) => {
    const response = await api.put(`/projects/${projectId}/media/reorder`, {
      media_order: mediaOrder,
    });
    return response.data;
  },
};

export const featuredAPI = {
  getAll: async () => {
    const response = await api.get('/featured');
    return response.data;
  },
};

export default api;
