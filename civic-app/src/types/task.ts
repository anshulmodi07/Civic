export type Task = {
  id: string;
  type: "campus" | "hostel";
  issueType: string;
  description?: string;

  landmark?: string;
  address?: string;

  hostelName?: string;
  floor?: string;
  room?: string;

  image?: string;           // ✅ ADD THIS
  reportedAt: string;

  status: string;

  // optional worker-side fields
  note?: string;
  completedImage?: string;
  completedAt?: string;
};