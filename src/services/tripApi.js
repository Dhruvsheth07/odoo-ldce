import api from './api';

export const tripApi = {
  getAll: (filter) => api.get('/trips', { params: { filter } }),
  getOne: (id) => api.get(`/trips/${id}`),
  create: (data) => api.post('/trips', data),
  update: (id, data) => api.put(`/trips/${id}`, data),
  delete: (id) => api.delete(`/trips/${id}`),
  getRecent: () => api.get('/trips/recent'),
  getUpcoming: () => api.get('/trips/upcoming'),

  // Stops
  getStops: (tripId) => api.get(`/trips/${tripId}/stops`),
  addStop: (tripId, data) => api.post(`/trips/${tripId}/stops`, data),
  updateStop: (stopId, data) => api.put(`/trips/stops/${stopId}`, data),
  deleteStop: (stopId) => api.delete(`/trips/stops/${stopId}`),
  reorderStops: (tripId, stopIds) => api.put(`/trips/${tripId}/stops/reorder`, { stopIds }),
};

export default tripApi;
