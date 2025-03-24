// src/components/dashboard/DashboardHome.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  CalendarCheck,
  Calendar,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Clock,
  PlusCircle,
} from "lucide-react";
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

interface TasksSummary {
  total: number;
  completed: number;
  dueToday: number;
  overdue: number;
  upcoming: number;
}

export default function DashboardHome({
  onAddTaskClick,
}: {
  onAddTaskClick: () => void;
}) {
  const [overdueTasks, setOverdueTasks] = useState<Task[]>([]);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [summary, setSummary] = useState<TasksSummary>({
    total: 0,
    completed: 0,
    dueToday: 0,
    overdue: 0,
    upcoming: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          fetchOverdueTasks(),
          fetchTodayTasks(),
          fetchUpcomingTasks(),
          fetchCategories(),
          fetchSummary(),
        ]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
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

  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/tasks`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const tasks: Task[] = response.data;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const twoWeeksLater = new Date(today);
      twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);

      // Calculate summary
      const total = tasks.length;
      const completed = tasks.filter(
        (task) => task.status === "completed"
      ).length;
      const dueToday = tasks.filter((task) => {
        if (!task.due_date) return false;
        const dueDate = new Date(task.due_date);
        return dueDate >= today && dueDate < tomorrow;
      }).length;

      const overdue = tasks.filter((task) => {
        if (!task.due_date) return false;
        const dueDate = new Date(task.due_date);
        return dueDate < today && task.status !== "completed";
      }).length;

      const upcoming = tasks.filter((task) => {
        if (!task.due_date) return false;
        const dueDate = new Date(task.due_date);
        return dueDate >= tomorrow && dueDate <= twoWeeksLater;
      }).length;

      setSummary({
        total,
        completed,
        dueToday,
        overdue,
        upcoming,
      });
    } catch (error) {
      console.error("Error fetching task summary:", error);
      throw error;
    }
  };

  const fetchOverdueTasks = async () => {
    try {
      const token = localStorage.getItem("token");
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

      // Sort by due date (oldest first) and limit to 3
      filtered.sort((a: Task, b: Task) => {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      });

      setOverdueTasks(filtered.slice(0, 3));
    } catch (error) {
      console.error("Error fetching overdue tasks:", error);
      throw error;
    }
  };

  const fetchTodayTasks = async () => {
    try {
      const token = localStorage.getItem("token");
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

      // Filter tasks due today and limit to 3
      const filtered = response.data.filter((task: Task) => {
        if (!task.due_date) return false;
        const taskDate = new Date(task.due_date);
        return taskDate >= today && taskDate < tomorrow;
      });

      setTodayTasks(filtered.slice(0, 3));
    } catch (error) {
      console.error("Error fetching today's tasks:", error);
      throw error;
    }
  };

  const fetchUpcomingTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const twoWeeksLater = new Date(today);
      twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);

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
        return taskDate >= tomorrow && taskDate <= twoWeeksLater;
      });

      // Sort by due date and limit to 3
      filtered.sort((a: Task, b: Task) => {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      });

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
          await fetchSummary(); // Update summary after completing a task
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
        if (newStatus === "completed") {
          await fetchSummary(); // Update summary
        }
      } else if (taskType === "upcoming") {
        setUpcomingTasks((prev) =>
          prev.map((task) =>
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        );
        if (newStatus === "completed") {
          await fetchSummary(); // Update summary
        }
      }

      toast.success("Task updated");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const renderTask = (
    task: Task,
    taskType: "overdue" | "today" | "upcoming"
  ) => (
    <div
      key={task.id}
      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 border-l-4 ${
        taskType === "overdue"
          ? "border-red-500"
          : taskType === "today"
          ? "border-blue-500"
          : "border-green-500"
      } cursor-pointer mb-3`}
      onClick={() => setEditingTask(task)}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">{task.title}</h3>
          {task.description && (
            <p className="text-gray-600 text-sm mt-1 truncate max-w-xs">
              {task.description}
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-2 items-center text-xs">
            <span
              className={`px-2 py-1 rounded-full ${
                task.status === "completed"
                  ? "bg-green-100 text-green-800"
                  : task.status === "inprogress"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              } flex items-center`}
            >
              {task.status === "completed" ? (
                <CheckCircle size={12} className="mr-1" />
              ) : task.status === "inprogress" ? (
                <Clock size={12} className="mr-1" />
              ) : (
                <PlusCircle size={12} className="mr-1" />
              )}
              {task.status === "todo"
                ? "To Do"
                : task.status === "inprogress"
                ? "In Progress"
                : "Completed"}
            </span>

            {task.priority && (
              <span
                className={`px-2 py-1 rounded-full ${
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

            {task.category_id && (
              <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                {getCategoryName(task.category_id)}
              </span>
            )}

            {task.due_date && (
              <span
                className={`flex items-center ${
                  taskType === "overdue"
                    ? "text-red-600 font-medium"
                    : "text-gray-500"
                }`}
              >
                {taskType === "overdue" ? (
                  <AlertTriangle size={12} className="mr-1" />
                ) : taskType === "today" ? (
                  <Calendar size={12} className="mr-1" />
                ) : (
                  <CalendarCheck size={12} className="mr-1" />
                )}
                {formatDate(task.due_date)}
              </span>
            )}
          </div>
        </div>
        <div className="ml-4">
          <select
            value={task.status}
            onChange={(e) =>
              handleStatusChange(task.id, e.target.value, taskType)
            }
            className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
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

  const renderSummaryCard = (
    title: string,
    value: number,
    icon: React.ReactNode,
    color: string,
    bgColor: string,
    lightBgColor: string
  ) => (
    <div className={`${bgColor} rounded-xl shadow-sm p-5 flex items-center`}>
      <div className={`${lightBgColor} p-3 rounded-lg mr-4`}>{icon}</div>
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <h3 className={`text-2xl font-bold ${color} mt-1`}>{value}</h3>
      </div>
    </div>
  );

  const renderTaskSection = (
    title: string,
    tasks: Task[],
    taskType: "overdue" | "today" | "upcoming",
    linkPath: string,
    color: string
  ) => (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-lg font-bold ${color}`}>{title}</h2>
        <Link
          to={linkPath}
          className={`text-sm ${color} hover:underline flex items-center`}
        >
          View All <ArrowRight size={14} className="ml-1" />
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No {title.toLowerCase()} tasks</p>
          <button
            onClick={onAddTaskClick}
            className="mt-2 text-blue-500 flex items-center mx-auto text-sm"
          >
            <PlusCircle size={14} className="mr-1" /> Add Task
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => renderTask(task, taskType))}
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {renderSummaryCard(
          "Total Tasks",
          summary.total,
          <PlusCircle size={24} className="text-blue-600" />,
          "text-blue-700",
          "bg-white",
          "bg-blue-50"
        )}
        {renderSummaryCard(
          "Completed",
          summary.completed,
          <CheckCircle size={24} className="text-green-600" />,
          "text-green-700",
          "bg-white",
          "bg-green-50"
        )}
        {renderSummaryCard(
          "Due Today",
          summary.dueToday,
          <Calendar size={24} className="text-blue-600" />,
          "text-blue-700",
          "bg-white",
          "bg-blue-50"
        )}
        {renderSummaryCard(
          "Overdue",
          summary.overdue,
          <AlertTriangle size={24} className="text-red-600" />,
          "text-red-700",
          "bg-white",
          "bg-red-50"
        )}
      </div>

      {/* Task Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
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
          "/dashboard/today",
          "text-blue-600"
        )}
        {renderTaskSection(
          "Upcoming Tasks",
          upcomingTasks,
          "upcoming",
          "/dashboard/upcoming",
          "text-green-600"
        )}
      </div>

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg mx-4 overflow-hidden">
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
                  fetchSummary(),
                ]);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
