import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus, Calendar as CalendarIcon, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { Loader } from "@/components/ui/loader";

interface TaskPanelProps {
  usageType: "meetings" | "school";
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskPanel({ usageType, isOpen, onClose }: TaskPanelProps) {
  const tasks = useQuery(api.tasks.list, { usageType });
  const upcomingTasks = useQuery(api.tasks.getUpcoming, { usageType });
  const createTask = useMutation(api.tasks.create);
  const toggleTask = useMutation(api.tasks.toggle);
  const removeTask = useMutation(api.tasks.remove);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    importance: "medium" as "low" | "medium" | "high",
    deadline: "",
    time: "",
  });

  // Check for reminders
  useEffect(() => {
    if (upcomingTasks && upcomingTasks.length > 0) {
      upcomingTasks.forEach((task) => {
        const timeUntilDeadline = task.deadline ? task.deadline - Date.now() : 0;
        const minutesUntil = Math.floor(timeUntilDeadline / 60000);
        
        if (minutesUntil <= 60 && minutesUntil > 0) {
          toast.warning(`Reminder: "${task.title}" is due in ${minutesUntil} minutes!`, {
            duration: 10000,
          });
        }
      });
    }
  }, [upcomingTasks]);

  // Auto-remove completed tasks after 10 minutes
  useEffect(() => {
    if (!tasks) return;

    const completedTasks = tasks.filter((task) => task.completed && task.completedAt);
    completedTasks.forEach((task) => {
      const timeSinceCompletion = Date.now() - (task.completedAt || 0);
      const tenMinutes = 10 * 60 * 1000;

      if (timeSinceCompletion >= tenMinutes) {
        removeTask({ taskId: task._id });
      } else {
        const timeRemaining = tenMinutes - timeSinceCompletion;
        setTimeout(() => {
          removeTask({ taskId: task._id });
        }, timeRemaining);
      }
    });
  }, [tasks, removeTask]);

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) {
      toast.error("Please enter a task title");
      return;
    }

    try {
      const deadline = newTask.deadline
        ? new Date(newTask.deadline).getTime()
        : undefined;

      await createTask({
        title: newTask.title,
        description: newTask.description || undefined,
        importance: newTask.importance,
        deadline,
        time: newTask.time || undefined,
        usageType,
      });

      setNewTask({
        title: "",
        description: "",
        importance: "medium",
        deadline: "",
        time: "",
      });
      setShowAddForm(false);
      toast.success("Task created successfully!");
    } catch (error) {
      toast.error(`Failed to create task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleToggleTask = async (taskId: Id<"tasks">) => {
    try {
      await toggleTask({ taskId });
      toast.success("Task updated successfully");
    } catch (error) {
      toast.error(`Failed to update task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "high":
        return "border-red-500/50 bg-red-500/10";
      case "medium":
        return "border-yellow-500/50 bg-yellow-500/10";
      case "low":
        return "border-green-500/50 bg-green-500/10";
      default:
        return "border-border bg-card";
    }
  };

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case "high":
        return <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400">High</span>;
      case "medium":
        return <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400">Medium</span>;
      case "low":
        return <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">Low</span>;
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25 }}
      className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-background border-l border-border shadow-2xl z-40 overflow-y-auto"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Tasks</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full mb-6"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Task
        </Button>

        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6"
            >
              <Card className="p-4 space-y-4">
                <Input
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
                <Textarea
                  placeholder="Description (optional)"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="min-h-[80px]"
                />
                <Select
                  value={newTask.importance}
                  onValueChange={(value: "low" | "medium" | "high") =>
                    setNewTask({ ...newTask, importance: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select importance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground mb-1 block">
                      <CalendarIcon className="h-3 w-3 inline mr-1" />
                      Deadline
                    </label>
                    <Input
                      type="date"
                      value={newTask.deadline}
                      onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground mb-1 block">
                      <Clock className="h-3 w-3 inline mr-1" />
                      Time
                    </label>
                    <Input
                      type="time"
                      value={newTask.time}
                      onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateTask} className="flex-1">
                    Create Task
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          <AnimatePresence>
            {tasks && tasks.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-muted-foreground"
              >
                <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No tasks yet. Create one to get started!</p>
              </motion.div>
            )}
            {tasks?.map((task) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                layout
              >
                <Card
                  className={`p-4 border ${getImportanceColor(task.importance)} ${
                    task.completed ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => handleToggleTask(task._id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <h3
                        className={`font-semibold text-foreground ${
                          task.completed ? "line-through" : ""
                        }`}
                      >
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {getImportanceBadge(task.importance)}
                        {task.deadline && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            {new Date(task.deadline).toLocaleDateString()}
                          </span>
                        )}
                        {task.time && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.time}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}