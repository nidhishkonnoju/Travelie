import api from './api';

const DealService = {
    getAll: (page = 0, size = 20) => api.get(`/deals?page=${page}&size=${size}`),
    getById: (id) => api.get(`/deals/${id}`),
    create: (data) => api.post('/deals', data),
    update: (id, data) => api.put(`/deals/${id}`, data),
    delete: (id) => api.delete(`/deals/${id}`),
};

export default DealService;
