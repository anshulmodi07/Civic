import api from "./axios";
import { USE_DEMO_API } from "./config";
import type { Task } from "@/src/types/task";

/* ---------------- DEMO STORE ---------------- */

const createTaskStore = () => {
  const tasks: Task[] = [
    {
      id: "t001",
      taskId: "t001",
      complaintId: "c002",
      workerId: "worker_demo",
      type: "campus",
      issueType: "electrician",
      description: "Street light not working",
      landmark: "Main Gate",
      address: "College Entrance Road",
      image: "",
      reportedAt: "2026-04-02 10:30",
      status: "pending",
      assignedAt: "2026-04-02 09:55",
    },
    {
      id: "t002",
      taskId: "t002",
      complaintId: "c003",
      workerId: "worker_demo",
      type: "hostel",
      issueType: "plumber",
      description: "Water leakage in washroom",
      hostelName: "Dhaula",
      floor: "2",
      room: "203",
      image: "",
      reportedAt: "2026-04-02 11:15",
      status: "pending",
      assignedAt: "2026-04-02 10:45",
    },
  ];

  return {
    getAll: () => [...tasks],

    updateStatus: (id: string, newStatus: Task["status"]) => {
      const task = tasks.find((t) => t.id === id);
      if (task) {
        task.status = newStatus;
      }
    },
  };
};

const TASK_STORE = createTaskStore();

/* ---------------- API FUNCTIONS ---------------- */

// All pending tasks (available to pick)
export const getAllTasks = async (): Promise<Task[]> => {
  if (!USE_DEMO_API) {
    const response = await api.get("/tasks/available");
    return response.data;
  }

  return TASK_STORE.getAll().filter((t) => t.status === "pending");
};

// Tasks accepted or in progress (worker's tasks)
export const getMyTasks = async (): Promise<Task[]> => {
  if (!USE_DEMO_API) {
    const response = await api.get("/tasks/my");
    return response.data;
  }

  return TASK_STORE.getAll().filter((t) => t.status !== "pending");
};

// Accept task
export const acceptTask = async (id: string): Promise<void> => {
  if (!USE_DEMO_API) {
    await api.patch(`/tasks/${id}/accept`);
    return;
  }

  const all = TASK_STORE.getAll();
  const task = all.find((t) => t.id === id);

  if (task?.status === "pending") {
    TASK_STORE.updateStatus(id, "accepted");
  }
};

// Start task
export const startTask = async (id: string): Promise<void> => {
  if (!USE_DEMO_API) {
    await api.patch(`/tasks/${id}/start`);
    return;
  }

  const all = TASK_STORE.getAll();
  const task = all.find((t) => t.id === id);

  if (task?.status === "accepted") {
    TASK_STORE.updateStatus(id, "in-progress");
  }
};

// Complete task
export const completeTask = async (
  id: string,
  status: "completed" | "incomplete",
  note?: string,
  image?: string
): Promise<void> => {
  if (!USE_DEMO_API) {
    await api.patch(`/tasks/${id}/complete`, { proofImages: [image].filter(Boolean), notes: note });
    return;
  }

  const all = TASK_STORE.getAll();
  const task = all.find((t) => t.id === id);

  if (task?.status === "in-progress") {
    TASK_STORE.updateStatus(id, status);

    task.note = note || "";
    task.completedImage = image || "";
    task.completedAt = new Date().toLocaleString();
  }
};