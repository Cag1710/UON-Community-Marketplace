// import React from 'react';

function Recieving() {
    

    return(
        <div style={styles.container}>
            <div style={styles.left}>
            
            </div>
            <div style={styles.center}>

            </div>
            <div style={styles.right}>
            
            </div>
        </div>
    );
}

const styles = {
    container: {
       
    },
    left: {
        backgroundColor: "white",
        width: "32%",
        height: "100vh",
        borderRadius: "0px 10px 0px 0px",
        marginTop: "10px",
        marginRight: "10px",
        float: "left"
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
    }
}

export default Recieving;