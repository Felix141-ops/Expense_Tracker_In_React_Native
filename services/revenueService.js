
import { supabase } from '../lib/supabase';

export const RevenueService = {
  // Add a new revenue
  async addRevenue(revenueData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('revenues')
        .insert([{
          ...revenueData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error adding revenue:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all revenues
  async getRevenues(filters = {}) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      let query = supabase
        .from('revenues')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (filters.startDate && filters.endDate) {
        query = query.gte('date', filters.startDate).lte('date', filters.endDate);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching revenues:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete a revenue
  async deleteRevenue(revenueId) {
    try {
      const { error } = await supabase
        .from('revenues')
        .delete()
        .eq('id', revenueId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting revenue:', error);
      return { success: false, error: error.message };
    }
  },

  // Update a revenue
  async updateRevenue(revenueId, updates) {
    try {
      const { data, error } = await supabase
        .from('revenues')
        .update(updates)
        .eq('id', revenueId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating revenue:', error);
      return { success: false, error: error.message };
    }
  },

  // Get total revenue amount
  async getTotalRevenue() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('revenues')
        .select('amount')
        .eq('user_id', user.id);

      if (error) throw error;
      
      const total = data.reduce((sum, revenue) => sum + parseFloat(revenue.amount), 0);
      return { success: true, data: total };
    } catch (error) {
      console.error('Error calculating total revenue:', error);
      return { success: false, error: error.message };
    }
  }
};