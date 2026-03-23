import api from './api';

const PackageService = {
    getAll: async (page = 0, size = 12, location = '') => {
        return api.get('/packages', { params: { page, size, location: location || undefined } });
    },

    getById: async (id) => {
        return api.get(`/packages/${id}`);
    },

    create: async (data) => {
        return api.post('/packages', data);
    },

    update: async (id, data) => {
        return api.put(`/packages/${id}`, data);
    },

    delete: async (id) => {
        return api.delete(`/packages/${id}`);
    }
};

export default PackageService;
