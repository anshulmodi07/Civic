// 📦 MOCK DATABASE (frontend only for now)

import { Task } from "@/src/types/task";

/* ---------------- MOCK DATA ---------------- */

let tasks: Task[] = [
  {
    id: "1",
    type: "campus",
    issueType: "Road Repair",
    description: "Big pothole near main gate",

    landmark: "Main Gate",
    address: "College Entrance Road",

    image: "",
    reportedAt: "2026-04-02 10:30",

    status: "pending",
  },
  {
    id: "2",
    type: "hostel",
    issueType: "Water Leakage",
    description: "Leakage in washroom",

    hostelName: "Dhaula",
    floor: "2",
    room: "203",

    image: "",
    reportedAt: "2026-04-02 11:15",

    status: "pending",
  },
];

/* ---------------- GET ALL TASKS ---------------- */
// Only pending tasks

export const getAllTasks = async (): Promise<Task[]> => {
  return tasks.filter((t) => t.status === "pending");
};

/* ---------------- MY TASKS ---------------- */
// accepted + in-progress + completed + incomplete

export const getMyTasks = async (): Promise<Task[]> => {
  return tasks.filter((t) => t.status !== "pending");
};

/* ---------------- ACCEPT TASK ---------------- */

export const acceptTask = async (id: string): Promise<void> => {
  tasks = tasks.map((t) =>
    t.id === id ? { ...t, status: "accepted" } : t
  );
};

/* ---------------- START TASK ---------------- */

export const startTask = async (id: string): Promise<void> => {
  tasks = tasks.map((t) =>
    t.id === id ? { ...t, status: "in-progress" } : t
  );
};

/* ---------------- COMPLETE / INCOMPLETE ---------------- */

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