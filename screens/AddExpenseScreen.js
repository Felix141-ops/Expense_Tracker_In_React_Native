// screens/AddExpenseScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useExpenses } from "../hooks/useExpense";
import { useCategories } from "../hooks/useCategories";
import { useAuth } from "../contexts/AuthContext";

/// Add Expense screen component
/// Form to add new expenses with amount, category selection, date, and description
/// Floating save button for better UX
export default function AddExpenseScreen({ navigation }) {
  const { addExpense, loading } = useExpenses();
  const { categories, loading: categoriesLoading } = useCategories();
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Handle Date Change
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  // Handle Save
  const handleSave = async () => {
    // Validation
    if (!amount || !description || !categoryId) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    if (!user) {
      Alert.alert("Error", "Not authenticated. Please sign in.");
      return;
    }

    const expenseData = {
      amount: parseFloat(amount),
      description: description.trim(),
      category_id: categoryId,
      date: date.toISOString().split('T')[0],
      user_id: user.id,
    };

    const result = await addExpense(expenseData);
    
    if (result.success) {
      Alert.alert("Success", "Expense Saved ✅");
      // Reset form
      setAmount("");
      setCategoryId("");
      setDescription("");
      setDate(new Date());
      // Navigate back or stay based on your app flow
      navigation.goBack();
    } else {
      Alert.alert("Error", result.error || "Failed to save expense");
    }
  };

  const handleAddCategory = () => {
    navigation.navigate("ManageCategoriesScreen")
  };

  const handleSaveNewCategory = () => {
    if (!newCategoryName.trim()) {
      Alert.alert("Error", "Please enter a category name");
      return;
    }
    // For now, we'll just close the modal and let the user manage categories separately
    // In a full implementation, you would call createCategory here
    setShowCategoryModal(false);
    setNewCategoryName("");
    Alert.alert(
      "Manage Categories", 
      "Please use the 'Manage Categories' screen to add new categories.",
      [{ text: "OK", onPress: () => navigation.navigate("ManageCategoriesScreen") }]
    );
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryName = (id) => {
    const category = categories.find(cat => cat.id === id);
    return category ? category.name : "Select Category";
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Add New Expense</Text>

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

        {/* Category Selection */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category *</Text>
          <TouchableOpacity
            style={styles.categorySelector}
            onPress={() => setShowCategoryModal(true)}
          >
            <Text style={[
              styles.categorySelectorText,
              !categoryId && styles.placeholderText
            ]}>
              {getCategoryName(categoryId)}
            </Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>
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

        {/* Description */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter description..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Manage Categories Link */}
        <TouchableOpacity 
          style={styles.manageCategoriesLink}
          onPress={() => navigation.navigate("ManageCategoriesScreen")}
        >
          <Text style={styles.manageCategoriesText}>📁 Manage Categories</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Save Button (Floating style) */}
      <TouchableOpacity 
        style={[
          styles.saveButton, 
          loading && styles.saveButtonDisabled
        ]} 
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.saveButtonText}>
          {loading ? "⏳ Saving..." : "💾 Save Expense"}
        </Text>
      </TouchableOpacity>

      {/* Category Selection Modal */}
      <Modal
        visible={showCategoryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Category</Text>
            
            <ScrollView style={styles.categoriesList}>
              {categoriesLoading ? (
                <Text style={styles.loadingText}>Loading categories...</Text>
              ) : categories.length === 0 ? (
                <Text style={styles.noCategoriesText}>No categories found</Text>
              ) : (
                categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryItem,
                      categoryId === category.id && styles.categoryItemSelected
                    ]}
                    onPress={() => {
                      setCategoryId(category.id);
                      setShowCategoryModal(false);
                    }}
                  >
                    <View style={[styles.colorDot, { backgroundColor: category.color }]} />
                    <Text style={styles.categoryItemText}>{category.name}</Text>
                    {categoryId === category.id && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowCategoryModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.addCategoryButton]}
                onPress={handleAddCategory}
              >
                <Text style={styles.addCategoryButtonText}>+ New Category</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/// Page Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Space for floating button
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
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  categorySelector: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categorySelectorText: {
    fontSize: 16,
    color: "#333",
  },
  placeholderText: {
    color: "#999",
  },
  dropdownArrow: {
    color: "#666",
    fontSize: 12,
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
  manageCategoriesLink: {
    padding: 15,
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  manageCategoriesText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "500",
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  categoriesList: {
    maxHeight: 300,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  categoryItemSelected: {
    backgroundColor: "#F0F8FF",
    borderRadius: 8,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryItemText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  checkmark: {
    color: "#007AFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    padding: 20,
  },
  noCategoriesText: {
    textAlign: "center",
    color: "#999",
    fontSize: 16,
    padding: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#F0F0F0",
  },
  addCategoryButton: {
    backgroundColor: "#34C759",
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 16,
  },
  addCategoryButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});