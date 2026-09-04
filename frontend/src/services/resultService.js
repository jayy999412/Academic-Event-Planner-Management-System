import api from "./api";

// Get all results
export const getAllResults = () => {
    return api.get("/results");
};

// Get results by quiz
export const getQuizResults = (quizId) => {
    return api.get(`/results/quiz/${quizId}`);
};

// Get student results
export const getStudentResults = (studentId) => {
    return api.get(`/results/student/${studentId}`);
};

// Publish result
export const publishResult = (id) => {
    return api.put(`/results/publish/${id}`);
};

// Get all published results
export const getPublishedResults = () => {
    return api.get("/results/published");
};

// Get published results by quiz
export const getPublishedQuizResults = (quizId) => {
    return api.get(`/results/published/quiz/${quizId}`);
};

// Get published results by student
export const getPublishedStudentResults = (studentId) => {
    return api.get(`/results/published/student/${studentId}`);
};