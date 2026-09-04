import { useEffect, useState } from "react";
import { Star, Trash2, Calendar } from "lucide-react";
import feedbackService from "../services/feedbackService";

function FeedbackHistory() {

    const [feedbackList, setFeedbackList] = useState([]);

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        loadFeedback();
    }, []);

    const loadFeedback = () => {

        feedbackService

            .getMyFeedback(userId)

            .then((response) => {

                setFeedbackList(response.data);

            })

            .catch((error) => {

                console.log(error);

            });

    };

    const deleteFeedback = (id) => {

        if (!window.confirm("Delete this feedback?")) {

            return;

        }

        feedbackService

            .deleteFeedback(id)

            .then(() => {

                alert("Feedback Deleted Successfully");

                loadFeedback();

            })

            .catch(console.error);

    };

    return (

        <div
            style={{
                padding: "30px",
                background: "#f8fafc",
                minHeight: "100vh"
            }}
        >

            <h2
                style={{
                    color: "#1e293b",
                    marginBottom: "25px"
                }}
            >

                My Feedback History

            </h2>

            {

                feedbackList.length === 0 ?

                    (

                        <div
                            style={{
                                background: "white",
                                padding: "40px",
                                borderRadius: "12px",
                                textAlign: "center",
                                color: "#64748b"
                            }}
                        >

                            No feedback submitted yet.

                        </div>

                    )

                    :

                    feedbackList.map((feedback) => (

                        <div

                            key={feedback.id}

                            style={{

                                background: "white",

                                padding: "25px",

                                marginBottom: "20px",

                                borderRadius: "15px",

                                boxShadow: "0 10px 25px rgba(0,0,0,.08)"

                            }}

                        >

                            <div

                                style={{

                                    display: "flex",

                                    justifyContent: "space-between",

                                    alignItems: "center"

                                }}

                            >

                                <div>

                                    <h3>

                                        {feedback.eventTitle}

                                    </h3>

                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "4px",
                                            marginTop: "8px"
                                        }}
                                    >

                                        {

                                            [1,2,3,4,5].map((star)=>(

                                                <Star

                                                    key={star}

                                                    size={18}

                                                    fill={
                                                        feedback.rating>=star
                                                            ? "#f59e0b"
                                                            : "none"
                                                    }

                                                    color={
                                                        feedback.rating>=star
                                                            ? "#f59e0b"
                                                            : "#cbd5e1"
                                                    }

                                                />

                                            ))

                                        }

                                    </div>

                                </div>

                                <button

                                    onClick={() => deleteFeedback(feedback.id)}

                                    style={{

                                        border: "none",

                                        background: "#fee2e2",

                                        color: "#dc2626",

                                        padding: "10px",

                                        borderRadius: "8px",

                                        cursor: "pointer"

                                    }}

                                >

                                    <Trash2 size={18}/>

                                </button>

                            </div>

                            <p

                                style={{

                                    marginTop: "20px",

                                    color: "#475569",

                                    lineHeight: "1.7"

                                }}

                            >

                                {feedback.comments}

                            </p>

                            <div

                                style={{

                                    marginTop: "20px",

                                    display: "flex",

                                    alignItems: "center",

                                    gap: "8px",

                                    color: "#64748b"

                                }}

                            >

                                <Calendar size={16}/>

                                {feedback.feedbackDate}

                            </div>

                        </div>

                    ))

            }

        </div>

    );

}

export default FeedbackHistory;