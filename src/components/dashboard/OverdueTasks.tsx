// src/components/dashboard/OverdueTasks.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: string;
  priority: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export default function OverdueTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOverdueTasks();
  }, []);

  const fetchOverdueTasks = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      // Get today's date in YYYY-MM-DD format
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/tasks`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Filter tasks that are overdue (due before today and not completed)
      const overdueTasks = response.data.filter((task: Task) => {
        if (!task.due_date) return false;
        const taskDate = new Date(task.due_date);
        return taskDate < today && task.status !== "completed";
      });

      // Sort by due date (oldest first)
      overdueTasks.sort((a: Task, b: Task) => {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      });

      setTasks(overdueTasks);
    } catch (error) {
      console.error("Error fetching overdue tasks:", error);
      toast.error("Failed to fetch tasks");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No overdue tasks</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{task.title}</h3>
                  {task.description && (
                    <p className="text-gray-600 mt-1">{task.description}</p>
                  )}
                  <div className="mt-2 flex items-center space-x-4 text-sm">
                    {task.due_date && (
                      <span className="text-red-500 font-medium">
                        Due: {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    )}
                    {task.priority && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          task.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : task.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {task.priority}
                      </span>
                    )}
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        task.status === "todo"
                          ? "bg-gray-100 text-gray-800"
                          : task.status === "inprogress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {task.status === "todo"
                        ? "To Do"
                        : task.status === "inprogress"
                        ? "In Progress"
                        : "Completed"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
