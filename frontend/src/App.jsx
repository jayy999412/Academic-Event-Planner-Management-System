import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";

import AddEvent from "./pages/AddEvent";
import ViewEvents from "./pages/ViewEvents";
import EditEvent from "./pages/EditEvent";
import EventDetails from "./pages/EventDetails";
import Gallery from "./pages/Gallery";

import QuizList from "./pages/QuizList";
import CreateQuiz from "./pages/CreateQuiz";
import EditQuiz from "./pages/EditQuiz";

import QuestionList from "./pages/QuestionList";
import AddQuestion from "./pages/AddQuestion";
import EditQuestion from "./pages/EditQuestion";

import StartQuiz from "./pages/StartQuiz";
import PublishResult from "./pages/PublishResult";
import QuizResult from "./pages/QuizResult";

import MyRegistrations from "./pages/MyRegistrations";
import ParticipantsList from "./pages/ParticipantsList";
import PaymentPage from "./pages/PaymentPage";

import AdminCertificates from "./pages/AdminCertificates";
import StudentCertificates from "./pages/StudentCertificates";
import VerifyCertificate from "./pages/VerifyCertificate";

// New Page Imports
import Notifications from "./pages/Notifications";
import AdminFeedback from "./pages/AdminFeedback";
import Feedback from "./pages/Feedback";
import FeedbackHistory from "./pages/FeedbackHistory";
import Reports from "./pages/Reports";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Auth Routes - No Layout */}
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes - With AppLayout */}
                <Route path="/dashboard" element={<ProtectedRoute adminOnly><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>} />
                <Route path="/change-password" element={<ProtectedRoute><AppLayout><ChangePassword /></AppLayout></ProtectedRoute>} />

                <Route path="/add-event" element={<ProtectedRoute adminOnly><AppLayout><AddEvent /></AppLayout></ProtectedRoute>} />
                <Route path="/events" element={<ProtectedRoute><AppLayout><ViewEvents /></AppLayout></ProtectedRoute>} />
                <Route path="/edit-event/:id" element={<ProtectedRoute adminOnly><AppLayout><EditEvent /></AppLayout></ProtectedRoute>} />
                <Route path="/event/:id" element={<ProtectedRoute><AppLayout><EventDetails /></AppLayout></ProtectedRoute>} />
                <Route path="/gallery/:eventId" element={<ProtectedRoute><AppLayout><Gallery /></AppLayout></ProtectedRoute>} />

                <Route path="/my-registrations" element={<ProtectedRoute><AppLayout><MyRegistrations /></AppLayout></ProtectedRoute>} />
                <Route path="/participants/:eventId" element={<ProtectedRoute adminOnly><AppLayout><ParticipantsList /></AppLayout></ProtectedRoute>} />
                <Route path="/payment/:registrationId" element={<ProtectedRoute><AppLayout><PaymentPage /></AppLayout></ProtectedRoute>} />

                <Route path="/admin-certificates" element={<ProtectedRoute adminOnly><AppLayout><AdminCertificates /></AppLayout></ProtectedRoute>} />
                <Route path="/my-certificates" element={<ProtectedRoute><AppLayout><StudentCertificates /></AppLayout></ProtectedRoute>} />
                <Route path="/verify-certificate" element={<ProtectedRoute><AppLayout><VerifyCertificate /></AppLayout></ProtectedRoute>} />

                <Route path="/quiz" element={<ProtectedRoute><AppLayout><QuizList /></AppLayout></ProtectedRoute>} />
                <Route path="/quiz/create" element={<ProtectedRoute adminOnly><AppLayout><CreateQuiz /></AppLayout></ProtectedRoute>} />
                <Route path="/quiz/edit/:id" element={<ProtectedRoute adminOnly><AppLayout><EditQuiz /></AppLayout></ProtectedRoute>} />
                <Route path="/quiz/start/:quizId" element={<ProtectedRoute><AppLayout><StartQuiz /></AppLayout></ProtectedRoute>} />

                <Route path="/quiz/:quizId/questions" element={<ProtectedRoute adminOnly><AppLayout><QuestionList /></AppLayout></ProtectedRoute>} />
                <Route path="/quiz/:quizId/question/add" element={<ProtectedRoute adminOnly><AppLayout><AddQuestion /></AppLayout></ProtectedRoute>} />
                <Route path="/question/edit/:id" element={<ProtectedRoute adminOnly><AppLayout><EditQuestion /></AppLayout></ProtectedRoute>} />

                <Route path="/publish-result" element={<ProtectedRoute adminOnly><AppLayout><PublishResult /></AppLayout></ProtectedRoute>} />
                <Route path="/quiz-results" element={<ProtectedRoute><AppLayout><QuizResult /></AppLayout></ProtectedRoute>} />

                {/* Notifications & Feedback Routes */}
                <Route path="/notifications" element={<ProtectedRoute><AppLayout><Notifications /></AppLayout></ProtectedRoute>} />
                <Route path="/admin-feedback" element={<ProtectedRoute adminOnly><AppLayout><AdminFeedback /></AppLayout></ProtectedRoute>} />
                <Route path="/feedback" element={<ProtectedRoute><AppLayout><Feedback /></AppLayout></ProtectedRoute>} />
                <Route path="/feedback-history" element={<ProtectedRoute><AppLayout><FeedbackHistory /></AppLayout></ProtectedRoute>} />

                {/* Reports Route */}
                <Route path="/reports" element={<ProtectedRoute adminOnly><AppLayout><Reports /></AppLayout></ProtectedRoute>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
