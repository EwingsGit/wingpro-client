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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  onLogout: () => void;
  collapsed?: boolean;
  toggleSidebar?: () => void;
}

export default function Sidebar({
  onLogout,
  collapsed = false,
  toggleSidebar,
}: SidebarProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/dashboard" && location.pathname === "/dashboard") {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <aside
      className={`bg-white shadow-md flex flex-col h-full transition-all duration-300 ease-in-out ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="py-5 px-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-2">
            <svg
              width="40"
              height="30"
              viewBox="0 0 200 160"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M95 10 L180 120 L120 85 L95 10" fill="#1e77e3" />
              <path d="M95 10 L30 80 L80 60 L95 10" fill="#3b92f0" />
            </svg>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-gray-800">WingPro</h2>
              <span className="text-xs text-blue-500">thewingpro.com</span>
            </div>
          )}
        </div>
        {toggleSidebar && (
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3">
        <ul className="space-y-2">
          <li>
            <Link
              to="/dashboard"
              className={`sidebar-item ${
                isActive("/dashboard") ? "active" : ""
              }`}
              title={collapsed ? "Dashboard" : ""}
            >
              <LayoutDashboard className="h-5 w-5 min-w-5" />
              {!collapsed && <span className="ml-3">Dashboard</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/all-tasks"
              className={`sidebar-item ${
                isActive("/dashboard/all-tasks") ? "active" : ""
              }`}
              title={collapsed ? "All Tasks" : ""}
            >
              <ListTodo className="h-5 w-5 min-w-5" />
              {!collapsed && <span className="ml-3">All Tasks</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/overdue"
              className={`sidebar-item ${
                isActive("/dashboard/overdue")
                  ? "active text-red-600"
                  : "text-red-600"
              }`}
              title={collapsed ? "Overdue" : ""}
            >
              <ClipboardList className="h-5 w-5 min-w-5" />
              {!collapsed && <span className="ml-3">Overdue</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/today"
              className={`sidebar-item ${
                isActive("/dashboard/today") ? "active" : ""
              }`}
              title={collapsed ? "Today" : ""}
            >
              <Calendar className="h-5 w-5 min-w-5" />
              {!collapsed && <span className="ml-3">Today</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/upcoming"
              className={`sidebar-item ${
                isActive("/dashboard/upcoming") ? "active" : ""
              }`}
              title={collapsed ? "Upcoming" : ""}
            >
              <CalendarClock className="h-5 w-5 min-w-5" />
              {!collapsed && <span className="ml-3">Upcoming</span>}
            </Link>
          </li>
          <li>
            <div className="border-t my-3 mx-2 border-gray-200"></div>
          </li>
          <li>
            <Link
              to="/dashboard/categories"
              className={`sidebar-item ${
                isActive("/dashboard/categories") ? "active" : ""
              }`}
              title={collapsed ? "Categories" : ""}
            >
              <Tag className="h-5 w-5 min-w-5" />
              {!collapsed && <span className="ml-3">Categories</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/stats"
              className={`sidebar-item ${
                isActive("/dashboard/stats") ? "active" : ""
              }`}
              title={collapsed ? "Statistics" : ""}
            >
              <BarChart2 className="h-5 w-5 min-w-5" />
              {!collapsed && <span className="ml-3">Statistics</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/kanban"
              className={`sidebar-item ${
                isActive("/dashboard/kanban") ? "active" : ""
              }`}
              title={collapsed ? "Kanban Board" : ""}
            >
              <Kanban className="h-5 w-5 min-w-5" />
              {!collapsed && <span className="ml-3">Kanban Board</span>}
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
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
