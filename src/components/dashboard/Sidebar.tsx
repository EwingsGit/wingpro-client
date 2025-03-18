// src/components/dashboard/Sidebar.tsx
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  onLogout: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const location = useLocation();

  const isActive = (path: string) => {
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
              className={`block px-4 py-2 ${
                isActive("/dashboard")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              All Tasks
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/today"
              className={`block px-4 py-2 ${
                isActive("/dashboard/today")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              Today
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/upcoming"
              className={`block px-4 py-2 ${
                isActive("/dashboard/upcoming")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              Upcoming
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
              Categories
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
              Dashboard Stats
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
              Kanban Board
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t mt-auto">
        <button
          onClick={onLogout}
          className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-md"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
