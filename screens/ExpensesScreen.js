// screens/ExpensesScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from "react-native";
import { useExpenses } from "../hooks/useExpense";

/// Expense screen component
/// Search and filter expenses
/// Displays list of expenses with category icons and delete functionality
export default function ExpensesScreen() {
  const { expenses, loading, error, removeExpense, refreshExpenses } = useExpenses();
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  // Available filters
  const filters = ["All", "Today", "This Week", "Food", "Transport", "Rent", "Entertainment", "Utilities"];

  // Filter expenses based on search and selected filter
  useEffect(() => {
    if (!expenses) return;

    let result = expenses.filter((expense) => {
      // Search filter
      const matchesSearch = expense.description
        .toLowerCase()
        .includes(search.toLowerCase()) ||
        (expense.categories?.name || '').toLowerCase().includes(search.toLowerCase());

      // Category filter
      let matchesFilter = true;
      if (selectedFilter !== "All") {
        if (selectedFilter === "Today") {
          const today = new Date().toDateString();
          const expenseDate = new Date(expense.date).toDateString();
          matchesFilter = today === expenseDate;
        } else if (selectedFilter === "This Week") {
          const today = new Date();
          const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
          const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
          const expenseDate = new Date(expense.date);
          matchesFilter = expenseDate >= startOfWeek && expenseDate <= endOfWeek;
        } else {
          matchesFilter = (expense.categories?.name || 'Uncategorized') === selectedFilter;
        }
      }

      return matchesSearch && matchesFilter;
    });

    // Sort by date (newest first)
    result.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setFilteredExpenses(result);
  }, [expenses, search, selectedFilter]);

  const handleDeleteExpense = (expenseId, description) => {
    Alert.alert(
      "Delete Expense",
      `Are you sure you want to delete "${description}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const result = await removeExpense(expenseId);
            if (!result.success) {
              Alert.alert("Error", result.error || "Failed to delete expense");
            }
          },
        },
      ]
    );
  };

  const getCategoryIcon = (categoryName) => {
    const icons = {
      'Food': '🍔',
      'Transport': '🚗',
      'Rent': '🏠',
      'Entertainment': '🎬',
      'Utilities': '💡',
      'Healthcare': '🏥',
      'Shopping': '🛍️',
    };
    return icons[categoryName] || '💰';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const formatAmount = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  const renderExpenseItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.icon}>
        {getCategoryIcon(item.categories?.name)}
      </Text>
      <View style={styles.expenseDetails}>
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.metaInfo}>
          <Text style={styles.category}>
            {item.categories?.name || 'Uncategorized'}
          </Text>
          <Text style={styles.date}>{formatDate(item.date)}</Text>
        </View>
      </View>
      <View style={styles.amountSection}>
        <Text style={[styles.amount, { color: "#FF6B6B" }]}>
          {formatAmount(item.amount)}
        </Text>
        <TouchableOpacity
          onPress={() => handleDeleteExpense(item.id, item.description)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && expenses.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading expenses...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading expenses</Text>
        <Text style={styles.errorSubText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={refreshExpenses}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search expenses or categories..."
        value={search}
        onChangeText={setSearch}
        clearButtonMode="while-editing"
      />

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          data={filters}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedFilter === item && styles.filterChipActive,
              ]}
              onPress={() => setSelectedFilter(item)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === item && styles.filterTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.filterRow}
        />
      </View>

      {/* Results Summary */}
      <View style={styles.resultsSummary}>
        <Text style={styles.resultsText}>
          {filteredExpenses.length} {filteredExpenses.length === 1 ? 'expense' : 'expenses'} found
          {selectedFilter !== 'All' ? ` in ${selectedFilter}` : ''}
          {search ? ` matching "${search}"` : ''}
        </Text>
      </View>

      {/* Expense List */}
      <FlatList
        data={filteredExpenses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderExpenseItem}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={refreshExpenses}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {expenses.length === 0 ? "No expenses yet" : "No expenses found"}
            </Text>
            <Text style={styles.emptySubText}>
              {expenses.length === 0 
                ? "Add your first expense to get started" 
                : "Try adjusting your search or filters"
              }
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

/// Page Styling
/// Uses Flexbox for layout
/// Consistent padding and margin for spacing
/// Rounded corners for inputs and buttons
/// Primary color for buttons and links
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F9F9F9", 
  },
  searchInput: {
    backgroundColor: "#fff",
    padding: 15,
    margin: 15,
    borderRadius: 10,
    fontSize: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  filterContainer: {
    marginBottom: 15,
  },
  filterRow: {
    paddingHorizontal: 15,
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#fff",
    marginRight: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  filterChipActive: {
    backgroundColor: "#007AFF",
  },
  filterText: { 
    color: "#666", 
    fontSize: 14,
    fontWeight: "500",
  },
  filterTextActive: { 
    color: "white",
  },
  resultsSummary: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  resultsText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  listContent: {
    padding: 15,
    paddingTop: 0,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  icon: { 
    fontSize: 24, 
    marginRight: 12,
    width: 30,
  },
  expenseDetails: {
    flex: 1,
  },
  description: { 
    fontSize: 16, 
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  metaInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  category: {
    fontSize: 12,
    color: "#007AFF",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
    overflow: "hidden",
  },
  date: { 
    fontSize: 12, 
    color: "#888",
  },
  amountSection: {
    alignItems: "flex-end",
  },
  amount: { 
    fontSize: 16, 
    fontWeight: "bold",
    marginBottom: 8,
  },
  deleteButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: "#FFF5F5",
  },
  deleteIcon: {
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#FF6B6B",
    marginBottom: 8,
    textAlign: "center",
  },
  errorSubText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    padding: 40,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
  },
});