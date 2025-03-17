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
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/categories`,
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
      setIsAdding(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/categories`,
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
      setIsAdding(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Categories</h2>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="New category name"
              className="flex-1 px-3 py-2 border rounded-l-md"
            />
            <button
              onClick={addCategory}
              disabled={isAdding || !newCategoryName.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 disabled:opacity-50"
            >
              Add
            </button>
          </div>

          {categories.length === 0 ? (
            <p className="text-gray-500 text-center">No categories yet</p>
          ) : (
            <ul className="space-y-2">
              {categories.map((category) => (
                <li
                  key={category.id}
                  className="flex justify-between items-center"
                >
                  <span>{category.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
