// screens/AddRevenueScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFinance } from "../hooks/useFinance";

export default function AddRevenueScreen({ navigation }) {
  const { addRevenue, loading } = useFinance();
  
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [source, setSource] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  const handleSave = async () => {
    if (!amount || !description) {
      Alert.alert("Error", "Please fill in amount and description");
      return;
    }

    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    const revenueData = {
      amount: parseFloat(amount),
      description: description.trim(),
      source: source.trim() || "Other",
      date: date.toISOString().split('T')[0],
    };

    const result = await addRevenue(revenueData);
    
    if (result.success) {
      Alert.alert("Success", "Revenue Added ✅");
      // Reset form
      setAmount("");
      setDescription("");
      setSource("");
      setDate(new Date());
      navigation.goBack();
    } else {
      Alert.alert("Error", result.error || "Failed to add revenue");
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Add New Revenue</Text>

        {/* Amount Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Amount *</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        {/* Description Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={styles.input}
            placeholder="Salary, Freelance, Investment, etc."
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Source Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Source</Text>
          <TextInput
            style={styles.input}
            placeholder="Company, Client, etc. (optional)"
            value={source}
            onChangeText={setSource}
          />
        </View>

        {/* Date Picker */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date *</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>{formatDate(date)}</Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChangeDate}
          />
        )}
      </ScrollView>

      {/* Save Button */}
      <TouchableOpacity 
        style={[
          styles.saveButton, 
          loading && styles.saveButtonDisabled
        ]} 
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.saveButtonText}>
          {loading ? "⏳ Adding..." : "💰 Add Revenue"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  title: { 
    fontSize: 22, 
    fontWeight: "bold", 
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  dateButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  dateText: { 
    fontSize: 16,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  saveButtonDisabled: {
    backgroundColor: "#CCCCCC",
  },
  saveButtonText: { 
    color: "white", 
    fontSize: 18, 
    fontWeight: "bold" 
  },
});