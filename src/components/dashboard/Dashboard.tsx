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
import DashboardHome from "./DashboardHome";
import DragDropTaskList from "./DragDropTaskList";
import PageTitle from "../common/PageTitle";

interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [showAddTask, setShowAddTask] = useState(false);
  const [refreshTasks, setRefreshTasks] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onLogout={onLogout} />

      <main className="flex-1 p-6 overflow-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard/home" replace />} />
          <Route
            path="home"
            element={
              <>
                <PageTitle
                  title="Dashboard"
                  showAddButton={true}
                  onAddClick={() => setShowAddTask(true)}
                />
                <DashboardHome onAddTaskClick={() => setShowAddTask(true)} />
              </>
            }
          />
          <Route
            path="tasks"
            element={
              <>
                <PageTitle
                  title="All Tasks"
                  showAddButton={true}
                  onAddClick={() => setShowAddTask(true)}
                />
                <TaskList key={refreshTasks ? "refresh" : "normal"} />
              </>
            }
          />
          <Route
            path="today"
            element={
              <>
                <PageTitle
                  title="Today's Tasks"
                  showAddButton={true}
                  onAddClick={() => setShowAddTask(true)}
                />
                <TodayTasks />
              </>
            }
          />
          <Route
            path="upcoming"
            element={
              <>
                <PageTitle
                  title="Upcoming Tasks"
                  showAddButton={true}
                  onAddClick={() => setShowAddTask(true)}
                />
                <UpcomingTasks />
              </>
            }
          />

          <Route
            path="overdue"
            element={
              <>
                <PageTitle
                  title="Overdue Tasks"
                  className="text-2xl font-bold text-red-600"
                  showAddButton={true}
                  onAddClick={() => setShowAddTask(true)}
                />
                <OverdueTasks />
              </>
            }
          />

          <Route
            path="categories"
            element={
              <>
                <PageTitle title="Categories" />
                <Categories />
              </>
            }
          />
          <Route
            path="stats"
            element={
              <>
                <PageTitle title="Dashboard Stats" />
                <DashboardStats />
              </>
            }
          />
          <Route
            path="kanban"
            element={
              <>
                <PageTitle title="Kanban Board" />
                <DragDropTaskList />
              </>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
        </Routes>

        {showAddTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
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
      </main>
    </div>
  );
}
