
import { supabase } from '../lib/supabase';

export const ExpenseService = {
    // Add a new expense
  async addExpense(expenseData) {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([{
          amount: expenseData.amount,
          description: expenseData.description,
          category_id: expenseData.category_id, // Now using category_id
          date: expenseData.date,
          user_id: expenseData.user_id,
        }])
        .select(`
          *,
          categories (id, name, color)
        `)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error adding expense:', error);
      return { success: false, error: error.message };
    }
  },
 /// Get all expenses for current user with optional filters
  async getExpenses(filters = {}) {
    try {
      let query = supabase
        .from('expenses')
        .select(`
          *,
          categories (id, name, color)
        `)
        .order('date', { ascending: false });

      if (filters.category_id) {
        query = query.eq('category_id', filters.category_id);
      }
      if (filters.startDate && filters.endDate) {
        query = query.gte('date', filters.startDate).lte('date', filters.endDate);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching expenses:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete an expense
  async deleteExpense(expenseId) {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting expense:', error);
      return { success: false, error: error.message };
    }
  },

  // Update an expense
  async updateExpense(expenseId, updates) {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .update(updates)
        .eq('id', expenseId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating expense:', error);
      return { success: false, error: error.message };
    }
  }
};