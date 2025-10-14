// hooks/useExpenses.js
import { useState, useEffect, useCallback } from 'react';
import { ExpenseService } from '../services/ExpenseService';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load expenses on component mount
  //useEffect(() => {
  //  loadExpenses();
  //}, []);
const loadExpenses = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const { data, error } = await ExpenseService.getExpenses(filters);
      if (error) {
        setError(error.message || JSON.stringify(error));
      } else {
        setExpenses(data || []);
        setError(null);
      }
    } catch (err) {
      setError(err.message || JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  }, []);

 const refreshExpenses = useCallback(() => {
    loadExpenses();
  }, [loadExpenses]);

  const addExpense = useCallback(async (expenseData) => {
    setLoading(true);
    setError(null);
    
    const result = await ExpenseService.addExpense({
      ...expenseData,
      created_at: new Date().toISOString(),
    });
    
    if (result.success) {
      setExpenses(prev => [result.data, ...prev]);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  }, [loadExpenses]);

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
  }, [loadExpenses]);

  const updateExpense = useCallback(async (expenseId, updates) => {
    setLoading(true);
    setError(null);
    
    const result = await ExpenseService.updateExpense(expenseId, updates);
    
    if (result.success) {
      setExpenses(prev => 
        prev.map(expense => 
          expense.id === expenseId ? result.data : expense
        )
      );
    } else {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  }, [loadExpenses]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  return {
    expenses,
    loading,
    error,
    addExpense,
    removeExpense,
    updateExpense,
    refreshExpenses: loadExpenses,
  };
};