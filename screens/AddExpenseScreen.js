// screens/AddExpenseScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Button,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function AddExpenseScreen() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Handle Date Change
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  // Handle Save
  const handleSave = () => {
    console.log("Saved Expense:", {
      amount,
      category,
      description,
      date: date.toDateString(),
    });
    alert("Expense Saved ✅");
    setAmount("");
    setCategory("");
    setDescription("");
    setDate(new Date());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Expense</Text>

      {/* Amount Input */}
      <TextInput
        style={styles.input}
        placeholder="Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      {/* Category Input (simple dropdown alternative for now) */}
      <TextInput
        style={styles.input}
        placeholder="Category (e.g., Food, Transport)"
        value={category}
        onChangeText={setCategory}
      />

      {/* Date Picker */}
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateText}>Date: {date.toDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      {/* Description */}
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {/* Save Button (Floating style) */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>💾 Save Expense</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    padding: 20,
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 1,
  },
  dateButton: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 1,
  },
  dateText: { fontSize: 16 },
  saveButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    elevation: 3,
  },
  saveButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});
