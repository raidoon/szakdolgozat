import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
  //------------------------------------------ cimek
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
  //------------------------------------ REGISZTRACIO.JS
  //------------------------------------ TANULO_ORAI
  naptarNyitogatoGombView:{
    flexDirection: 'row', 
    alignItems:'center',
    justifyContent: 'center',
    backgroundColor: '#ccccff',
    elevation: 3,
    marginBottom: 20,
    minHeight:60
  },
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
  profilView:{
    alignItems: "center",
    marginBottom: 30,
  },
  profilNev:{
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  profilEmail:{
    fontSize: 16,
    color: "#888",
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
  //-------------------------- TANULÓ KINYITOTT DÁTUMOK SCREEN
  kivalasztottDatumOraView: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#6A5AE0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  kivalasztottDatumOraView2: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#6A5AE0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    justifyContent: 'center',
  },
  kivalasztottDatumOraCim:{
    fontSize: 20,
    fontWeight: "bold",
    color: "#6A5AE0",
    marginBottom: 15,
  },
  kivalasztottDatumOsztalyElem:{
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9ff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  osztalyReszletek:{
    flex: 1,
  },
  osztalyNev:{
    fontSize: 16,
    fontWeight: "600",
    color: "#2d4150",
  },
  osztalyIdopont:{
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  oszatlyIcon:{
    backgroundColor: "#e8eafc",
    borderRadius: 8,
    padding: 10,
    marginRight: 15,
  },
  nincsOraView:{
    alignItems: "center",
    padding: 20,
  },
  nincsOraText:{
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 10,
  },
  oraDatuma:{
    fontSize: 16,
    fontWeight: "bold",
    color: "#2d4150",
  },
  oraIdeje:{
    fontSize: 14,
    color: "#666",
  },
  oraElem:{
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  naptarView:{
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  naptar:{
    marginBottom: 10,
  },
  lenyiloHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lenyiloHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6A5AE0",
  },
});

export default Styles;
