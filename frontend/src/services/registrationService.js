import api from "./api";

// Register Event
export const registerEvent = (data) => {
    return api.post("/registrations/register", data);
};

// Check Registration Status
export const checkRegistration = (userId, eventId) => {
    return api.get(
        `/registrations/check?userId=${userId}&eventId=${eventId}`
    );
};

// Get Logged-in Student Registrations
export const getStudentRegistrations = (userId) => {
    return api.get(`/registrations/student/${userId}`);
};

// Get Participants of an Event
export const getEventParticipants = (eventId) => {
    return api.get(`/registrations/event/${eventId}`);
};

// Get All Registrations
export const getAllRegistrations = () => {
    return api.get("/registrations");
};

// Approve Registration
export const approveRegistration = (id) => {
    return api.put(`/registrations/approve/${id}`);
};

// Reject Registration
export const rejectRegistration = (id) => {
    return api.put(`/registrations/reject/${id}`);
};

// Cancel Registration
export const cancelRegistration = (id) => {
    return api.put(`/registrations/cancel/${id}`);
};

// Mark Attendance
export const markAttendance = (id, status) => {
    return api.put(`/registrations/attendance/${id}/${status}`);
};