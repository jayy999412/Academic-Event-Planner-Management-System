import api from "./api";

// Generate Certificate
export const generateCertificate = (registrationId) => {
    return api.post(`/certificates/generate/${registrationId}`);
};

// Get Certificate By Registration
export const getCertificate = (registrationId) => {
    return api.get(`/certificates/registration/${registrationId}`);
};

// Verify Certificate
export const verifyCertificate = (certificateNumber) => {
    return api.get(`/certificates/verify/${certificateNumber}`);
};

// Get All Certificates
export const getAllCertificates = () => {
    return api.get("/certificates");
};

// Download Certificate PDF
export const downloadCertificatePdf = (registrationId) => {
    return api.get(`/certificates/download/${registrationId}`, {
        responseType: "blob"
    });
};