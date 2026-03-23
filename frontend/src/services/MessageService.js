import api from './api';

const MessageService = {
    getInbox: async () => {
        return api.get('/messages/inbox');
    },

    getConversation: async (userId) => {
        return api.get(`/messages/conversation/${userId}`);
    },

    sendMessage: async (data) => {
        return api.post('/messages', data);
    },

    markAsRead: async (senderId) => {
        return api.patch(`/messages/read/${senderId}`);
    }
};

export default MessageService;
