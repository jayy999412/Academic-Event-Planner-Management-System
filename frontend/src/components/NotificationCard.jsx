import {
    Bell,
    CheckCircle,
    Trash2
} from "lucide-react";

function NotificationCard({

    notification,

    onRead,

    onDelete

}) {

    return (

        <div
            style={{
                background: "white",
                borderRadius: "15px",
                padding: "18px",
                marginBottom: "15px",
                boxShadow: "0 5px 15px rgba(0,0,0,0.06)",
                border: "1px solid #e2e8f0"
            }}
        >

            {/* Header */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px"
                    }}
                >

                    <div
                        style={{
                            width: "45px",
                            height: "45px",
                            borderRadius: "50%",
                            background: "#dbeafe",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >

                        <Bell color="#2563eb" />

                    </div>

                    <div>

                        <h3
                            style={{
                                margin: 0,
                                color: "#0f172a",
                                fontSize: "17px"
                            }}
                        >
                            {notification.title}
                        </h3>

                        <p
                            style={{
                                marginTop: "6px",
                                color: "#64748b",
                                fontSize: "14px"
                            }}
                        >
                            {notification.message}
                        </p>

                    </div>

                </div>

                {

                    notification.status === "UNREAD" ?

                        (

                            <span
                                style={{
                                    background: "#fee2e2",
                                    color: "#b91c1c",
                                    padding: "5px 12px",
                                    borderRadius: "20px",
                                    fontSize: "12px",
                                    fontWeight: "600"
                                }}
                            >
                                Unread
                            </span>

                        )

                        :

                        (

                            <span
                                style={{
                                    background: "#dcfce7",
                                    color: "#166534",
                                    padding: "5px 12px",
                                    borderRadius: "20px",
                                    fontSize: "12px",
                                    fontWeight: "600"
                                }}
                            >
                                Read
                            </span>

                        )

                }

            </div>

            {/* Date */}

            <div
                style={{
                    marginTop: "15px",
                    color: "#94a3b8",
                    fontSize: "13px"
                }}
            >

                {new Date(notification.notificationDate).toLocaleString()}

            </div>

            {/* Buttons */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                    marginTop: "18px"
                }}
            >

                {

                    notification.status === "UNREAD" && (

                        <button
                            onClick={() => onRead(notification.id)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                background: "#2563eb",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                padding: "8px 14px",
                                cursor: "pointer"
                            }}
                        >

                            <CheckCircle size={16} />

                            Mark Read

                        </button>

                    )

                }

                <button
                    onClick={() => onDelete(notification.id)}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        padding: "8px 14px",
                        cursor: "pointer"
                    }}
                >

                    <Trash2 size={16} />

                    Delete

                </button>

            </div>

        </div>

    );

}

export default NotificationCard;