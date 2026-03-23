import api from './api';

const UserService = {
    getAll: (page = 0, size = 20, role = '') => {
        let url = `/users?page=${page}&size=${size}`;
        if (role) url += `&role=${role}`;
        return api.get(url);
    },
    getById: (id) => api.get(`/users/${id}`),
    updateRole: (id, role) => api.put(`/users/${id}/role`, { role }),
    deactivate: (id) => api.delete(`/users/${id}`),
    getContacts: () => api.get('/users/contacts'),
};

export default UserService;
