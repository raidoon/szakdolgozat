import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Tanulok = () => {
    const navigate = useNavigate();

    return (
        <div style={{ backgroundColor: "#f5f9ff", minHeight: "100vh" }}>
            <Navbar />
            <div style={{
                maxWidth: "600px",
                margin: "0 auto",
                padding: "30px",
                backgroundColor: "white",
                borderRadius: "10px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                marginTop: "30px",
                textAlign: "center"
            }}>
                <h2 style={{
                    color: "#2c7be5",
                    marginBottom: "30px",
                    borderBottom: "2px solid #e1e7ec",
                    paddingBottom: "15px"
                }}>
                    Tanulók kezelése
                </h2>
                
                <div style={{ 
                    display: "flex", 
                    flexDirection: "column",
                    gap: "15px",
                    alignItems: "center"
                }}>
                    <button 
                        onClick={() => navigate("/aktualisdiakok")}
                        style={{
                            padding: "12px 25px",
                            backgroundColor: "#2c7be5",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "15px",
                            fontWeight: "500",
                            transition: "all 0.2s",
                            width: "100%",
                            maxWidth: "300px",
                            boxShadow: "0 2px 5px rgba(44, 123, 229, 0.2)"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                        onMouseLeave={(e) => e.currentTarget.style.transform = "none"}
                    >
                        Aktuális Diákok
                    </button>
                    
                    <button 
                        onClick={() => navigate("/levizsgazottdiakok")}
                        style={{
                            padding: "12px 25px",
                            backgroundColor: "#2c7be5",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "15px",
                            fontWeight: "500",
                            transition: "all 0.2s",
                            width: "100%",
                            maxWidth: "300px",
                            boxShadow: "0 2px 5px rgba(0, 217, 126, 0.2)"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                        onMouseLeave={(e) => e.currentTarget.style.transform = "none"}
                    >
                        Levizsgázott Diákok
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Tanulok;


