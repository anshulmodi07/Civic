// src/mock/tasks.js

export const TASKS = [

  {
    _id: "task1",
    complaintId: "cmp3",
    workerId: "w4",
    status: "accepted",
    acceptedAt: new Date(),
    proofImages: [],
    notes: "Assigned to plumber"
  },

  {
    _id: "task2",
    complaintId: "cmp4",
    workerId: "w1",
    status: "in-progress",
    acceptedAt: new Date(),
    startedAt: new Date(),
    proofImages: [],
    notes: "Work started"
  },

  {
    _id: "task3",
    complaintId: "cmp5",
    workerId: "w9",
    status: "completed",
    acceptedAt: new Date(),
    startedAt: new Date(),
    completedAt: new Date(),
    proofImages: ["proof1.jpg"],
    notes: "Issue resolved"
  },

  {
    _id: "task4",
    complaintId: "cmp6",
    workerId: "w2",
    status: "accepted",
    acceptedAt: new Date(),
    proofImages: [],
    notes: ""
  },

  {
    _id: "task5",
    complaintId: "cmp7",
    workerId: "w5",
    status: "in-progress",
    acceptedAt: new Date(),
    startedAt: new Date(),
    proofImages: [],
    notes: ""
  },

  {
    _id: "task6",
    complaintId: "cmp8",
    workerId: "w7",
    status: "accepted",
    acceptedAt: new Date(),
    proofImages: [],
    notes: ""
  }

  // ❌ REMOVED task7 (cmp10 no longer exists in updated complaints)
];