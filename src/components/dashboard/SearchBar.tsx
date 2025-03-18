// src/components/dashboard/SearchBar.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: string;
  priority: string | null;
  category_id: number | null;
}

// interface SearchResult {
//   tasks: Task[];
// }

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Task[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const searchTasks = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      try {
        setIsSearching(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/tasks/search?q=${encodeURIComponent(query)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setResults(response.data);
      } catch (error) {
        console.error("Error searching tasks:", error);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce search
    const debounceTimer = setTimeout(() => {
      searchTasks();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // You could navigate to a dedicated search results page here
  };

  const handleSelectTask = (taskId: number) => {
    setQuery("");
    setShowResults(false);
    // Navigate to task detail view when implemented
    toast.success(`Task ${taskId} selected`);
    // For now just refresh the main task list
    navigate("/dashboard");
  };

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          placeholder="Search tasks..."
          className="w-full py-2 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </form>

      {showResults && query.trim() && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-y-auto">
          {isSearching ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No results found
            </div>
          ) : (
            <ul>
              {results.map((task) => (
                <li
                  key={task.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectTask(task.id)}
                >
                  <div className="font-medium">{task.title}</div>
                  {task.description && (
                    <div className="text-sm text-gray-500 truncate">
                      {task.description}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
