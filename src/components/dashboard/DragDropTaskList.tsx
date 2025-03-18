// src/components/dashboard/DragDropTaskList.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: string;
  priority: string | null;
  due_date: string | null;
  order: number;
}

export default function DragDropTaskList() {
  const [tasks, setTasks] = useState<Record<string, Task[]>>({
    todo: [],
    inprogress: [],
    completed: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/tasks`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Group tasks by status
      const groupedTasks: Record<string, Task[]> = {
        todo: [],
        inprogress: [],
        completed: [],
      };

      response.data.forEach((task: Task) => {
        if (groupedTasks[task.status]) {
          groupedTasks[task.status].push(task);
        }
      });

      // Sort tasks by order if available, otherwise by ID
      Object.keys(groupedTasks).forEach((status) => {
        groupedTasks[status].sort((a, b) => {
          if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
          }
          return a.id - b.id;
        });
      });

      setTasks(groupedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = async (result: any) => {
    const { source, destination } = result;

    // Dropped outside a droppable area
    if (!destination) return;

    // No change in position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    // Create a copy of tasks
    const newTasks = { ...tasks };

    // Remove task from source
    const [movedTask] = newTasks[source.droppableId].splice(source.index, 1);

    // Update task status if dropped in a different column
    if (source.droppableId !== destination.droppableId) {
      movedTask.status = destination.droppableId;
    }

    // Insert task at destination
    newTasks[destination.droppableId].splice(destination.index, 0, movedTask);

    // Update state
    setTasks(newTasks);

    // Update order and status in the database
    try {
      const token = localStorage.getItem("token");

      // Update the moved task
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/tasks/${movedTask.id}`,
        {
          status: movedTask.status,
          order: destination.index,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update orders of all affected tasks
      newTasks[destination.droppableId].forEach(async (task, index) => {
        if (task.order !== index) {
          await axios.put(
            `${import.meta.env.VITE_API_BASE_URL}/tasks/${task.id}`,
            { order: index },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      });

      toast.success("Task moved successfully");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task position");
      // Revert to original state on error
      fetchTasks();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* To Do Column */}
        <div className="bg-gray-100 rounded-lg p-4">
          <h3 className="font-medium text-lg mb-4">To Do</h3>
          <Droppable droppableId="todo">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="min-h-[200px]"
              >
                {tasks.todo.map((task, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={task.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white rounded-lg shadow p-3 mb-2"
                      >
                        <div className="font-medium">{task.title}</div>
                        {task.description && (
                          <div className="text-sm text-gray-500 mt-1 truncate">
                            {task.description}
                          </div>
                        )}
                        {task.priority && (
                          <div
                            className={`mt-2 text-xs inline-block px-2 py-1 rounded-full ${
                              task.priority === "high"
                                ? "bg-red-100 text-red-800"
                                : task.priority === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {task.priority}
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        {/* In Progress Column */}
        <div className="bg-gray-100 rounded-lg p-4">
          <h3 className="font-medium text-lg mb-4">In Progress</h3>
          <Droppable droppableId="inprogress">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="min-h-[200px]"
              >
                {tasks.inprogress.map((task, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={task.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white rounded-lg shadow p-3 mb-2"
                      >
                        <div className="font-medium">{task.title}</div>
                        {task.description && (
                          <div className="text-sm text-gray-500 mt-1 truncate">
                            {task.description}
                          </div>
                        )}
                        {task.priority && (
                          <div
                            className={`mt-2 text-xs inline-block px-2 py-1 rounded-full ${
                              task.priority === "high"
                                ? "bg-red-100 text-red-800"
                                : task.priority === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {task.priority}
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        {/* Completed Column */}
        <div className="bg-gray-100 rounded-lg p-4">
          <h3 className="font-medium text-lg mb-4">Completed</h3>
          <Droppable droppableId="completed">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="min-h-[200px]"
              >
                {tasks.completed.map((task, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={task.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white rounded-lg shadow p-3 mb-2"
                      >
                        <div className="font-medium">{task.title}</div>
                        {task.description && (
                          <div className="text-sm text-gray-500 mt-1 truncate">
                            {task.description}
                          </div>
                        )}
                        {task.priority && (
                          <div
                            className={`mt-2 text-xs inline-block px-2 py-1 rounded-full ${
                              task.priority === "high"
                                ? "bg-red-100 text-red-800"
                                : task.priority === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {task.priority}
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>
    </DragDropContext>
  );
}
