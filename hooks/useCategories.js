
import { useState, useEffect } from 'react';
import { CategoryService } from '../services/categoryService';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    
    const result = await CategoryService.getCategories();
    
    if (result.success) {
      setCategories(result.data);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const createCategory = async (categoryData) => {
    setLoading(true);
    setError(null);
    
    const result = await CategoryService.createCategory(categoryData);
    
    if (result.success) {
      setCategories(prev => [...prev, result.data]);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  };

  const deleteCategory = async (categoryId) => {
    setLoading(true);
    setError(null);
    
    const result = await CategoryService.deleteCategory(categoryId);
    
    if (result.success) {
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    } else {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  };

  return {
    categories,
    loading,
    error,
    createCategory,
    deleteCategory,
    refreshCategories: loadCategories,
  };
};