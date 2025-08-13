import React from "react";
import Navbar from "../components/Navbar";
import Recieving from "../components/Recieving";
import Sending from "../components/Sending";
import ProfileIcon from "../assets/profile.svg"
import MessageListing from "../components/MessageListing";

export default function MessagePage() {
    
    return(
        <div style={styles.bg}>
            <div>
                <Navbar />
            </div>
            <div>
                <div style={styles.container}>
                    <div style={styles.left}>
                        <Recieving />
                        <Recieving />
                        <Recieving />
                    </div>
                    <div style={styles.center}>
                        <div style={styles.profileContainer}>
                            <img src={ProfileIcon} alt="Profile Icon" style={styles.profileIcon} />
                        </div>

                        <div style={styles.chatContent}>
                            <div style={styles.messageWrapperLeft}>
                                <p style={styles.recievedMessage}>Received</p>
                            </div>
                            <div style={styles.messageWrapperRight}>
                                <p style={styles.sentMessage}>Sent</p>
                            </div>
                        </div>

                        <Sending />
                    </div>
                    <div style={styles.right}>
                        <MessageListing />
                    </div>
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
    center: {
        backgroundColor: "white",
        width: "34.55%",
        height: "100%",
        borderTopLeftRadius: "10px",
        borderTopRightRadius: "10px",
        display: "flex",
        flexDirection: "column",
    },
    right: {
        backgroundColor: "white",
        width: "32%",
        height: "100%",
        borderTopLeftRadius: "10px",
        overflowY: "auto"
    },
    profileContainer: {
        padding: "10px",
        borderBottom: "1px solid #ccc",
        textAlign: "center"
    },
    profileIcon: {
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        objectFit: "cover"
    },
    chatContent: {
        flexGrow: 1,
        overflowY: "auto",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "10px",
        paddingBottom: "0px",
        justifyContent: "flex-end"
    },
    messageWrapperLeft: {
        textAlign: "left",
        marginBottom: "5px"
    },
    messageWrapperRight: {
        textAlign: "right",
        paddingRight: "20px",
        marginBottom: "5px"
    },
    recievedMessage: {
        display: "inline-block",
        padding: "10px",
        backgroundColor: "grey",
        borderTopLeftRadius: "10px",
        borderTopRightRadius: "10px",
        borderBottomRightRadius: "10px",
        color: "white",
        maxWidth: "70%",
        wordBreak: "break-word",
        fontFamily: 'Roboto, sans-serif'
    },
    sentMessage: {
        display: "inline-block",
        padding: "10px",
        backgroundColor: "#007bff",
        borderTopLeftRadius: "10px",
        borderTopRightRadius: "10px",
        borderBottomLeftRadius: "10px",
        color: "white",
        maxWidth: "70%",
        wordBreak: "break-word",
        fontFamily: 'Roboto, sans-serif'
    }
}

