// src/mock/complaints.js

export const COMPLAINTS = [

  // HOSTEL (PRIVATE)
  {
    _id: "cmp1",
    userId: "user1",
    type: "hostel",
    visibility: "private",
    hostelName: "A",
    floor: "2",
    roomNumber: "203",
    description: "Light not working in room since 2 days",
    departmentId: "dept-electrician",
    status: "pending",
    location: { lat: 28.6139, lng: 77.2090 },
    images: [],
    createdAt: new Date()
  },

  // HOSTEL (PUBLIC)
  {
    _id: "cmp2",
    userId: "user2",
    type: "hostel",
    visibility: "public",
    hostelName: "B",
    floor: "Ground",
    landmark: "Near entrance gate",
    description: "Water leakage near hostel entrance causing slippery floor",
    departmentId: "dept-plumber",
    status: "pending",
    location: { lat: 28.6145, lng: 77.2085 },
    images: [],
    createdAt: new Date()
  },

  // CAMPUS
  {
    _id: "cmp3",
    userId: "user3",
    type: "campus",
    area: "Library",
    locationAddress: "Central Library Block A",
    description: "WiFi not working inside reading hall",
    departmentId: "dept-wifi",
    status: "pending",
    location: { lat: 28.6150, lng: 77.2100 },
    images: [],
    createdAt: new Date()
  },

  // COMPLETED
  {
    _id: "cmp4",
    userId: "user4",
    type: "campus",
    area: "Road",
    locationAddress: "Main gate road",
    description: "Pothole fixed recently but needs finishing work",
    departmentId: "dept-civil",
    status: "completed",
    location: { lat: 28.6160, lng: 77.2110 },
    images: [],
    createdAt: new Date()
  },

  // INCOMPLETED
  {
    _id: "cmp5",
    userId: "user5",
    type: "hostel",
    visibility: "private",
    hostelName: "C",
    floor: "1",
    roomNumber: "110",
    description: "Fan repaired but still making noise",
    departmentId: "dept-electrician",
    status: "incompleted",
    location: { lat: 28.6170, lng: 77.2120 },
    images: [],
    createdAt: new Date()
  },

  // MORE DATA
  {
    _id: "cmp6",
    userId: "user6",
    type: "campus",
    area: "Canteen",
    locationAddress: "Food court backside",
    description: "Water pipeline burst behind canteen",
    departmentId: "dept-plumber",
    status: "pending",
    location: { lat: 28.6180, lng: 77.2130 },
    images: [],
    createdAt: new Date()
  },

  {
    _id: "cmp7",
    userId: "user7",
    type: "campus",
    area: "Parking",
    locationAddress: "Block C parking",
    description: "Cracks appearing in parking surface",
    departmentId: "dept-civil",
    status: "pending",
    location: { lat: 28.6190, lng: 77.2140 },
    images: [],
    createdAt: new Date()
  },

  {
    _id: "cmp8",
    userId: "user8",
    type: "hostel",
    visibility: "public",
    hostelName: "D",
    floor: "3",
    landmark: "Near lift",
    description: "AC not cooling properly in corridor",
    departmentId: "dept-electrician",
    status: "pending",
    location: { lat: 28.6200, lng: 77.2150 },
    images: [],
    createdAt: new Date()
  }

];