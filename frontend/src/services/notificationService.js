import api from "./api";

const BASE_URL = "/notifications";

const notificationService = {

    getAllNotifications() {
        return api.get(BASE_URL);
    },

    getUserNotifications(userId) {
        return api.get(`${BASE_URL}/user/${userId}`);
    },

    getUnreadNotifications(userId) {
        return api.get(`${BASE_URL}/user/${userId}/unread`);
    },

    countUnreadNotifications(userId) {
        return api.get(`${BASE_URL}/user/${userId}/count`);
    },

    getNotificationsByType(type) {
        return api.get(`${BASE_URL}/type/${type}`);
    },

    getUserNotificationsByType(userId, type) {
        return api.get(`${BASE_URL}/user/${userId}/type/${type}`);
    },

    markAsRead(notificationId) {
        return api.put(`${BASE_URL}/${notificationId}/read`);
    },

    markAllAsRead(userId) {
        return api.put(`${BASE_URL}/user/${userId}/read-all`);
    },

    deleteNotification(notificationId) {
        return api.delete(`${BASE_URL}/${notificationId}`);
    },

    sendNotificationToAll(notification) {
        return api.post(`${BASE_URL}/send-to-all`, notification);
    }

};

export default notificationService;
