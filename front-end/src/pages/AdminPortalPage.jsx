import React, {useState} from "react";
import Navbar from "../components/Navbar";
import AdminListings from "../components/AdminListings";
import AdminAccounts from "../components/AdminAccounts";
import AdminReportedContent from "../components/AdminReportedContent";
import useUser from "../useUser";


export default function AdminPortalPage() {
    const [activeTab, setActiveTab] = useState("listings");
    const { user, isAdmin, isLoading } = useUser();

    if (isLoading) return <p>Loading...</p>;
    if (!user) return <p>You must be logged in.</p>;
    if (!isAdmin) return <p>🚫 Access denied: Admins only.</p>;

    const renderContent = () => {
        switch(activeTab){
            case "listings":    return <AdminListings />;
            case "accounts":    return <AdminAccounts />;
            case "reports":     return <AdminReportedContent />
            default:            return null;
        }
    };

    const buttons = [
        { label: "Manage Listings", key: "listings" },
    { label: "User Accounts", key: "accounts" },
    { label: "Reported Content", key: "reports" }
    ];

    const getButtonStyle = (key) => {
        return {
            ...styles.button,
            ...(activeTab === key ? styles.activeButton : {})
        };
    };

    return(
        <div style={styles.bg}>
            <div>
                <Navbar />
            </div>

            <div style={styles.container}>
                <div style={styles.left}>
                    {buttons.map(btn => (
                        <button
                            key={btn.key}
                            onClick={() => setActiveTab(btn.key)}
                            style={getButtonStyle(btn.key)}
                            onMouseEnter={e => e.target.style.backgroundColor = activeTab === btn.key ? "#007bff" : "#e0e0e0"}
                            onMouseLeave={e => e.target.style.backgroundColor = activeTab === btn.key ? "#007bff" : "#f5f5f5"}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
                <div style={styles.right}>
                    {renderContent()}
                </div>
            </div>
        </div>
        
    );
}

const styles = {
    bg: {
        backgroundColor: "#2E2F36",
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        margin: 0,
        padding: 0,
        overflow: "hidden"
    },
   container: {
        display: "flex",
        height: "100vh",
        gap: "10px",
        paddingTop: "10px",
   },
   left: {
        backgroundColor: "white",
        width: "32%",
        height: "100%",
        borderTopRightRadius: "10px",
        overflowY: "auto"
    },
    right: {
        flexGrow: 1,
        backgroundColor: "white",
        height: "100%",
        borderTopLeftRadius: "10px",
        overflowY: "auto"
    },
    button: {
        width: "100%",
        margin: "10px auto",
        padding: "10px",
        fontSize: "16px",
        border: "1px solid #ccc",
        cursor: "pointer",
        backgroundColor: "#f5f5f5",
        transition: "background-color 0.2s",
    },
    activeButton: {
        backgroundColor: "#4A72A4",
        color: "white",
        fontWeight: "bold",
    },
    hoverButton: {
        backgroundColor: "#e0e0e0"
    }
}

