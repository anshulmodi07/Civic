import api from "./axios";
import { USE_DEMO_API } from "./config";
import type { Task } from "@/src/types/task";

/* ---------------- GLOBAL STORE ---------------- */

let tasks: Task[] = [
  {
    id: "1",
    type: "campus",
    issueType: "electrician",
    description: "Broken light fixture",
    landmark: "Main Gate",
    address: "College Road",
    image: "",
    reportedAt: "2026-04-02 10:30",
    status: "in-progress",
    shift: "morning",
  },
  {
    id: "2",
    type: "hostel",
    issueType: "electrician",
    description: "Faulty electrical outlet",
    hostelName: "Dhaula",
    floor: "2",
    room: "203",
    image: "",
    reportedAt: "2026-04-02 11:15",
    status: "pending",
    shift: "evening",
  },
];

/* ---------------- API FUNCTIONS ---------------- */

// 📌 All pending tasks
export const getAllTasks = async (): Promise<Task[]> => {
  return tasks.filter((t) => t.status === "pending");
};

// 📌 My tasks
export const getMyTasks = async (): Promise<Task[]> => {
  return tasks.filter((t) => t.status !== "pending");
};

// 📌 Accept task
export const acceptTask = async (id: string): Promise<void> => {
  tasks = tasks.map((t) =>
    t.id === id ? { ...t, status: "accepted" } : t
  );
};

// 📌 Start task
export const startTask = async (id: string): Promise<void> => {
  tasks = tasks.map((t) =>
    t.id === id ? { ...t, status: "in-progress" } : t
  );
};

// 📌 Complete / Incomplete
export const completeTask = async (
  id: string,
  status: "completed" | "incomplete",
  note?: string,
  image?: string
): Promise<void> => {
  tasks = tasks.map((t) =>
    t.id === id
      ? {
          ...t,
          status,
          note: note || "",
          completedImage: image || "",
          completedAt: new Date().toLocaleString(),
        }
      : t
  );
};

// 📌 Revive incomplete task
export const reviveTask = async (id: string): Promise<void> => {
  tasks = tasks.map((t) =>
    t.id === id ? { ...t, status: "accepted" } : t
  );
};