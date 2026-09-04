import api from "./api";

export const payNow = (paymentData) => {
    return api.post("/payments/pay", paymentData);
};

export const getPaymentHistory = (userId) => {
    return api.get(`/payments/student/${userId}`);
};

export const getPaymentByRegistration = (registrationId) => {
    return api.get(`/payments/registration/${registrationId}`);
};
