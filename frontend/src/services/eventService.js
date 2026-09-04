import api from "./api";

export const getAllEvents = () =>
    api.get("/events");

export const getEventsByPage = (page, size) =>
    api.get(`/events/page?page=${page}&size=${size}`);

export const getEventById = (id) =>
    api.get(`/events/${id}`);

export const createEvent = (event) =>
    api.post("/events", event);

export const updateEvent = (id, event) =>
    api.put(`/events/${id}`, event);

export const deleteEvent = (id) =>
    api.delete(`/events/${id}`);

export const uploadBanner = (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return api.post("/events/uploadBanner", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};

export const getCompletedEvents = () =>
    api.get("/events/completed");
