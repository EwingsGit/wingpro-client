// src/components/dashboard/Dashboard.tsx
import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import Sidebar from "./Sidebar";
import Categories from "./Categories";
import TodayTasks from "./TodayTasks";
import UpcomingTasks from "./UpcomingTasks";
import DashboardStats from "./DashboardStats";
import DragDropTaskList from "./DragDropTaskList";

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [showAddTask, setShowAddTask] = useState(false);
  const [refreshTasks, setRefreshTasks] = useState(false);
  const location = useLocation();

  // Debug current path
  console.log("Current path:", location.pathname);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onLogout={onLogout} />

      <main className="flex-1 p-6 overflow-auto">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold">Your Tasks</h1>
                  <button
                    onClick={() => setShowAddTask(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add New Task
                  </button>
                </div>
                <TaskList key={refreshTasks ? "refresh" : "normal"} />
              </>
            }
          />
          <Route
            path="today"
            element={
              <>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold">Today's Tasks</h1>
                  <button
                    onClick={() => setShowAddTask(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add New Task
                  </button>
                </div>
                <TodayTasks />
              </>
            }
          />
          <Route
            path="upcoming"
            element={
              <>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold">Upcoming Tasks</h1>
                  <button
                    onClick={() => setShowAddTask(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add New Task
                  </button>
                </div>
                <UpcomingTasks />
              </>
            }
          />
          <Route path="categories" element={<Categories />} />
          <Route path="stats" element={<DashboardStats />} />
          <Route path="kanban" element={<DragDropTaskList />} />
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
