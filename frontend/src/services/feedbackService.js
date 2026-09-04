import api from "./api";

const BASE_URL = "/feedback";

const feedbackService = {

    submitFeedback(feedback) {
        return api.post(BASE_URL, feedback);
    },

    getAllFeedback() {
        return api.get(BASE_URL);
    },

    getMyFeedback(userId) {
        return api.get(`${BASE_URL}/user/${userId}`);
    },

    getFeedbackByEvent(eventId) {
        return api.get(`${BASE_URL}/event/${eventId}`);
    },

    canUserGiveFeedback(userId, eventId) {
        return api.get(`${BASE_URL}/can-feedback/${userId}/${eventId}`);
    },

    getAverageRatingByEvent(eventId) {
        return api.get(`${BASE_URL}/event/${eventId}/average-rating`);
    },

    getFeedbackCountByEvent(eventId) {
        return api.get(`${BASE_URL}/event/${eventId}/count`);
    },

    getFeedbackStats() {
        return api.get(`${BASE_URL}/stats`);
    },

    getAverageRating() {
        return api.get(`${BASE_URL}/average-rating`);
    },

    deleteFeedback(id) {
        return api.delete(`${BASE_URL}/${id}`);
    }

};

export default feedbackService;
