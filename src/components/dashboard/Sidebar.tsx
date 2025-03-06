// src/components/dashboard/Sidebar.tsx
import { Link } from "react-router-dom";

interface SidebarProps {
  onLogout: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">WingPro</h2>
      </div>

      <nav className="py-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/dashboard"
              className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            >
              All Tasks
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/today"
              className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            >
              Today
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/upcoming"
              className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            >
              Upcoming
            </Link>
          </li>
          <li className="border-t my-2"></li>
          <li>
            <Link
              to="/dashboard/categories"
              className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            >
              Categories
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mt-auto p-4 border-t">
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
