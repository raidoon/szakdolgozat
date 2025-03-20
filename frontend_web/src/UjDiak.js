import { useState } from "react";
import Navbar from "./Navbar";
import Ipcim from "./Ipcim";

const UjDiak = () => {
    const [nev, setNev] = useState("");
    const [uzenet, setUzenet] = useState("");

    const ujDiakFelvetel = () => {
        fetch(Ipcim.Ipcim + "/ujdiak", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tanulo_neve: nev }),
        })
            .then((res) => res.json())
            .then((data) => setUzenet(data.uzenet))
            .catch((error) => setUzenet("Hiba történt!"));
    };

    return (
        <div>
            <Navbar />
            <h2>Új Diák Felvétele</h2>
            <input
                type="text"
                placeholder="Diák neve"
                value={nev}
                onChange={(e) => setNev(e.target.value)}
            />
            <button onClick={ujDiakFelvetel}>Felvétel</button>
            {uzenet && <p>{uzenet}</p>}
        </div>
    );
};

export default UjDiak;
