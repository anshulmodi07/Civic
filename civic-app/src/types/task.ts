export type Task = {
  id: string;
  issueType: string;
  status: string;
  type: "campus" | "hostel";
  reportedAt: string;
description?: string; 
  landmark?: string;
  address?: string;

  hostelName?: string;
  floor?: string;
  room?: string;
};