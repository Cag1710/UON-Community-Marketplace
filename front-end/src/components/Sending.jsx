import React from 'react';
import ProfileIcon from "../assets/profile.svg"

function Sending() {
    return(
        <div style={styles.inputBox}>
            <form>
                <input type="text" placeholder="Aa" style={styles.input} />
            </form>
        </div>
    );
    
}

const styles = {
    inputBox: {
    padding: "10px",
    width: "100%",
    boxSizing: "border-box",
  },
  input: {
    width: "95%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "90px"
  },
}

export default Sending;