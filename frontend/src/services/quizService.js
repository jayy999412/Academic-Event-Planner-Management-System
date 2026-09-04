import api from "./api";

// Create Quiz
export const createQuiz = (quiz) => {
    return api.post("/quiz", quiz);
};

// Get All Quiz
export const getAllQuiz = () => {
    return api.get("/quiz");
};

// Get Quiz By Id
export const getQuizById = (id) => {
    return api.get(`/quiz/${id}`);
};

// Get Quiz By Event
export const getQuizByEvent = (eventId) => {
    return api.get(`/quiz/event/${eventId}`);
};

// Update Quiz
export const updateQuiz = (id, quiz) => {
    return api.put(`/quiz/${id}`, quiz);
};

// Delete Quiz
export const deleteQuiz = (id) => {
    return api.delete(`/quiz/${id}`);
};