// 📦 MOCK DATABASE (frontend only for now)

let tasks = [
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


// 📌 GET ALL TASKS (only pending)
export const getAllTasks = async () => {
  return tasks.filter((t) => t.status === "pending");
};


// 📌 MY TASKS (accepted + in-progress + completed + incomplete)
export const getMyTasks = async () => {
  return tasks.filter((t) => t.status !== "pending");
};


// 📌 ACCEPT TASK
export const acceptTask = async (id) => {
  tasks = tasks.map((t) =>
    t.id === id ? { ...t, status: "accepted" } : t
  );
};


// 📌 START TASK
export const startTask = async (id) => {
  tasks = tasks.map((t) =>
    t.id === id ? { ...t, status: "in-progress" } : t
  );
};


// 📌 COMPLETE / INCOMPLETE TASK
export const completeTask = async (id, status, note, image) => {
  tasks = tasks.map((t) =>
    t.id === id
      ? {
          ...t,
          status: status, // "completed" or "incomplete"
          note: note || "",
          completedImage: image || "",
          completedAt: new Date().toLocaleString(),
        }
      : t
  );
};