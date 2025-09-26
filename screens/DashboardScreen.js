// screens/DashboardScreen.js
import React from "react";
import { View, Text, StyleSheet, FlatList, ScrollView, Image } from "react-native";
import { Card } from "react-native-paper";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
// Sample data
const data = [
  { name: "Food", amount: 450, color: "#FF6384", legendFontColor: "#7F7F7F", legendFontSize: 12 },
  { name: "Transport", amount: 200, color: "#36A2EB", legendFontColor: "#7F7F7F", legendFontSize: 12 },
  { name: "Rent", amount: 800, color: "#FFCE56", legendFontColor: "#7F7F7F", legendFontSize: 12 },
];
// Sample recent transactions
const recentTransactions = [
  { id: "1", category: "Food", description: "Lunch at Cafe", date: "Sep 20", amount: -15 },
  { id: "2", category: "Transport", description: "Uber Ride", date: "Sep 19", amount: -8 },
  { id: "3", category: "Rent", description: "September Rent", date: "Sep 1", amount: -500 },
  { id: "4", category: "Food", description: "Groceries", date: "Sep 18", amount: -120 },
  { id: "5", category: "Transport", description: "Bus Ticket", date: "Sep 17", amount: -3 },
];

/// Dashboard screen component
/// Displays summary cards, pie chart, and recent transactions
export default function DashboardScreen() {
  return (
    <FlatList
      ListHeaderComponent={
        <>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <Text style={styles.greeting}>Hello Felix 👋</Text>
            <Image source={require("../assets/icon.webp")} style={styles.profileIcon} />
          </View>
          {/* Summary Cards */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardRow}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Total Spent</Text>
              <Text style={styles.cardValue}>$1,200</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Biggest Category</Text>
              <Text style={styles.cardValue}>Rent</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Remaining Budget</Text>
              <Text style={styles.cardValue}>$300</Text>
            </View>
          </ScrollView>
          {/* Pie Chart */}
          <Text style={styles.sectionTitle}>Spending by Category</Text>
          <PieChart
            data={data}
            width={screenWidth - 30}
            height={200}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor={"amount"}
            backgroundColor={"transparent"}
            paddingLeft={"10"}
          />
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </>
      }
      data={recentTransactions}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.transactionCard}>
          <Text style={styles.transactionCategory}>{item.category}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.transactionDesc}>{item.description}</Text>
            <Text style={styles.transactionDate}>{item.date}</Text>
          </View>
          <Text style={[styles.transactionAmount, item.amount < 0 && { color: "red" }]}>
            ${item.amount}
          </Text>
        </View>
      )}
      contentContainerStyle={styles.container}
    />
  );
}

/// Page Styling
/// Uses Flexbox for layout
/// Consistent padding and margin for spacing
/// Rounded corners for inputs and buttons
/// Primary color for buttons and links
const styles = StyleSheet.create({
  container: { backgroundColor: "#F9F9F9", padding: 15 },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  greeting: { fontSize: 20, fontWeight: "bold" },
  profileIcon: { width: 40, height: 40, borderRadius: 20 },
  cardRow: { flexDirection: "row", marginBottom: 20 },
  card: { backgroundColor: "#fff", padding: 15, borderRadius: 10, marginRight: 10, width: 150, elevation: 2 },
  cardTitle: { fontSize: 14, color: "gray" },
  cardValue: { fontSize: 18, fontWeight: "bold" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  transactionCard: { flexDirection: "row", backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 10, alignItems: "center", elevation: 1 },
  transactionCategory: { fontWeight: "bold", marginRight: 10 },
  transactionDesc: { fontSize: 14 },
  transactionDate: { fontSize: 12, color: "gray" },
  transactionAmount: { fontWeight: "bold", fontSize: 16 },
});
