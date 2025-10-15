// screens/DashboardScreen.js
import React, { useState, useEffect, useCallback} from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { useFinance } from "../hooks/useFinance";
import { useAuth } from '../contexts/AuthContext'

const screenWidth = Dimensions.get("window").width;

export default function DashboardScreen({ navigation }) {
  const {
    expenses,
    revenues,
    totalRevenue: totalRevenueFinance,
    totalExpenses: totalExpensesFinance,
    netBalance,
    loading,
    error,
    addExpense,
    removeExpense,
    addRevenue,
    removeRevenue,
    refreshData: refreshAllData
  } = useFinance();
  const refreshExpenses = refreshAllData;
  const refreshFinance = refreshAllData;
  const [chartData, setChartData] = useState([]);

    useFocusEffect(
    useCallback(() => {
      refreshExpenses();
      refreshFinance();
      return () => {};
    }, [refreshExpenses, refreshFinance])
  );
  const { user } = useAuth()
  // Process expenses for pie chart
  useEffect(() => {
    if (expenses.length > 0) {
      const categoryTotals = expenses.reduce((acc, expense) => {
        const category = expense.categories?.name || 'Uncategorized';
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += parseFloat(expense.amount);
        return acc;
      }, {});

      const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'];
      
      const processedData = Object.entries(categoryTotals).map(([name, amount], index) => ({
        name,
        amount,
        color: colors[index % colors.length],
        legendFontColor: '#7F7F7F',
        legendFontSize: 12
      }));

      setChartData(processedData);
    } else {
      setChartData([]);
    }
  }, [expenses]);

    // Use totals from useFinance if available, otherwise compute from expenses
  const computedTotalExpenses = typeof totalExpensesFinance === "number"
    ? totalExpensesFinance
    : expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  // total expenses = sum of positive amounts
  const totalExpenses = Number(computedTotalExpenses || 0);
  const totalRevenue = Number(totalRevenueFinance || 0);  
  const computedNetBalance = totalRevenue - totalExpenses;


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

  const handleManageCategories = () => {
    navigation.navigate("ManageCategoriesScreen");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionLeft}>
        <View style={[
          styles.categoryColor, 
          { backgroundColor: item.categories?.color || '#808080' }
        ]} />
        <Text style={styles.transactionCategory}>
          {item.categories?.name || 'Uncategorized'}
        </Text>
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionDesc}>{item.description}</Text>
          <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
        </View>
      </View>
      
      <View style={styles.transactionRight}>
        <Text style={[styles.transactionAmount, { color: "#FF6B6B" }]}>
          -${parseFloat(item.amount).toFixed(2)}
        </Text>
        <TouchableOpacity
          onPress={() => handleDeleteExpense(item.id, item.description)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
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
        <Text style={styles.errorText}>Error: {error}</Text>
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
      <FlatList
        ListHeaderComponent={
          <>
            {/* Top Bar */}
            <View style={styles.topBar}>
              <Text style={styles.greeting}>Hello {user?.email?.split('@')[0] || 'User'} 👋</Text>
              <Image source={require("../assets/icon.webp")} style={styles.profileIcon} />
            </View>

            {/* Summary Cards */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardRow}>
              <View style={[styles.card, computedNetBalance >= 0 ? styles.positiveCard : styles.negativeCard]}>
               <Text style={styles.cardTitle}>Net Balance</Text>
               <Text style={[
                 styles.cardValue,
                 { color: computedNetBalance >= 0 ? '#34C759' : '#FF3B30' }
                 ]}>
                 ${computedNetBalance.toFixed(2)}
               </Text>
             </View>
             <View style={styles.card}>
              <Text style={styles.cardTitle}>Total Revenue</Text>
              <Text style={[styles.cardValue, { color: '#34C759' }]}>
                ${totalRevenue.toFixed(2)}
              </Text>
             </View>
             <View style={styles.card}>
              <Text style={styles.cardTitle}>Total Expenses</Text>
              <Text style={[styles.cardValue, { color: '#FF3B30' }]}>
                ${totalExpenses.toFixed(2)}
              </Text>
             </View>
            <View style={styles.card}>
             <Text style={styles.cardTitle}>Savings Rate</Text>
             <Text style={styles.cardValue}>
            {totalRevenue > 0 ? ((computedNetBalance / totalRevenue) * 100).toFixed(1) : 0}%
            </Text>
            </View>
           </ScrollView>
            {/* Pie Chart Section */}
            <View style={styles.chartSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Spending by Category</Text>
                <TouchableOpacity 
                  style={styles.manageCategoriesButton}
                  onPress={handleManageCategories}
                >
                  <Text style={styles.manageCategoriesButtonText}>📁 Manage Categories</Text>
                </TouchableOpacity>
              </View>
              
              {chartData.length > 0 ? (
                <PieChart
                  data={chartData}
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
              ) : (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>No expenses to display</Text>
                  <Text style={styles.noDataSubText}>Add some expenses to see your spending breakdown</Text>
                  <TouchableOpacity 
                    style={styles.addFirstExpenseButton}
                    onPress={() => navigation.navigate("AddExpenseScreen")}
                  >
                    <Text style={styles.addFirstExpenseButtonText}>Add Your First Expense</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Recent Transactions Header */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>
              <Text style={styles.transactionCount}>{expenses.length} total</Text>
            </View>
          </>
        }
        data={expenses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTransactionItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No transactions yet</Text>
            <Text style={styles.emptySubText}>Add your first expense to get started</Text>
            <TouchableOpacity 
              style={styles.addFirstExpenseButton}
              onPress={() => navigation.navigate("AddExpenseScreen")}
            >
              <Text style={styles.addFirstExpenseButtonText}>Add Your First Expense</Text>
            </TouchableOpacity>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={refreshExpenses}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F9F9F9" 
  },
  listContent: {
    padding: 15,
    paddingBottom: 30,
  },
  topBar: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: 20 
  },
  greeting: { 
    fontSize: 20, 
    fontWeight: "bold" 
  },
  profileIcon: { 
    width: 40, 
    height: 40, 
    borderRadius: 20 
  },
  cardRow: { 
    flexDirection: "row", 
    marginBottom: 20 
  },
  card: { 
    backgroundColor: "#fff", 
    padding: 15, 
    borderRadius: 10, 
    marginRight: 10, 
    width: 150, 
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardTitle: { 
    fontSize: 14, 
    color: "gray" 
  },
  cardValue: { 
    fontSize: 18, 
    fontWeight: "bold",
    marginTop: 5,
  },
  cardSubValue: {
    fontSize: 12,
    color: "gray",
    marginTop: 2,
  },
  chartSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginVertical: 10 
  },
  transactionCount: {
    fontSize: 14,
    color: "gray",
  },
  manageCategoriesButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 2,
  },
  manageCategoriesButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  transactionCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  transactionCategory: { 
    fontWeight: "bold", 
    marginRight: 10,
    fontSize: 14,
    color: "#333",
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDesc: { 
    fontSize: 14,
    color: "#333",
  },
  transactionDate: { 
    fontSize: 12, 
    color: "gray",
    marginTop: 2,
  },
  transactionAmount: { 
    fontWeight: "bold", 
    fontSize: 16,
    marginBottom: 5,
  },
  deleteButton: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
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
    color: "gray",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyContainer: {
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "gray",
    marginBottom: 5,
  },
  emptySubText: {
    fontSize: 14,
    color: "lightgray",
    textAlign: "center",
    marginBottom: 20,
  },
  noDataContainer: {
    alignItems: "center",
    padding: 40,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  noDataText: {
    fontSize: 16,
    color: "gray",
    marginBottom: 5,
  },
  noDataSubText: {
    fontSize: 14,
    color: "lightgray",
    textAlign: "center",
    marginBottom: 20,
  },
  addFirstExpenseButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addFirstExpenseButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});