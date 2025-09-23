// screens/ExpensesScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";

const filters = ["All", "Today", "This Week", "Food", "Transport", "Rent"];

const expensesData = [
  { id: "1", category: "Food", description: "Burger", date: "Sep 21", amount: -12 },
  { id: "2", category: "Transport", description: "Taxi", date: "Sep 20", amount: -6 },
  { id: "3", category: "Rent", description: "September Rent", date: "Sep 1", amount: -500 },
  { id: "4", category: "Food", description: "Groceries", date: "Sep 18", amount: -85 },
  { id: "5", category: "Transport", description: "Bus Ticket", date: "Sep 17", amount: -3 },
];

export default function ExpensesScreen() {
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  // Filter by search + category
  const filteredExpenses = expensesData.filter((expense) => {
    const matchesSearch = expense.description
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter =
      selectedFilter === "All" || expense.category === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search expenses..."
        value={search}
        onChangeText={setSearch}
      />

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterChip,
              selectedFilter === f && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter(f)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === f && { color: "white" },
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Expense List */}
      <FlatList
        data={filteredExpenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.icon}>
              {item.category === "Food" ? "🍔" : item.category === "Transport" ? "🚗" : "🏠"}
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <Text
              style={[
                styles.amount,
                item.amount < 0 ? { color: "red" } : { color: "green" },
              ]}
            >
              ${item.amount}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9", padding: 15 },
  searchInput: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
  },
  filterRow: {
    flexDirection: "row",
    marginBottom: 15,
    flexWrap: "wrap",
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#eee",
    marginRight: 8,
    marginBottom: 8,
  },
  filterChipActive: {
    backgroundColor: "#007AFF",
  },
  filterText: { color: "#333", fontSize: 14 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
  },
  icon: { fontSize: 22, marginRight: 10 },
  description: { fontSize: 16, fontWeight: "500" },
  date: { fontSize: 12, color: "gray" },
  amount: { fontSize: 16, fontWeight: "bold" },
});
