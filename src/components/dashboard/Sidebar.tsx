// src/components/dashboard/Sidebar.tsx
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ListTodo,
  CalendarClock,
  Calendar,
  ClipboardList,
  Tag,
  BarChart2,
  Kanban,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  onLogout: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/dashboard" && location.pathname === "/dashboard") {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <aside className="w-64 bg-white shadow-md flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">WingPro</h2>
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
              <LayoutDashboard className="h-5 w-5 mr-2" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/all-tasks"
              className={`flex items-center px-4 py-2 ${
                isActive("/dashboard/all-tasks")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <ListTodo className="h-5 w-5 mr-2" />
              All Tasks
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/overdue"
              className={`flex items-center px-4 py-2 ${
                isActive("/dashboard/overdue")
                  ? "bg-red-50 text-red-600"
                  : "text-red-600 hover:bg-red-50 hover:text-red-700"
              }`}
            >
              <ClipboardList className="h-5 w-5 mr-2" />
              Overdue
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
              <Calendar className="h-5 w-5 mr-2" />
              Today
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
              <CalendarClock className="h-5 w-5 mr-2" />
              Upcoming
            </Link>
          </li>
          <li className="border-t my-2"></li>
          <li>
            <Link
              to="/dashboard/categories"
              className={`flex items-center px-4 py-2 ${
                isActive("/dashboard/categories")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <Tag className="h-5 w-5 mr-2" />
              Categories
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/stats"
              className={`flex items-center px-4 py-2 ${
                isActive("/dashboard/stats")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <BarChart2 className="h-5 w-5 mr-2" />
              Statistics
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/kanban"
              className={`flex items-center px-4 py-2 ${
                isActive("/dashboard/kanban")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <Kanban className="h-5 w-5 mr-2" />
              Kanban Board
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t mt-auto">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </button>
      </div>
    </aside>
  );
}
