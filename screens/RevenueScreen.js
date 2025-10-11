import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";

export default function RevenueScreen() {
  const [amount, setAmount] = useState("");

  const handleAddRevenue = () => {
    if (!amount) {
      Alert.alert("Error", "Please enter an amount");
      return;
    }

    addRevenue(parseFloat(amount), () => {
      Alert.alert("Success", "Revenue added successfully ✅");
      setAmount("");
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Revenue</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TouchableOpacity style={styles.button} onPress={handleAddRevenue}>
        <Text style={styles.buttonText}>Add Revenue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
