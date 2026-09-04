import { useEffect, useState } from "react";
import { CheckCheck, Filter } from "lucide-react";
import NotificationCard from "../components/NotificationCard";
import notificationService from "../services/notificationService";

function Notifications() {

    const [notifications, setNotifications] = useState([]);
    const [filteredNotifications, setFilteredNotifications] = useState([]);
    const [search, setSearch] = useState("");
    const [activeType, setActiveType] = useState("ALL");
    const [unreadCount, setUnreadCount] = useState(0);

    const userId = localStorage.getItem("userId");

    const types = ["ALL", "GENERAL", "REGISTRATION", "PAYMENT", "FEEDBACK", "CERTIFICATE"];

    useEffect(() => {
        loadNotifications();
    }, []);

    useEffect(() => {
        filterNotifications();
    }, [search, notifications, activeType]);

    const loadNotifications = () => {

        notificationService
            .getUserNotifications(userId)
            .then((response) => {
                setNotifications(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

        notificationService
            .countUnreadNotifications(userId)
            .then((response) => {
                setUnreadCount(response.data);
            })
            .catch(console.error);
    };

    const filterNotifications = () => {

        let data = notifications;

        if (activeType !== "ALL") {
            data = data.filter((n) => n.type === activeType);
        }

        if (search.trim() !== "") {
            data = data.filter((n) =>
                n.title.toLowerCase().includes(search.toLowerCase()) ||
                n.message.toLowerCase().includes(search.toLowerCase())
            );
        }

        setFilteredNotifications(data);
    };

    const markAsRead = (id) => {
        notificationService
            .markAsRead(id)
            .then(() => {
                loadNotifications();
            })
            .catch(console.error);
    };

    const markAllAsRead = () => {
        notificationService
            .markAllAsRead(userId)
            .then(() => {
                loadNotifications();
            })
            .catch(console.error);
    };

    const deleteNotification = (id) => {
        if (!window.confirm("Delete this notification?")) return;
        notificationService
            .deleteNotification(id)
            .then(() => {
                loadNotifications();
            })
            .catch(console.error);
    };

    const getTypeColor = (type) => {
        switch (type) {
            case "REGISTRATION":
                return { bg: "#dbeafe", color: "#1d4ed8" };
            case "PAYMENT":
                return { bg: "#dcfce7", color: "#15803d" };
            case "FEEDBACK":
                return { bg: "#fef3c7", color: "#b45309" };
            case "CERTIFICATE":
                return { bg: "#f3e8ff", color: "#7c3aed" };
            default:
                return { bg: "#f1f5f9", color: "#475569" };
        }
    };

    return (

        <div
            style={{
                padding: "30px",
                background: "#f8fafc",
                minHeight: "100vh"
            }}
        >

            {/* Header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "25px",
                    flexWrap: "wrap",
                    gap: "15px"
                }}
            >
                <div>
                    <h1 style={{ margin: 0, color: "#0f172a" }}>
                        Notifications
                    </h1>
                    <p style={{ marginTop: "5px", color: "#64748b" }}>
                        Total: <b>{notifications.length}</b>
                        {unreadCount > 0 && (
                            <span style={{ marginLeft: "12px", color: "#ef4444" }}>
                                Unread: <b>{unreadCount}</b>
                            </span>
                        )}
                    </p>
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <input
                        type="text"
                        placeholder="Search Notifications..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: "280px",
                            padding: "12px",
                            borderRadius: "10px",
                            border: "1px solid #cbd5e1",
                            outline: "none"
                        }}
                    />

                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "12px 18px",
                                borderRadius: "10px",
                                border: "none",
                                background: "#2563eb",
                                color: "white",
                                cursor: "pointer",
                                fontWeight: "600",
                                fontSize: "14px"
                            }}
                        >
                            <CheckCheck size={18} />
                            Mark All Read
                        </button>
                    )}
                </div>
            </div>

            {/* Type Filter Tabs */}
            <div
                style={{
                    display: "flex",
                    gap: "8px",
                    marginBottom: "25px",
                    flexWrap: "wrap"
                }}
            >
                {types.map((type) => {
                    const colors = getTypeColor(type);
                    const isActive = activeType === type;
                    return (
                        <button
                            key={type}
                            onClick={() => setActiveType(type)}
                            style={{
                                padding: "8px 16px",
                                borderRadius: "20px",
                                border: "none",
                                background: isActive ? colors.bg : "#f1f5f9",
                                color: isActive ? colors.color : "#64748b",
                                fontWeight: isActive ? "700" : "500",
                                cursor: "pointer",
                                fontSize: "13px",
                                transition: "all 0.2s"
                            }}
                        >
                            {type}
                        </button>
                    );
                })}
            </div>

            {/* Notification List */}
            {
                filteredNotifications.length === 0 ? (
                    <div
                        style={{
                            background: "white",
                            padding: "60px",
                            borderRadius: "15px",
                            textAlign: "center",
                            color: "#64748b"
                        }}
                    >
                        No Notifications Found
                    </div>
                ) : (
                    filteredNotifications.map((notification) => (
                        <NotificationCard
                            key={notification.id}
                            notification={notification}
                            onRead={markAsRead}
                            onDelete={deleteNotification}
                        />
                    ))
                )
            }

        </div>

    );

}

export default Notifications;
