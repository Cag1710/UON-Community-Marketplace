import React from 'react';
import ProfileIcon from "../assets/profile.svg"

function Recieving() {
    

    return(
        <div style={styles.container}>
            <img src={ProfileIcon} alt="Profile Icon" style={styles.profileIcon} />
            <p style={styles.username}>User</p>
            <p style={styles.lastMessage}>Last message</p>
        </div>
    );
}
``
const styles = {
    container: {
        padding: "10px",
        borderBottom: "2px solid black",
        position: "relative",
        opacity: "50%"
    },
    profileIcon: {
        width: '36px',
        height: '36px',
        backgroundColor: 'white',
        color: '#1A1A40',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold',
        fontSize: '18px',
        float: "left",
  },
  username: {
    paddingLeft: "50px",
    marginTop: "0px",
    fontWeight: "bold",
    fontFamily: 'Roboto, sans-serif'
  },
  lastMessage: {
    paddingLeft: "50px",
    lineHeight: "0px",
    fontFamily: 'Roboto, sans-serif'
  }
}

export default Recieving;