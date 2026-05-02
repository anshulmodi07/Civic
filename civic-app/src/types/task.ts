export type Complaint = {
  _id: string;
  type: "campus" | "hostel";
  visibility?: "public" | "private";
  hostelName?: string;
  floor?: string;
  roomNumber?: string;
  landmark?: string;       // hostel public only
  area?: string;           // campus only
  locationAddress?: string; // campus only
  description: string;
  departmentId: string;
  status: "pending" | "completed" | "incompleted";
  images?: string[];
  createdAt: string;
};

export type Task = {
  _id: string;
  complaintId: Complaint;  // always populated
  workerId: string;
  status: "accepted" | "in-progress" | "completed" | "incompleted";
  acceptedAt?: string;
  startedAt?: string;
  completedAt?: string;
  incompletedAt?: string;
  proofImages?: string[];
  notes?: string;
  createdAt: string;
};