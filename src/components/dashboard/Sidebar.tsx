// src/components/dashboard/Sidebar.tsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

interface SidebarProps {
  onLogout: () => void;
  collapsed?: boolean;
  toggleSidebar?: () => void;
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

export default function Sidebar({
  onLogout,
  collapsed,
  toggleSidebar,
}: SidebarProps) {
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
    // For the dashboard root, match both "/dashboard" and "/dashboard/"
    if (path === "/dashboard") {
      return (
        location.pathname === "/dashboard" ||
        location.pathname === "/dashboard/"
      );
    }
    return location.pathname === path;
  };

  // Counter component with loading state
  const Counter = ({ count }: { count: number }) => (
    <span className="ml-auto bg-gray-200 text-gray-700 text-xs font-medium rounded-full px-2 py-0.5 min-w-[1.5rem] text-center">
      {isLoading ? "..." : count}
    </span>
  );

  // Handle collapsed state if provided
  const sidebarClasses = `bg-white shadow-md flex flex-col h-full ${
    collapsed ? "w-16" : "w-64"
  }`;

  return (
    <aside className={sidebarClasses}>
      <div className="p-4 border-b flex justify-between items-center">
        {!collapsed && <h2 className="text-xl font-bold">WingPro</h2>}
        {toggleSidebar && (
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-full hover:bg-gray-200"
          >
            {collapsed ? "→" : "←"}
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          <li>
            <Link
              to="/dashboard"
              className={`flex items-center px-4 py-2 ${
                isActive("/dashboard")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <span>{!collapsed && "All Tasks"}</span>
              {!collapsed && <Counter count={taskCounts.all} />}
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/overdue"
              className={`flex items-center px-4 py-2 ${
                isActive("/dashboard/overdue")
                  ? "bg-blue-50 text-red-600"
                  : "text-red-600 hover:bg-red-50 hover:text-red-700"
              }`}
            >
              <span>{!collapsed && "Overdue"}</span>
              {!collapsed && <Counter count={taskCounts.overdue} />}
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/today"
              className={`flex items-center px-4 py-2 ${
                isActive("/dashboard/today")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <span>{!collapsed && "Today"}</span>
              {!collapsed && <Counter count={taskCounts.today} />}
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/upcoming"
              className={`flex items-center px-4 py-2 ${
                isActive("/dashboard/upcoming")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <span>{!collapsed && "Upcoming"}</span>
              {!collapsed && <Counter count={taskCounts.upcoming} />}
            </Link>
          </li>
          <li className="border-t my-2"></li>
          <li>
            <Link
              to="/dashboard/categories"
              className={`block px-4 py-2 ${
                isActive("/dashboard/categories")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {!collapsed && "Categories"}
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/stats"
              className={`block px-4 py-2 ${
                isActive("/dashboard/stats")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {!collapsed && "Dashboard Stats"}
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/kanban"
              className={`block px-4 py-2 ${
                isActive("/dashboard/kanban")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {!collapsed && "Kanban Board"}
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t mt-auto">
        <button
          onClick={onLogout}
          className={`w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md ${
            collapsed ? "px-2" : ""
          }`}
        >
          {!collapsed ? "Logout" : "←"}
        </button>
      </div>
    </aside>
  );
}
