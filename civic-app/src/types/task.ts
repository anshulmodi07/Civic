export type Task = {
  id: string;
  taskId?: string;
  complaintId?: string;
  workerId?: string;
  type: "campus" | "hostel";
  issueType: string;
  description?: string;

  landmark?: string;
  address?: string;

  hostelName?: string;
  floor?: string;
  room?: string;

  image?: string;
  reportedAt: string;

  status:
    | "pending"
    | "accepted"
    | "in-progress"
    | "completed"
    | "incomplete";

  shift?: "morning" | "evening" | "night" | "off";

  assignedAt?: string;
  acceptedAt?: string;
  startedAt?: string;
  completedAt?: string;

  note?: string;
  completedImage?: string;
};