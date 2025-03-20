// src/components/dashboard/DashboardHome.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  CalendarClock,
  Calendar,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  CirclePlus,
} from "lucide-react";
import DashboardStats from "./DashboardStats";
import EditTaskForm from "./EditTaskForm";

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: string;
  priority: string | null;
  due_date: string | null;
  category_id: number | null;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: number;
  name: string;
}

export default function DashboardHome() {
  const [overdueTasks, setOverdueTasks] = useState<Task[]>([]);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          fetchOverdueTasks(),
          fetchTodayTasks(),
          fetchUpcomingTasks(),
          fetchCategories(),
        ]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

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
      throw error;
    }
  };

  const fetchOverdueTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      // Get today's date in YYYY-MM-DD format
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/tasks`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Filter tasks that are overdue (due before today and not completed)
      const filtered = response.data.filter((task: Task) => {
        if (!task.due_date) return false;
        const taskDate = new Date(task.due_date);
        return taskDate < today && task.status !== "completed";
      });

      // Sort by due date (oldest first)
      filtered.sort((a: Task, b: Task) => {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      });

      setOverdueTasks(filtered);
    } catch (error) {
      console.error("Error fetching overdue tasks:", error);
      throw error;
    }
  };

  const fetchTodayTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      // Get today's date in YYYY-MM-DD format
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/tasks`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Filter tasks due today
      const filtered = response.data.filter((task: Task) => {
        if (!task.due_date) return false;
        const taskDate = new Date(task.due_date);
        return taskDate >= today && taskDate < tomorrow;
      });

      setTodayTasks(filtered);
    } catch (error) {
      console.error("Error fetching today's tasks:", error);
      throw error;
    }
  };

  const fetchUpcomingTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      // Get today's date in YYYY-MM-DD format
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextTwoWeeks = new Date(today);
      nextTwoWeeks.setDate(nextTwoWeeks.getDate() + 14);

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/tasks`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Filter tasks due in the next two weeks (excluding today)
      const filtered = response.data.filter((task: Task) => {
        if (!task.due_date) return false;
        const taskDate = new Date(task.due_date);
        return taskDate >= tomorrow && taskDate <= nextTwoWeeks;
      });

      // Sort by due date
      filtered.sort((a: Task, b: Task) => {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      });

      // Take just the first 3 for the dashboard
      setUpcomingTasks(filtered.slice(0, 3));
    } catch (error) {
      console.error("Error fetching upcoming tasks:", error);
      throw error;
    }
  };

  const getCategoryName = (categoryId: number | null): string => {
    if (!categoryId) return "";
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "";
  };

  const handleStatusChange = async (
    taskId: number,
    newStatus: string,
    taskType: "overdue" | "today" | "upcoming"
  ) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/tasks/${taskId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update tasks based on their type
      if (taskType === "overdue") {
        if (newStatus === "completed") {
          setOverdueTasks((prev) => prev.filter((task) => task.id !== taskId));
        } else {
          setOverdueTasks((prev) =>
            prev.map((task) =>
              task.id === taskId ? { ...task, status: newStatus } : task
            )
          );
        }
      } else if (taskType === "today") {
        setTodayTasks((prev) =>
          prev.map((task) =>
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        );
      } else if (taskType === "upcoming") {
        setUpcomingTasks((prev) =>
          prev.map((task) =>
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        );
      }

      toast.success("Task updated");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "inprogress":
        return <Clock3 className="h-4 w-4 text-blue-500" />;
      default:
        return <CirclePlus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "completed":
        return "badge-completed";
      case "inprogress":
        return "badge-inprogress";
      default:
        return "badge-todo";
    }
  };

  const getPriorityClass = (priority: string | null) => {
    if (!priority) return "";
    switch (priority) {
      case "high":
        return "badge-high";
      case "medium":
        return "badge-medium";
      case "low":
        return "badge-low";
      default:
        return "";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const renderTaskItem = (
    task: Task,
    taskType: "overdue" | "today" | "upcoming"
  ) => (
    <div
      key={task.id}
      className={`task-card priority-${task.priority || "medium"}`}
      onClick={() => setEditingTask(task)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-base">{task.title}</h3>
          {task.description && (
            <p className="text-gray-600 mt-1 text-sm truncate">
              {task.description}
            </p>
          )}
          <div className="mt-2 flex items-center flex-wrap gap-2">
            {task.due_date && (
              <span
                className={`text-sm ${
                  taskType === "overdue"
                    ? "text-red-500 font-medium"
                    : "text-gray-500"
                } flex items-center`}
              >
                {taskType === "overdue" && (
                  <AlertTriangle size={14} className="mr-1" />
                )}
                {taskType === "today" && (
                  <Calendar size={14} className="mr-1" />
                )}
                {taskType === "upcoming" && (
                  <CalendarClock size={14} className="mr-1" />
                )}
                {formatDate(task.due_date)}
              </span>
            )}
            {task.category_id && (
              <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                {getCategoryName(task.category_id)}
              </span>
            )}
            {task.priority && (
              <span className={`badge ${getPriorityClass(task.priority)}`}>
                {task.priority}
              </span>
            )}
            <span className={`badge ${getStatusClass(task.status)}`}>
              <span className="flex items-center">
                {getTaskStatusIcon(task.status)}
                <span className="ml-1">
                  {task.status === "todo"
                    ? "To Do"
                    : task.status === "inprogress"
                    ? "In Progress"
                    : "Completed"}
                </span>
              </span>
            </span>
          </div>
        </div>
        <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
          <select
            value={task.status}
            onChange={(e) =>
              handleStatusChange(task.id, e.target.value, taskType)
            }
            className="form-control text-sm py-1"
            onClick={(e) => e.stopPropagation()}
          >
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderTaskSection = (
    title: string,
    tasks: Task[],
    taskType: "overdue" | "today" | "upcoming",
    linkPath: string,
    color?: string
  ) => (
    <div className="card p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-xl font-bold ${color ? color : ""}`}>
          {title}
          {taskType === "overdue" && tasks.length > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-800 rounded-full text-sm">
              {tasks.length}
            </span>
          )}
        </h2>
        <Link
          to={linkPath}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          View All <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-6 bg-gray-50 rounded">
          <p className="text-gray-500">No {title.toLowerCase()}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => renderTaskItem(task, taskType))}
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      {/* Main Stats Overview */}
      <div className="mb-8">
        <DashboardStats />
      </div>

      {/* Task Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          {renderTaskSection(
            "Overdue Tasks",
            overdueTasks,
            "overdue",
            "/dashboard/overdue",
            "text-red-600"
          )}
          {renderTaskSection(
            "Today's Tasks",
            todayTasks,
            "today",
            "/dashboard/today"
          )}
        </div>
        <div>
          {renderTaskSection(
            "Upcoming Tasks",
            upcomingTasks,
            "upcoming",
            "/dashboard/upcoming"
          )}
        </div>
      </div>

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50">
          <div className="modal-content w-full max-w-md mx-4 fade-in">
            <EditTaskForm
              task={editingTask}
              onClose={() => setEditingTask(null)}
              onTaskUpdated={async () => {
                setEditingTask(null);
                // Refresh all data when a task is updated
                await Promise.all([
                  fetchOverdueTasks(),
                  fetchTodayTasks(),
                  fetchUpcomingTasks(),
                ]);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
