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
                <Recieving />
            </div> 
        </div>
    );
}

const styles = {
    bg: {
        backgroundColor: "#2E2F36",
        height: "100vh",
        width: "100vw"
    }
}

