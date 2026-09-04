import api from "./api";

export const downloadReceipt = async (paymentId) => {
    const response = await api.get(`/receipts/download/${paymentId}`, {
        responseType: "blob"
    });
    return response;
};
