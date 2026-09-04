import { useEffect, useState } from "react";
import { Star, Trash2, Search, Filter, TrendingUp, MessageSquare } from "lucide-react";
import feedbackService from "../services/feedbackService";

function AdminFeedback() {

    const [feedbackList, setFeedbackList] = useState([]);
    const [filteredFeedback, setFilteredFeedback] = useState([]);
    const [stats, setStats] = useState(null);
    const [search, setSearch] = useState("");
    const [ratingFilter, setRatingFilter] = useState(0);

    useEffect(() => {
        loadFeedback();
        loadStats();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [search, ratingFilter, feedbackList]);

    const loadFeedback = () => {
        feedbackService
            .getAllFeedback()
            .then((response) => {
                setFeedbackList(response.data);
            })
            .catch(console.error);
    };

    const loadStats = () => {
        feedbackService
            .getFeedbackStats()
            .then((response) => {
                setStats(response.data);
            })
            .catch(console.error);
    };

    const applyFilters = () => {
        let data = [...feedbackList];

        if (search.trim() !== "") {
            data = data.filter(
                (f) =>
                    f.userName.toLowerCase().includes(search.toLowerCase()) ||
                    f.eventTitle.toLowerCase().includes(search.toLowerCase()) ||
                    (f.comments && f.comments.toLowerCase().includes(search.toLowerCase()))
            );
        }

        if (ratingFilter > 0) {
            data = data.filter((f) => f.rating === ratingFilter);
        }

        setFilteredFeedback(data);
    };

    const deleteFeedback = (id) => {

        if (!window.confirm("Delete this feedback?")) {
            return;
        }

        feedbackService
            .deleteFeedback(id)
            .then(() => {
                alert("Feedback Deleted");
                loadFeedback();
                loadStats();
            })
            .catch(console.error);
    };

    const getRatingPercent = (count) => {
        if (!stats || stats.totalFeedback === 0) return 0;
        return Math.round((count / stats.totalFeedback) * 100);
    };

    return (

        <div
            style={{
                padding: "30px",
                background: "#f8fafc",
                minHeight: "100vh"
            }}
        >

            <h2 style={{ color: "#1e293b", marginBottom: "25px" }}>
                Feedback Management
            </h2>

            {/* Stats Dashboard */}
            {stats && (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "20px",
                        marginBottom: "30px"
                    }}
                >
                    {/* Total Feedback */}
                    <div
                        style={{
                            background: "white",
                            padding: "25px",
                            borderRadius: "15px",
                            boxShadow: "0 8px 20px rgba(0,0,0,.08)",
                            display: "flex",
                            alignItems: "center",
                            gap: "15px"
                        }}
                    >
                        <div
                            style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "12px",
                                background: "#dbeafe",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <MessageSquare color="#2563eb" size={24} />
                        </div>
                        <div>
                            <div style={{ color: "#64748b", fontSize: "14px" }}>
                                Total Feedback
                            </div>
                            <div style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a" }}>
                                {stats.totalFeedback}
                            </div>
                        </div>
                    </div>

                    {/* Average Rating */}
                    <div
                        style={{
                            background: "white",
                            padding: "25px",
                            borderRadius: "15px",
                            boxShadow: "0 8px 20px rgba(0,0,0,.08)",
                            display: "flex",
                            alignItems: "center",
                            gap: "15px"
                        }}
                    >
                        <div
                            style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "12px",
                                background: "#fef3c7",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <TrendingUp color="#b45309" size={24} />
                        </div>
                        <div>
                            <div style={{ color: "#64748b", fontSize: "14px" }}>
                                Average Rating
                            </div>
                            <div style={{ fontSize: "28px", fontWeight: "700", color: "#f59e0b" }}>
                                {stats.averageRating.toFixed(1)} ⭐
                            </div>
                        </div>
                    </div>

                    {/* Rating Breakdown */}
                    <div
                        style={{
                            background: "white",
                            padding: "25px",
                            borderRadius: "15px",
                            boxShadow: "0 8px 20px rgba(0,0,0,.08)",
                            gridColumn: "span 1"
                        }}
                    >
                        <div style={{ color: "#64748b", fontSize: "14px", marginBottom: "12px" }}>
                            Rating Breakdown
                        </div>
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = star === 5
                                ? stats.fiveStarCount
                                : star === 4
                                    ? stats.fourStarCount
                                    : star === 3
                                        ? stats.threeStarCount
                                        : star === 2
                                            ? stats.twoStarCount
                                            : stats.oneStarCount;
                            return (
                                <div
                                    key={star}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        marginBottom: "6px"
                                    }}
                                >
                                    <span style={{ fontSize: "13px", width: "15px", color: "#475569" }}>
                                        {star}
                                    </span>
                                    <Star size={14} fill="#f59e0b" color="#f59e0b" />
                                    <div
                                        style={{
                                            flex: 1,
                                            height: "8px",
                                            background: "#f1f5f9",
                                            borderRadius: "4px",
                                            overflow: "hidden"
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: `${getRatingPercent(count)}%`,
                                                height: "100%",
                                                background: "#f59e0b",
                                                borderRadius: "4px"
                                            }}
                                        />
                                    </div>
                                    <span style={{ fontSize: "13px", color: "#64748b", width: "30px" }}>
                                        {count}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Filters */}
            <div
                style={{
                    display: "flex",
                    gap: "12px",
                    marginBottom: "25px",
                    flexWrap: "wrap"
                }}
            >
                <div style={{ position: "relative", flex: "1", minWidth: "250px" }}>
                    <Search
                        size={18}
                        style={{
                            position: "absolute",
                            left: "14px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#94a3b8"
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Search by user, event, or comment..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "12px 12px 12px 42px",
                            borderRadius: "10px",
                            border: "1px solid #cbd5e1",
                            outline: "none",
                            fontSize: "14px"
                        }}
                    />
                </div>

                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <Filter size={16} color="#64748b" />
                    {[0, 5, 4, 3, 2, 1].map((r) => (
                        <button
                            key={r}
                            onClick={() => setRatingFilter(r)}
                            style={{
                                padding: "8px 14px",
                                borderRadius: "20px",
                                border: "none",
                                background: ratingFilter === r ? "#2563eb" : "#f1f5f9",
                                color: ratingFilter === r ? "white" : "#64748b",
                                fontWeight: "600",
                                cursor: "pointer",
                                fontSize: "13px"
                            }}
                        >
                            {r === 0 ? "All" : `${r}⭐`}
                        </button>
                    ))}
                </div>
            </div>

            {/* Feedback List */}
            {
                filteredFeedback.length === 0 ? (
                    <div
                        style={{
                            background: "white",
                            padding: "60px",
                            borderRadius: "15px",
                            textAlign: "center",
                            color: "#64748b"
                        }}
                    >
                        No feedback found
                    </div>
                ) : (
                    filteredFeedback.map((feedback) => (
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
                                    alignItems: "flex-start"
                                }}
                            >
                                <div>
                                    <h3 style={{ margin: 0, color: "#0f172a" }}>
                                        {feedback.userName}
                                    </h3>
                                    <p style={{ margin: "5px 0 0", color: "#64748b" }}>
                                        {feedback.eventTitle}
                                    </p>
                                </div>

                                <button
                                    onClick={() => deleteFeedback(feedback.id)}
                                    style={{
                                        background: "#fee2e2",
                                        color: "#dc2626",
                                        border: "none",
                                        padding: "10px",
                                        borderRadius: "8px",
                                        cursor: "pointer"
                                    }}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    gap: "5px",
                                    marginTop: "15px"
                                }}
                            >
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={18}
                                        fill={feedback.rating >= star ? "#f59e0b" : "none"}
                                        color={feedback.rating >= star ? "#f59e0b" : "#cbd5e1"}
                                    />
                                ))}
                            </div>

                            {feedback.comments && (
                                <p
                                    style={{
                                        marginTop: "15px",
                                        color: "#475569",
                                        lineHeight: "1.6"
                                    }}
                                >
                                    {feedback.comments}
                                </p>
                            )}

                            <small style={{ color: "#94a3b8" }}>
                                {feedback.feedbackDate
                                    ? new Date(feedback.feedbackDate).toLocaleDateString()
                                    : ""}
                            </small>
                        </div>
                    ))
                )
            }

        </div>

    );

}

export default AdminFeedback;
