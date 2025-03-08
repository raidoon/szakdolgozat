import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
  //------------------------------------------ cimek
  focim: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  alcim: {
    //rovid alcimhez
    fontSize: 20,
    color: "grey",
    textAlign: "center",
    marginBottom: 20,
  },
  alcim2: {
    //hosszabb alcimhez
    fontSize: 16,
    color: "grey",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  //--------------------------------- CHECKBOX
  checkboxView: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#000",
    marginRight: 8,
  },
  bepipaltCheckbox: {
    backgroundColor: '#0047AB'
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    width: "100%",
    height: 50,
    marginBottom: 15,
  },
  bejelentkezes_Input: {
    width: "90%",
    height: "100%",
    marginLeft: 10,
  },
  bejelentkezes_Gomb: {
    padding: 15,
    backgroundColor:"#0096FF",
    //backgroundColor: "#0047AB",
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
    borderColor: "#0057FF",
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
    color: "#0057FF",
    fontWeight: "bold",
    fontSize: 16,
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
  marVanFiokom: {
    color: "#888",
    fontSize: 14,
  },
  marVanFiokomText:{
    color: "#0057FF",
    fontWeight: "bold",
  },
  regisztraciosGomb:{
    backgroundColor:"#0096FF",
    //backgroundColor: "#0047AB",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  regisztraciosGombSzoveg:{
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  hibaKiiras:{
    color: "red",
    fontSize: 12,
    marginBottom: 15,
    marginTop: 0,
    textAlign: "center",
  },
  //------------------------------------ TANULO_KEDZDOLAP

  //------------------------------------ TANULO_ORAI
  naptarNyitogatoGombView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6495ED",
    elevation: 3,
    marginBottom: 20,
    minHeight: 60,
  },
  naptarNyitogatoGombView2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ccccff",
    elevation: 3,
    minHeight: 60,
  },
  //------------------------------------ TANULO_PROFIL
  profilView: {
    alignItems: "center",
    marginBottom: 30,
  },
  profilNev: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  profilEmail: {
    fontSize: 16,
    color: "#888",
  },
  profilGombokView: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    paddingHorizontal: 15,
  },
  gombRipple:{
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  gombText:{
    flex: 1,
    fontSize: 18,
    color: "#333",
    marginLeft: 15,
  },
  kijelentkezesGomb:{
    backgroundColor: "#FF4444",
    borderRadius: 25,
    padding: 15,
    alignItems: "center",
    marginTop: 30,
  },
  kijelentkezesGombText:{
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  //------------------------------------ KIJELENTKEZES MODAL 
  modalNagyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalKisView: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'left',
  },
  modalCim: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  modalLeiras: {
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 30,
  },
  modalGombView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalMegseGomb: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  modalMegseGombText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalKijelentkezesGomb: {
    backgroundColor: '#FF4444',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalKijelentkezesGombText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
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
    maxHeight: "auto",
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
  kivalasztottDatumOraViewBelsoResze: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#f8f9ff",
    borderRadius: 10,
    padding: 15,
  },
  kivalasztottDatumOraCim: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3A86FF",
    marginBottom: 15,
  },
  kivalasztottDatumOraTipus: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  kivalasztottDatumOraHonapNap: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2d4150",
  },
  kivalasztottDatumOraHonapNapHetvege: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ED4337",
  },
  kivalasztottDatumOraPerc: {
    marginLeft: "auto",
    fontSize: 16,
    fontWeight: "bold",
  },
  nincsOraView: {
    alignItems: "center",
    padding: 20,
  },
  nincsOraText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 10,
  },
  oraDatuma: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4169E1",
  },
  oraIdeje: {
    fontSize: 14,
    color: "#666",
  },
  oraElem: {
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
  naptarView: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  naptar: {
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
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lenyiloHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3A86FF",
  },
});

export default Styles;
