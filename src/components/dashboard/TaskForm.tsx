// src/components/dashboard/TaskForm.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

interface Category {
  id: number;
  name: string;
}

interface TaskFormProps {
  onClose: () => void;
  onTaskAdded: () => void;
}

export default function TaskForm({ onClose, onTaskAdded }: TaskFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    category_id: "",
    due_date: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/categories`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Task title is required");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/tasks`,
        {
          ...formData,
          category_id: formData.category_id
            ? parseInt(formData.category_id)
            : null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Task created successfully");
      onTaskAdded();
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Create New Task</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Task title"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Task description"
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="">No Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
