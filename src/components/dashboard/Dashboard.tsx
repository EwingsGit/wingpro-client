// src/components/dashboard/Dashboard.tsx
import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PlusCircle, Menu } from "lucide-react";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import Sidebar from "./Sidebar";
import Categories from "./Categories";
import TodayTasks from "./TodayTasks";
import UpcomingTasks from "./UpcomingTasks";
import OverdueTasks from "./OverdueTasks";
import DashboardStats from "./DashboardStats";
import DragDropTaskList from "./DragDropTaskList";
import DashboardHome from "./DashboardHome";
import "../../../src/theme.css";

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [showAddTask, setShowAddTask] = useState(false);
  const [refreshTasks, setRefreshTasks] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`sidebar fixed md:relative z-10 h-full transition-all duration-300 ease-in-out ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0 md:w-20"
        }`}
      >
        <Sidebar
          onLogout={onLogout}
          collapsed={!sidebarOpen && !isMobile}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-0"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <Menu size={24} />
            </button>
          )}

          <button
            onClick={() => setShowAddTask(true)}
            className="btn-primary flex items-center shadow-md ml-auto"
          >
            <PlusCircle className="h-5 w-5 mr-1" />
            Add New Task
          </button>
        </div>

        <div className="fade-in">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route
              path="all-tasks"
              element={<TaskList key={refreshTasks ? "refresh" : "normal"} />}
            />
            <Route path="today" element={<TodayTasks />} />
            <Route path="upcoming" element={<UpcomingTasks />} />
            <Route path="overdue" element={<OverdueTasks />} />
            <Route path="categories" element={<Categories />} />
            <Route path="stats" element={<DashboardStats />} />
            <Route path="kanban" element={<DragDropTaskList />} />
            {/* Redirect any other dashboard paths to home */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>

          {showAddTask && (
            <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50">
              <div className="modal-content max-w-md mx-4 fade-in">
                <TaskForm
                  onClose={() => setShowAddTask(false)}
                  onTaskAdded={() => {
                    setShowAddTask(false);
                    setRefreshTasks(!refreshTasks);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
