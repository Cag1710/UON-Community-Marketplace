import React from "react";
import Navbar from "../components/Navbar";
import Recieving from "../components/Recieving";

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
                
                    </div>
                    <div style={styles.right}>
                            
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
        width: "100vw"
    },
    left: {
        backgroundColor: "white",
        width: "32%",
        height: "100vh",
        borderRadius: "0px 10px 0px 0px",
        marginTop: "10px",
        marginRight: "10px",
        float: "left",
        overflowY: "auto"
    },
    center: {
        backgroundColor: "white",
        width: "34.55%",
        height: "100vh",
        borderRadius: "10px 10px 0px 0px",
        marginTop: "10px",
        marginRight: "10px",
        float: "left"
    },
    right: {
        backgroundColor: "white",
        width: "32%",
        height: "100vh",
        borderRadius: "10px 0px 0px 0px",
        marginTop: "10px",
        float: "left"
    },
    body: {
        margin: "0px"
    }
}

