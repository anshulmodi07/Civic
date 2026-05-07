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
  address?: string;
  description: string;
  departmentId: string;
  issueType?: string;
  status: "pending" | "completed" | "incompleted";
  images?: string[];
  room?: string;
  createdAt: string;
};

export type Task = {
  _id: string;
  complaintId: Complaint;  // always populated
  workerId: string;
  status: "accepted" | "in-progress" | "completed" | "incompleted";
  type?: "campus" | "hostel";
  issueType?: string;
  description?: string;
  reportedAt?: string;
  landmark?: string;
  address?: string;
  hostelName?: string;
  floor?: string;
  room?: string;
  acceptedAt?: string;
  startedAt?: string;
  completedAt?: string;
  incompletedAt?: string;
  proofImages?: string[];
  notes?: string;
  createdAt: string;
};
