import api from "./api";

// Create Question
export const createQuestion = (question) => {
    return api.post("/questions", question);
};

// Get All Questions
export const getAllQuestions = () => {
    return api.get("/questions");
};

// Get Question By Id
export const getQuestionById = (id) => {
    return api.get(`/questions/${id}`);
};

// Get Questions By Quiz
export const getQuestionsByQuiz = (quizId) => {
    return api.get(`/questions/quiz/${quizId}`);
};

// Update Question
export const updateQuestion = (id, question) => {
    return api.put(`/questions/${id}`, question);
};

// Delete Question
export const deleteQuestion = (id) => {
    return api.delete(`/questions/${id}`);
};

// Submit Quiz
export const submitQuiz = (data) => {
    return api.post("/results/submit", data);
};