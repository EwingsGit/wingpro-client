// src/components/dashboard/DragDropTaskList.tsx
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: string;
  priority: string | null;
  due_date: string | null;
  order: number;
}

// Define item types for DnD
const ItemTypes = {
  TASK: "task",
};

// TaskCard component with drag functionality
interface TaskCardProps {
  task: Task;
  index: number;
  moveTask: (
    dragIndex: number,
    hoverIndex: number,
    sourceStatus: string,
    targetStatus: string
  ) => void;
  status: string;
}

interface DragItem {
  index: number;
  id: string;
  status: string;
  type: string;
}

const TaskCard = ({ task, index, moveTask, status }: TaskCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TASK,
    item: { id: task.id.toString(), index, status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop<DragItem>({
    accept: ItemTypes.TASK,
    hover: (item, monitor) => {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;
      const sourceStatus = item.status;
      const targetStatus = status;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex && sourceStatus === targetStatus) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveTask(dragIndex, hoverIndex, sourceStatus, targetStatus);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
      item.status = targetStatus;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`bg-white rounded-lg shadow p-3 mb-2 ${
        isDragging ? "opacity-50" : ""
      }`}
      style={{ cursor: "move" }}
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
  );
};

// TaskColumn component
interface TaskColumnProps {
  title: string;
  status: string;
  tasks: Task[];
  moveTask: (
    dragIndex: number,
    hoverIndex: number,
    sourceStatus: string,
    targetStatus: string
  ) => void;
}

const TaskColumn = ({ title, status, tasks, moveTask }: TaskColumnProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    hover: (item: DragItem, monitor) => {
      // If the column is empty or it's a drop directly onto the column (not a task)
      if (tasks.length === 0 && monitor.isOver({ shallow: true })) {
        moveTask(item.index, 0, item.status, status);
        item.index = 0;
        item.status = status;
      }
    },
  });

  drop(ref);

  return (
    <div className="bg-gray-100 rounded-lg p-4">
      <h3 className="font-medium text-lg mb-4">{title}</h3>
      <div ref={ref} className="min-h-[200px]">
        {tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            index={index}
            moveTask={moveTask}
            status={status}
          />
        ))}
      </div>
    </div>
  );
};

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

  const moveTask = (
    dragIndex: number,
    hoverIndex: number,
    sourceStatus: string,
    targetStatus: string
  ) => {
    setTasks((prevTasks) => {
      const newTasks = { ...prevTasks };

      // If moving to a different column
      if (sourceStatus !== targetStatus) {
        const [movedTask] = newTasks[sourceStatus].splice(dragIndex, 1);
        movedTask.status = targetStatus;
        newTasks[targetStatus].splice(hoverIndex, 0, movedTask);
      }
      // If reordering within the same column
      else {
        const items = [...newTasks[sourceStatus]];
        const [reorderedItem] = items.splice(dragIndex, 1);
        items.splice(hoverIndex, 0, reorderedItem);
        newTasks[sourceStatus] = items;
      }

      return newTasks;
    });
  };

  const handleDrop = async () => {
    try {
      const token = localStorage.getItem("token");

      // Update each list to reflect the new order and status
      for (const status in tasks) {
        const taskList = tasks[status];

        for (let i = 0; i < taskList.length; i++) {
          const task = taskList[i];

          // If order changed or status changed
          if (task.order !== i || task.status !== status) {
            await axios.put(
              `${import.meta.env.VITE_API_BASE_URL}/tasks/${task.id}`,
              {
                status: status,
                order: i,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
          }
        }
      }

      toast.success("Task positions updated");
    } catch (error) {
      console.error("Error updating task positions:", error);
      toast.error("Failed to update task positions");
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
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Task Board</h2>
          <button
            onClick={handleDrop}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Positions
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TaskColumn
            title="To Do"
            status="todo"
            tasks={tasks.todo}
            moveTask={moveTask}
          />

          <TaskColumn
            title="In Progress"
            status="inprogress"
            tasks={tasks.inprogress}
            moveTask={moveTask}
          />

          <TaskColumn
            title="Completed"
            status="completed"
            tasks={tasks.completed}
            moveTask={moveTask}
          />
        </div>
      </div>
    </DndProvider>
  );
}
