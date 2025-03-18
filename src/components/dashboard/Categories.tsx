// src/components/dashboard/Categories.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

interface Category {
  id: number;
  name: string;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/categories`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  const addCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/categories`,
        { name: newCategoryName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCategories([...categories, response.data]);
      setNewCategoryName("");
      toast.success("Category added");
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim()) return;

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/categories/${editingCategory.id}`,
        { name: editingCategory.name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCategories(
        categories.map((cat) =>
          cat.id === editingCategory.id ? response.data : cat
        )
      );
      setEditingCategory(null);
      toast.success("Category updated");
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteCategory = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/categories/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCategories(categories.filter((cat) => cat.id !== id));
      toast.success("Category deleted");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-6">Manage Categories</h2>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Add New Category */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-medium mb-3">Add New Category</h3>
            <div className="flex items-center">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Category name"
                className="flex-1 px-3 py-2 border rounded-l-md"
                disabled={isSubmitting}
              />
              <button
                onClick={addCategory}
                disabled={isSubmitting || !newCategoryName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>

          {/* Category List */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-medium mb-3">Your Categories</h3>
            {categories.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No categories yet
              </p>
            ) : (
              <ul className="divide-y">
                {categories.map((category) => (
                  <li key={category.id} className="py-3">
                    {editingCategory?.id === category.id ? (
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={editingCategory.name}
                          onChange={(e) =>
                            setEditingCategory({
                              ...editingCategory,
                              name: e.target.value,
                            })
                          }
                          className="flex-1 px-3 py-2 border rounded-l-md"
                          disabled={isSubmitting}
                        />
                        <button
                          onClick={updateCategory}
                          disabled={
                            isSubmitting || !editingCategory.name.trim()
                          }
                          className="px-3 py-2 bg-green-600 text-white rounded-tr-md hover:bg-green-700 disabled:opacity-50"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingCategory(null)}
                          disabled={isSubmitting}
                          className="px-3 py-2 bg-gray-300 text-gray-700 rounded-br-md hover:bg-gray-400 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <span>{category.name}</span>
                        <div className="space-x-2">
                          <button
                            onClick={() => setEditingCategory(category)}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                            disabled={isSubmitting}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteCategory(category.id)}
                            className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                            disabled={isSubmitting}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
