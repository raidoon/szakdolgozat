import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Tanulok = () => {
    const navigate = useNavigate();

    return (
        <div>
            <Navbar />
            <div style={styles.content}>
                <h2>Tanulók kezelése</h2>
                <button style={styles.button} onClick={() => navigate("/aktualisdiakok")}>Aktuális Diákok</button>
                <button style={styles.button} onClick={() => navigate("/levizsgazottdiakok")}>Levizsgázott Diákok</button>
                
                
            </div>
        </div>
    );
};

const styles = {
    content: {
        padding: "20px",
        textAlign: "center",
        margin: "20px",
    },
    button: {
        padding: "10px 20px",
        margin: "10px",
        fontSize: "16px",
        cursor: "pointer",
        borderRadius: "5px",
        border: "none",
        backgroundColor: "#007bff",
        color: "white",
    }
};

export default Tanulok;


