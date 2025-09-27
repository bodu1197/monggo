'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  subcategories?: Category[]; // For hierarchical display
}

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedParentCategory, setSelectedParentCategory] = useState<number | null>(null);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, slug, parent_id');

        if (error) {
          throw new Error(error.message);
        }

        // Organize categories into a hierarchical structure
        const parentCategories: Category[] = [];
        const allCategories: Category[] = data || [];

        allCategories.forEach(cat => {
          if (cat.parent_id === null) {
            parentCategories.push({ ...cat, subcategories: [] });
          }
        });

        allCategories.forEach(cat => {
          if (cat.parent_id !== null) {
            const parent = parentCategories.find(p => p.id === cat.parent_id);
            if (parent) {
              parent.subcategories?.push(cat);
            }
          }
        });

        setCategories(parentCategories);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Update subcategories when parent category changes
  useEffect(() => {
    if (selectedParentCategory) {
      const parent = categories.find(cat => cat.id === selectedParentCategory);
      setSubcategories(parent?.subcategories || []);
      setSelectedSubCategory(null); // Reset subcategory selection
    } else {
      setSubcategories([]);
      setSelectedSubCategory(null);
    }
  }, [selectedParentCategory, categories]);

  const handleParentCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedParentCategory(Number(e.target.value) || null);
  };

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubCategory(Number(e.target.value) || null);
  };

  if (loading) {
    return <div className="w-full bg-white shadow-md rounded-lg p-4 mb-6 text-center min-h-[96px]">Loading categories...</div>;
  }

  if (error) {
    return <div className="w-full bg-white shadow-md rounded-lg p-4 mb-6 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <>
      {/* Parent Category Dropdown */}
      <div className="flex-1 min-w-[150px]">

        <select
          id="category"
          className="w-full py-2 px-3 text-gray-800 leading-tight focus:ring-2 focus:ring-indigo-500 focus:border-transparent md:shadow-inner md:border md:border-gray-300 md:rounded"
          onChange={handleParentCategoryChange}
          value={selectedParentCategory || ''}
        >
          <option value="">Pilih Kategori Utama</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Subcategory Dropdown */}
      <div className="flex-1 min-w-[150px]">

        <select
          id="subcategory"
          className="w-full py-2 px-3 text-gray-800 leading-tight focus:ring-2 focus:ring-indigo-500 focus:border-transparent md:shadow-inner md:border md:border-gray-300 md:rounded"
          onChange={handleSubCategoryChange}
          value={selectedSubCategory || ''}
          disabled={!selectedParentCategory || subcategories.length === 0}
        >
          <option value="">Pilih Subkategori</option>
          {subcategories.map((subcategory) => (
            <option key={subcategory.id} value={subcategory.id}>
              {subcategory.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}