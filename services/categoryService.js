
import { supabase } from '../lib/supabase';

export const CategoryService = {
  // Get all categories for current user
  async getCategories() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { success: false, error: error.message };
    }
  },

  // Create new category
  async createCategory(categoryData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('categories')
        .insert([{ ...categoryData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating category:', error);
      return { success: false, error: error.message };
    }
  },

  // Update category
  async updateCategory(categoryId, updates) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', categoryId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating category:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete category (only if no expenses are using it)
  async deleteCategory(categoryId) {
    try {
      // Check if category is being used
      const { data: expenses } = await supabase
        .from('expenses')
        .select('id')
        .eq('category_id', categoryId)
        .limit(1);

      if (expenses && expenses.length > 0) {
        throw new Error('Cannot delete category that is being used by expenses');
      }

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting category:', error);
      return { success: false, error: error.message };
    }
  }
};