import api from './api';

const BookingService = {
    create: async (data) => {
        return api.post('/bookings', data);
    },

    getMyBookings: async () => {
        return api.get('/bookings/my');
    },

    getUserBookings: async () => {
        return api.get('/bookings/my');
    },

    cancel: async (id) => {
        return api.patch(`/bookings/${id}/status?status=CANCELLED`);
    },

    updateStatus: async (id, status) => {
        return api.patch(`/bookings/${id}/status?status=${status}`);
    }
};

export default BookingService;
