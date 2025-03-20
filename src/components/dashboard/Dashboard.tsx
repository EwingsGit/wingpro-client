// src/components/dashboard/Dashboard.tsx
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [showAddTask, setShowAddTask] = useState(false);
  const [refreshTasks, setRefreshTasks] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onLogout={onLogout} />

      <main className="flex-1 p-6 overflow-auto">
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowAddTask(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add New Task
          </button>
        </div>

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
          <TaskForm
            onClose={() => setShowAddTask(false)}
            onTaskAdded={() => {
              setShowAddTask(false);
              setRefreshTasks(!refreshTasks);
            }}
          />
        )}
      </main>
    </div>
  );
}
