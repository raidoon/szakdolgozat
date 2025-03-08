import { StyleSheet } from "react-native";

const Oktato_Styles = StyleSheet.create({
  //-----------------------Oktato_TanuloReszletei.js
  reszletek_container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  //-----------------------Oktato_Datumok.js
  diakok_container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 28,
    fontFamily: "Inter-Bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#2C3E50",
  },
  itemContainer: {
    backgroundColor: "#F8F9FA",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  itemName: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#2C3E50",
  },
  itemEmail: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#7F8C8D",
    marginTop: 4,
  },
  navigateButton: {
    backgroundColor: "#4CAF50", // Green color for primary button
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#4CAF50", // Green shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  navigateButtonSecondary: {
    backgroundColor: "transparent",
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#4CAF50", // Green border for secondary button
  },
  navigateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
  },
  navigateButtonSecondaryText: {
    color: "#4CAF50", // Green text for secondary button
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
  },
})

export default Oktato_Styles;