import { StyleSheet } from "react-native";

const Oktato_Styles = StyleSheet.create({
     //--------------------------Oktato_Diakok.js
  diakok_container:{
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  //-----------------------Oktato_TanuloReszletei.js
  reszletek_container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  //-----------------------Oktato_Datumok.js
  navigateButton: {
    padding:20,
    backgroundColor: "#4CAF50", // Zöld gomb
    paddingVertical: 15, // Nagyobb magasság
    paddingHorizontal: 30, // Kényelmes szélesség
    borderRadius: 25, // Lekerekített gomb
    shadowColor: "#000", // Árnyék a modern hatásért
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Android árnyék
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20, // Távolság a többi elemtől
    
  },
  navigateButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1.5, // Szebb kinézet
  },
  focim: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
},
nincsOra: {
    fontSize: 18,
    color: "gray",
    marginTop: 20,
},
oraKartya: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: "90%",
    alignItems: "center",
},
nev: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
},
gomb: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
},
gombSzoveg: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
},
})

export default Oktato_Styles;