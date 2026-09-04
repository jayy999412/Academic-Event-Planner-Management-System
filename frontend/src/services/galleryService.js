import api from "./api";

export const uploadImages = (eventId, files) => {
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
    }

    return api.post(`/gallery/upload/${eventId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};

export const getGallery = (eventId) => {
    return api.get(`/gallery/${eventId}`);
};

export const deleteImage = (id) => {
    return api.delete(`/gallery/${id}`);
};