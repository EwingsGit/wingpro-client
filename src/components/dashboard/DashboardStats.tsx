// src/components/dashboard/DashboardStats.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Task {
  id: number;
  title: string;
  status: string;
  priority: string | null;
  due_date: string | null;
  category_id: number | null;
}

interface Category {
  id: number;
  name: string;
}

// Define a specific type for the STATUS_COLORS keys
type StatusColorKey = "todo" | "inprogress" | "completed";

interface StatusData {
  name: string;
  value: number;
  colorKey: StatusColorKey;
}

interface PriorityData {
  name: string;
  value: number;
}

interface CategoryData {
  name: string;
  count: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
const STATUS_COLORS: Record<StatusColorKey, string> = {
  todo: "#FFBB28",
  inprogress: "#0088FE",
  completed: "#00C49F",
};

export default function DashboardStats() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");

        // Fetch tasks
        const tasksResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/tasks`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Fetch categories
        const categoriesResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/categories`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setTasks(tasksResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate stats
  const statusData: StatusData[] = [
    {
      name: "To Do",
      value: tasks.filter((task) => task.status === "todo").length,
      colorKey: "todo",
    },
    {
      name: "In Progress",
      value: tasks.filter((task) => task.status === "inprogress").length,
      colorKey: "inprogress",
    },
    {
      name: "Completed",
      value: tasks.filter((task) => task.status === "completed").length,
      colorKey: "completed",
    },
  ];

  const priorityData: PriorityData[] = [
    {
      name: "High",
      value: tasks.filter((task) => task.priority === "high").length,
    },
    {
      name: "Medium",
      value: tasks.filter((task) => task.priority === "medium").length,
    },
    {
      name: "Low",
      value: tasks.filter((task) => task.priority === "low").length,
    },
  ];

  // Calculate tasks per category
  const categoryData: CategoryData[] = categories
    .map((category) => ({
      name: category.name,
      count: tasks.filter((task) => task.category_id === category.id).length,
    }))
    .sort((a, b) => b.count - a.count);

  // Calculate completion rates
  const completionRate =
    tasks.length > 0
      ? Math.round(
          (tasks.filter((task) => task.status === "completed").length /
            tasks.length) *
            100
        )
      : 0;

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-2">Total Tasks</h3>
          <p className="text-3xl font-bold">{tasks.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-2">Completion Rate</h3>
          <p className="text-3xl font-bold">{completionRate}%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-2">Categories</h3>
          <p className="text-3xl font-bold">{categories.length}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Task Status Chart */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-4">Tasks by Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {statusData.map((entry) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={STATUS_COLORS[entry.colorKey]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Priority Chart */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-4">Tasks by Priority</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {priorityData.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Category Distribution Chart */}
      {categoryData.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-4">Tasks by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Number of Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
