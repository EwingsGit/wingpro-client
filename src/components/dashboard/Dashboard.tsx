// src/components/dashboard/Dashboard.tsx
import { useState } from "react";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import Sidebar from "./Sidebar";

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
        <div className="max-w-7xl mx-auto">
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

          {showAddTask && (
            <TaskForm
              onClose={() => setShowAddTask(false)}
              onTaskAdded={() => {
                setShowAddTask(false);
                setRefreshTasks(!refreshTasks); // Toggle to trigger re-fetch
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}
