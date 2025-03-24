// src/components/dashboard/Sidebar.tsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Home,
  Calendar,
  AlertTriangle,
  CalendarCheck,
  BarChart3,
  Layers,
  ListTodo,
  LogOut,
  Tag,
} from "lucide-react";

interface SidebarProps {
  onLogout: () => void;
}

interface TaskCounts {
  all: number;
  overdue: number;
  today: number;
  upcoming: number;
}

interface Task {
  id: number;
  status: string;
  due_date: string | null;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const location = useLocation();
  const [taskCounts, setTaskCounts] = useState<TaskCounts>({
    all: 0,
    overdue: 0,
    today: 0,
    upcoming: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTaskCounts();
  }, [location.pathname]); // Refresh counts when navigating between pages

  const fetchTaskCounts = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/tasks`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const tasks: Task[] = response.data;

      // Calculate counts
      const allCount = tasks.length;

      // Get today's date
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Tomorrow for today's tasks
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Two weeks for upcoming tasks
      const twoWeeksLater = new Date(today);
      twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);

      // Count overdue tasks (due before today and not completed)
      const overdueCount = tasks.filter((task) => {
        if (!task.due_date) return false;
        const dueDate = new Date(task.due_date);
        return dueDate < today && task.status !== "completed";
      }).length;

      // Count today's tasks
      const todayCount = tasks.filter((task) => {
        if (!task.due_date) return false;
        const dueDate = new Date(task.due_date);
        return dueDate >= today && dueDate < tomorrow;
      }).length;

      // Count upcoming tasks (next two weeks, excluding today)
      const upcomingCount = tasks.filter((task) => {
        if (!task.due_date) return false;
        const dueDate = new Date(task.due_date);
        return dueDate >= tomorrow && dueDate <= twoWeeksLater;
      }).length;

      setTaskCounts({
        all: allCount,
        overdue: overdueCount,
        today: todayCount,
        upcoming: upcomingCount,
      });
    } catch (error) {
      console.error("Error fetching task counts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Counter component with loading state
  const Counter = ({ count }: { count: number }) => (
    <span className="ml-auto bg-gray-100 text-gray-700 text-xs font-medium rounded-full px-2 py-0.5 min-w-[1.5rem] text-center">
      {isLoading ? "..." : count}
    </span>
  );

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full z-10">
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2"
          >
            <path
              d="M16 3C8.82 3 3 8.82 3 16C3 23.18 8.82 29 16 29C23.18 29 29 23.18 29 16C29 8.82 23.18 3 16 3ZM16 7C18.76 7 21 9.24 21 12C21 14.76 18.76 17 16 17C13.24 17 11 14.76 11 12C11 9.24 13.24 7 16 7ZM16 25.4C12.5 25.4 9.44 23.66 7.6 21C7.64 18.5 12.8 17.1 16 17.1C19.2 17.1 24.36 18.5 24.4 21C22.56 23.66 19.5 25.4 16 25.4Z"
              fill="#1D4ED8"
            />
          </svg>
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            WingPro
          </h2>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-5">
        <div className="px-4 pb-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Dashboard
          </h3>
        </div>
        <ul className="mt-2 space-y-1">
          <li>
            <Link
              to="/dashboard/home"
              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg ${
                isActive("/dashboard/home")
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Home
                size={18}
                className={
                  isActive("/dashboard/home")
                    ? "text-blue-700"
                    : "text-gray-500"
                }
              />
              <span className="ml-3">Dashboard</span>
            </Link>
          </li>

          <li>
            <Link
              to="/dashboard/tasks"
              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg ${
                isActive("/dashboard/tasks")
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ListTodo
                size={18}
                className={
                  isActive("/dashboard/tasks")
                    ? "text-blue-700"
                    : "text-gray-500"
                }
              />
              <span className="ml-3">All Tasks</span>
              <Counter count={taskCounts.all} />
            </Link>
          </li>
        </ul>

        <div className="px-4 pt-5 pb-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Tasks
          </h3>
        </div>
        <ul className="mt-2 space-y-1">
          <li>
            <Link
              to="/dashboard/today"
              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg ${
                isActive("/dashboard/today")
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Calendar
                size={18}
                className={
                  isActive("/dashboard/today")
                    ? "text-blue-700"
                    : "text-gray-500"
                }
              />
              <span className="ml-3">Today</span>
              <Counter count={taskCounts.today} />
            </Link>
          </li>

          <li>
            <Link
              to="/dashboard/upcoming"
              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg ${
                isActive("/dashboard/upcoming")
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <CalendarCheck
                size={18}
                className={
                  isActive("/dashboard/upcoming")
                    ? "text-blue-700"
                    : "text-gray-500"
                }
              />
              <span className="ml-3">Upcoming</span>
              <Counter count={taskCounts.upcoming} />
            </Link>
          </li>

          <li>
            <Link
              to="/dashboard/overdue"
              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg ${
                isActive("/dashboard/overdue")
                  ? "bg-red-50 text-red-700"
                  : "text-red-600 hover:bg-red-50 hover:text-red-700"
              }`}
            >
              <AlertTriangle size={18} className="text-red-600" />
              <span className="ml-3">Overdue</span>
              <Counter count={taskCounts.overdue} />
            </Link>
          </li>

          <li>
            <Link
              to="/dashboard/kanban"
              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg ${
                isActive("/dashboard/kanban")
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Layers
                size={18}
                className={
                  isActive("/dashboard/kanban")
                    ? "text-blue-700"
                    : "text-gray-500"
                }
              />
              <span className="ml-3">Kanban Board</span>
            </Link>
          </li>
        </ul>

        <div className="px-4 pt-5 pb-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Organize
          </h3>
        </div>
        <ul className="mt-2 space-y-1">
          <li>
            <Link
              to="/dashboard/categories"
              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg ${
                isActive("/dashboard/categories")
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Tag
                size={18}
                className={
                  isActive("/dashboard/categories")
                    ? "text-blue-700"
                    : "text-gray-500"
                }
              />
              <span className="ml-3">Categories</span>
            </Link>
          </li>

          <li>
            <Link
              to="/dashboard/stats"
              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg ${
                isActive("/dashboard/stats")
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <BarChart3
                size={18}
                className={
                  isActive("/dashboard/stats")
                    ? "text-blue-700"
                    : "text-gray-500"
                }
              />
              <span className="ml-3">Statistics</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200 mt-auto">
        <button
          onClick={onLogout}
          className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
        >
          <LogOut size={18} className="text-gray-500 mr-2" />
          Logout
        </button>
      </div>
    </aside>
  );
}
