// hooks/useFinance.js
import { useState, useEffect, useCallback } from 'react';
import { ExpenseService } from '../services/ExpenseService';
import { RevenueService } from '../services/revenueService';

export const useFinance = () => {
  const [expenses, setExpenses] = useState([]);
  const [revenues, setRevenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  
  const loadAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [expensesResult, revenuesResult] = await Promise.all([
        ExpenseService.getExpenses(),
        RevenueService.getRevenues()
      ]);

      if (expensesResult.success) {
        setExpenses(expensesResult.data);
      } else {
        throw new Error(expensesResult.error);
      }

      if (revenuesResult.success) {
        setRevenues(revenuesResult.data);
      } else {
        throw new Error(revenuesResult.error);
      }
    } catch (err) {
      setError(err.message);
    }
    
    setLoading(false);
  }, []);

// Load both expenses and revenues
  useEffect(() => {
    loadAllData();
  }, []);


  // Expense operations
  const addExpense = useCallback(async (expenseData) => {
    setLoading(true);
    setError(null);
    
    const result = await ExpenseService.addExpense(expenseData);
    
    if (result.success) {
      setExpenses(prev => [result.data, ...prev]);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  }, []);

  const removeExpense = useCallback(async (expenseId) => {
    setLoading(true);
    setError(null);
    
    const result = await ExpenseService.deleteExpense(expenseId);
    
    if (result.success) {
      setExpenses(prev => prev.filter(expense => expense.id !== expenseId));
    } else {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  }, []);

  // Revenue operations
  const addRevenue = useCallback(async (revenueData) => {
    setLoading(true);
    setError(null);
    
    const result = await RevenueService.addRevenue({
      ...revenueData,
      date: revenueData.date || new Date().toISOString().split('T')[0]
    });
    
    if (result.success) {
      setRevenues(prev => [result.data, ...prev]);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  }, []);

  const removeRevenue = useCallback(async (revenueId) => {
    setLoading(true);
    setError(null);
    
    const result = await RevenueService.deleteRevenue(revenueId);
    
    if (result.success) {
      setRevenues(prev => prev.filter(revenue => revenue.id !== revenueId));
    } else {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  }, []);

  // Calculations
  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  const totalRevenue = revenues.reduce((sum, revenue) => sum + parseFloat(revenue.amount), 0);
  const netBalance = totalRevenue - totalExpenses;

  return {
    // Data
    expenses,
    revenues,
    
    // Calculations
    totalExpenses,
    totalRevenue,
    netBalance,
    
    // States
    loading,
    error,
    
    // Expense operations
    addExpense,
    removeExpense,
    
    // Revenue operations
    addRevenue,
    removeRevenue,
    
    // Refresh
    refreshData: loadAllData,
  };
};