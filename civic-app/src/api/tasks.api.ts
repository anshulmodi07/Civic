import { Task } from "@/src/types/task";

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

export const getAllTasks = async (): Promise<Task[]> => {
  return tasks.filter((t) => t.status === "pending");
};

export const getMyTasks = async (): Promise<Task[]> => {
  return tasks.filter((t) => t.status !== "pending");
};

export const acceptTask = async (id: string): Promise<void> => {
  tasks = tasks.map((t) =>
    t.id === id && t.status === "pending"  // ✅ only if pending
      ? { ...t, status: "accepted" }
      : t
  );
};

export const startTask = async (id: string): Promise<void> => {
  tasks = tasks.map((t) =>
    t.id === id && t.status === "accepted"  // ✅ only if accepted
      ? { ...t, status: "in-progress" }
      : t
  );
};

export const completeTask = async (
  id: string,
  status: "completed" | "incomplete",
  note?: string,
  image?: string
): Promise<void> => {
  tasks = tasks.map((t) =>
    t.id === id && t.status === "in-progress"  // ✅ only if in-progress, prevents re-completion
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