import api from './api';

export const expenseApi = {
  getAll: (tripId, params) => api.get(`/expenses/trips/${tripId}`, { params }),
  create: (tripId, data) => api.post(`/expenses/trips/${tripId}`, data),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`),
};

export const budgetApi = {
  get: (tripId) => api.get(`/budget/trips/${tripId}`),
};

export const calendarApi = {
  get: (tripId) => api.get(`/calendar/trips/${tripId}`),
};

export const shareApi = {
  toggle: (tripId) => api.put(`/share/trips/${tripId}`),
  getShared: (shareToken) => api.get(`/share/${shareToken}`),
  copy: (shareToken) => api.post(`/share/${shareToken}/copy`),
};

export const savedApi = {
  getAll: () => api.get('/saved-destinations'),
  save: (data) => api.post('/saved-destinations', data),
  unsave: (id) => api.delete(`/saved-destinations/${id}`),
};

export const userApi = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
  deleteAccount: () => api.delete('/users/me'),
};
