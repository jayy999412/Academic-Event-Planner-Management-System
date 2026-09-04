import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import notificationService from "../services/notificationService";

function NotificationBell() {

    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);

    const [count, setCount] = useState(0);

    const [open, setOpen] = useState(false);

    // Temporary user id
    const userId = localStorage.getItem("userId");

    useEffect(() => {

        loadNotifications();

    }, []);

    const loadNotifications = () => {

        if (!userId) return;

        notificationService
            .getUnreadNotifications(userId)
            .then((res) => {

                setNotifications(res.data);

            })
            .catch(console.error);

        notificationService
            .countUnreadNotifications(userId)
            .then((res) => {

                setCount(res.data);

            })
            .catch(console.error);

    };

    return (

        <div style={{ position: "relative" }}>

            <button

                onClick={() => setOpen(!open)}

                style={{
                    position: "relative",
                    width: "38px",
                    height: "38px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "10px",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    color: "#64748b"
                }}

            >

                <Bell size={20} />

                {

                    count > 0 && (

                        <span

                            style={{
                                position: "absolute",
                                top: "5px",
                                right: "5px",
                                background: "#ef4444",
                                color: "white",
                                fontSize: "10px",
                                fontWeight: "bold",
                                width: "18px",
                                height: "18px",
                                borderRadius: "50%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}

                        >

                            {count}

                        </span>

                    )

                }

            </button>

            {

                open && (

                    <div

                        style={{
                            position: "absolute",
                            right: 0,
                            top: "45px",
                            width: "360px",
                            background: "white",
                            borderRadius: "15px",
                            boxShadow: "0 10px 30px rgba(0,0,0,.15)",
                            border: "1px solid #e2e8f0",
                            overflow: "hidden",
                            zIndex: 100
                        }}

                    >

                        <div

                            style={{
                                padding: "15px",
                                fontWeight: "bold",
                                borderBottom: "1px solid #e2e8f0"
                            }}

                        >

                            Notifications

                        </div>

                        {

                            notifications.length === 0 ?

                                (

                                    <div

                                        style={{
                                            padding: "20px",
                                            textAlign: "center",
                                            color: "#64748b"
                                        }}

                                    >

                                        No New Notifications

                                    </div>

                                )

                                :

                                notifications.slice(0,5).map((notification) => (

                                    <div

                                        key={notification.id}

                                        style={{
                                            padding: "15px",
                                            borderBottom: "1px solid #f1f5f9"
                                        }}

                                    >

                                        <div

                                            style={{
                                                fontWeight: "600",
                                                color: "#0f172a"
                                            }}

                                        >

                                            {notification.title}

                                        </div>

                                        <div

                                            style={{
                                                fontSize: "13px",
                                                color: "#64748b",
                                                marginTop: "5px"
                                            }}

                                        >

                                            {notification.message}

                                        </div>

                                    </div>

                                ))

                        }

                        <button

                            onClick={() => {

                                navigate("/notifications");

                                setOpen(false);

                            }}

                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "none",
                                background: "#2563eb",
                                color: "white",
                                cursor: "pointer",
                                fontWeight: "600"
                            }}

                        >

                            View All Notifications

                        </button>

                    </div>

                )

            }

        </div>

    );

}

export default NotificationBell;