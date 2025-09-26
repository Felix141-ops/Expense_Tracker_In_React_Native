// screens/ProfileScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Switch,
  TouchableOpacity,
  Alert,
} from "react-native";
/// Profile screen component
/// Displays user information and settings
/// Allows theme toggling, data export, and logout
export default function ProfileScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    Alert.alert("Theme Changed", `Dark Mode: ${!isDarkMode ? "On" : "Off"}`);
  };

  const handleExport = () => {
    Alert.alert("Export Data", "Your expense data has been exported ✅");
  };

  const handleLogout = () => {
    Alert.alert("Logout", "You have been logged out 🚪");
  };

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={require("../assets/icon.webp")}
          style={styles.profilePic}
        />
        <Text style={styles.name}>Felix Muia</Text>
        <Text style={styles.email}>felix@example.com</Text>
      </View>

      {/* Settings */}
      <View style={styles.settings}>
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Dark Mode</Text>
          <Switch value={isDarkMode} onValueChange={toggleTheme} />
        </View>

        <TouchableOpacity style={styles.settingRow} onPress={handleExport}>
          <Text style={styles.settingText}>Export Data</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingRow}>
          <Text style={styles.settingText}>Currency: USD ($)</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
/// Page Styling
/// Uses Flexbox for layout
/// Consistent padding and margin for spacing
/// Rounded corners for inputs and buttons
/// Primary color for buttons and links
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9", padding: 20 },
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  profilePic: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  name: { fontSize: 20, fontWeight: "bold" },
  email: { fontSize: 14, color: "gray" },
  settings: { marginBottom: 30 },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
  },
  settingText: { fontSize: 16 },
  logoutButton: {
    backgroundColor: "red",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
  },
  logoutText: { color: "white", fontSize: 18, fontWeight: "bold" },
});
