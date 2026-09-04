import { useEffect, useState } from "react";
import { Star, MessageSquare, CheckCircle } from "lucide-react";
import feedbackService from "../services/feedbackService";
import { getStudentRegistrations } from "../services/registrationService";

function Feedback() {

    const [events, setEvents] = useState([]);
    const [feedback, setFeedback] = useState({
        eventId: "",
        rating: 0,
        comments: ""
    });
    const [submitting, setSubmitting] = useState(false);

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        loadAttendedEvents();
    }, []);

    const loadAttendedEvents = () => {

        getStudentRegistrations(userId)
            .then((response) => {

                const attended = response.data.filter(
                    (reg) =>
                        reg.attendanceStatus === "Present" &&
                        reg.status === "Approved"
                );

                setEvents(attended.map((reg) => reg.event));
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const submitFeedback = () => {

        if (feedback.eventId === "") {
            alert("Please select an event.");
            return;
        }

        if (feedback.rating === 0) {
            alert("Please select rating.");
            return;
        }

        setSubmitting(true);

        const request = {
            userId: Number(userId),
            eventId: Number(feedback.eventId),
            rating: feedback.rating,
            comments: feedback.comments
        };

        feedbackService
            .submitFeedback(request)
            .then(() => {

                alert("Feedback submitted successfully.");

                setFeedback({
                    eventId: "",
                    rating: 0,
                    comments: ""
                });

                setSubmitting(false);
            })
            .catch((err) => {

                console.log(err);
                const msg = err.response?.data || "Unable to submit feedback.";
                alert(typeof msg === "string" ? msg : "Unable to submit feedback.");
                setSubmitting(false);
            });
    };

    return (

        <div
            style={{
                padding: "30px",
                background: "#f8fafc",
                minHeight: "100vh"
            }}
        >

            <div
                style={{
                    maxWidth: "750px",
                    margin: "auto",
                    background: "#fff",
                    borderRadius: "15px",
                    padding: "35px",
                    boxShadow: "0 10px 30px rgba(0,0,0,.08)"
                }}
            >

                <h2
                    style={{
                        marginBottom: "5px",
                        color: "#1e293b"
                    }}
                >
                    Submit Feedback
                </h2>

                <p
                    style={{
                        color: "#64748b",
                        marginBottom: "30px"
                    }}
                >
                    Help us improve Academic Event Management System.
                </p>

                {events.length === 0 && (
                    <div
                        style={{
                            padding: "20px",
                            background: "#fef3c7",
                            borderRadius: "10px",
                            color: "#92400e",
                            marginBottom: "25px",
                            fontSize: "14px"
                        }}
                    >
                        You have no attended events eligible for feedback. You can only
                        submit feedback for events where your attendance is marked as Present.
                    </div>
                )}

                {/* Event */}
                <label style={{ fontWeight: "600" }}>Select Event</label>

                <select
                    value={feedback.eventId}
                    onChange={(e) =>
                        setFeedback({ ...feedback, eventId: e.target.value })
                    }
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "10px",
                        marginBottom: "30px",
                        borderRadius: "10px",
                        border: "1px solid #cbd5e1",
                        fontSize: "15px"
                    }}
                >
                    <option value="">Choose Event</option>
                    {events.map((event) => (
                        <option key={event.id} value={event.id}>
                            {event.eventTitle}
                        </option>
                    ))}
                </select>

                {/* Rating */}
                <label style={{ fontWeight: "600" }}>Rating</label>

                <div
                    style={{
                        display: "flex",
                        gap: "12px",
                        marginTop: "15px",
                        marginBottom: "35px"
                    }}
                >
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            size={36}
                            style={{ cursor: "pointer" }}
                            fill={feedback.rating >= star ? "#f59e0b" : "none"}
                            color={feedback.rating >= star ? "#f59e0b" : "#cbd5e1"}
                            onClick={() =>
                                setFeedback({ ...feedback, rating: star })
                            }
                        />
                    ))}
                </div>

                {/* Comments */}
                <label style={{ fontWeight: "600" }}>Comments</label>

                <div style={{ position: "relative" }}>
                    <MessageSquare
                        size={18}
                        style={{
                            position: "absolute",
                            left: "14px",
                            top: "16px",
                            color: "#94a3b8"
                        }}
                    />

                    <textarea
                        rows="6"
                        placeholder="Write your feedback..."
                        value={feedback.comments}
                        onChange={(e) =>
                            setFeedback({ ...feedback, comments: e.target.value })
                        }
                        style={{
                            width: "100%",
                            padding: "15px 15px 15px 45px",
                            marginTop: "10px",
                            borderRadius: "10px",
                            border: "1px solid #cbd5e1",
                            resize: "none",
                            fontSize: "15px",
                            boxSizing: "border-box"
                        }}
                    />
                </div>

                {/* Submit */}
                <button
                    onClick={submitFeedback}
                    disabled={submitting || events.length === 0}
                    style={{
                        marginTop: "35px",
                        width: "100%",
                        padding: "14px",
                        border: "none",
                        borderRadius: "10px",
                        background: submitting || events.length === 0 ? "#94a3b8" : "#2563eb",
                        color: "white",
                        fontWeight: "600",
                        fontSize: "16px",
                        cursor: submitting || events.length === 0 ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px"
                    }}
                >
                    <CheckCircle size={18} />
                    {submitting ? "Submitting..." : "Submit Feedback"}
                </button>

            </div>

        </div>

    );

}

export default Feedback;
