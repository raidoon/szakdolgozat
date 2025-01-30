import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
  focim: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  alcim: { //rovid alcimhez
    fontSize: 20,
    color: "grey",
    textAlign: "center",
    marginBottom: 20,
  },
  alcim2:{ //hosszabb alcimhez
    fontSize: 16,
    color: "grey",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  //------------------------------------------ BEJELENTKEZES.JS
  bejelentkezes_Container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  bejelentkezes_FormInputWrapper: {
    width: "90%",
    height: 55,
    backgroundColor: "#f7f9ef",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 8,
    marginBottom: 10,
  },
  bejelentkezes_Input: {
    width: "90%",
    height: "100%",
    marginLeft: 10,
  },
  bejelentkezes_Gomb: {
    padding: 15,
    backgroundColor: "#020202",
    alignItems: "center",
    borderRadius: 10,
    width: "90%",
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  bejelentkezes_bejelentkezoGomb: {
    color: "#FFFF",
  },
  bejelentkezes_regisztaciosGomb: {
    width: "100%",
    marginTop: 7,
    borderColor: "#FF6C00",
    backgroundColor: "#fff",
    borderWidth: 1,
    paddingVertical: 10,
  },
  bejelentkezes_kerdes: {
    width: "90%",
    marginTop: 20,
  },
  bejelentkezes_kerdesSzoveg: {
    fontSize: 16,
    marginRight: 5,
    marginTop: 10,
  },
  bejelentkezes_regiGombSzoveg: {
    color: "#FF6C00",
  },
  jelszoInput: {
    flex: 1,
    paddingHorizontal: 8,
  },
  focim: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  alcim: {
    fontSize: 14,
    color: "#888",
    marginBottom: 30,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#000",
  },
  /**
   bejelentkezes_support:{
    fontSize:17,
    fontWeight: '600'
   },
   bejelentkezes_nemEngedBejelentkezni:{
    width:'90%',
    alignItems:'center',
    marginTop:20
   }
*/
  //------------------------------------ REGISZTRACIO.JS
  //------------------------------------ TANULO_PROFIL
  profil_gombDiv: {
    flexDirection: "row",
    marginBottom: 0,
    marginTop: 0,
  },
  profileGombok: {
    width: "100%",
    marginTop: 7,
    paddingVertical: 10,
  },
  //------------------------------------ PROFILSCREENS
  //--------------------- kapcsolat
  kapcsolatNagyDiv: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#grey",
    alignItems: "center",
  },
  kapcsolatBuborek: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginTop: 50,
    alignItems: "center",
    textAlign: "center",
    width: 250,
    padding: 15,
    minHeight: 100,
    maxHeight: 'auto',
  },
  //--------------------------Oktato_Diakok.js
});

export default Styles;
