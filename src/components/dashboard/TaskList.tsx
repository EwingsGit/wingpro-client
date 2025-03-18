// src/components/dashboard/TaskList.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import EditTaskForm from "./EditTaskForm";

interface Category {
  id: number;
  name: string;
}

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: string;
  priority: string | null;
  due_date: string | null;
  category_id: number | null;
  category?: Category;
  created_at: string;
  updated_at: string;
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/tasks`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
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
    }
  };

  const getCategoryName = (categoryId: number | null): string => {
    if (!categoryId) return "";
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "";
  };

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/tasks/${taskId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update task status locally
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );

      toast.success("Task updated");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/tasks/${taskId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Remove task locally
      setTasks(tasks.filter((task) => task.id !== taskId));

      toast.success("Task deleted");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((task) => task.status === filter);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex space-x-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded-md ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("todo")}
          className={`px-3 py-1 rounded-md ${
            filter === "todo"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          To Do
        </button>
        <button
          onClick={() => setFilter("inprogress")}
          className={`px-3 py-1 rounded-md ${
            filter === "inprogress"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-3 py-1 rounded-md ${
            filter === "completed"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Completed
        </button>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No tasks found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div key={task.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{task.title}</h3>
                  {task.description && (
                    <p className="text-gray-600 mt-1">{task.description}</p>
                  )}
                  <div className="mt-2 flex items-center flex-wrap gap-2">
                    {task.due_date && (
                      <span className="text-gray-500 text-sm">
                        Due: {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    )}
                    {task.category_id && (
                      <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                        {getCategoryName(task.category_id)}
                      </span>
                    )}
                    {task.priority && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          task.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : task.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {task.priority}
                      </span>
                    )}
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        task.status === "todo"
                          ? "bg-gray-100 text-gray-800"
                          : task.status === "inprogress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {task.status === "todo"
                        ? "To Do"
                        : task.status === "inprogress"
                        ? "In Progress"
                        : "Completed"}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingTask(task)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <select
                    value={task.status}
                    onChange={(e) =>
                      handleStatusChange(task.id, e.target.value)
                    }
                    className="text-sm border rounded px-2 py-1"
                  >
                    <option value="todo">To Do</option>
                    <option value="inprogress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <EditTaskForm
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onTaskUpdated={() => {
            setEditingTask(null);
            fetchTasks();
          }}
        />
      )}
    </div>
  );
}
