const locations = [
  { lat: 28.7501, lng: 77.1177 }, // cluster 1
  { lat: 28.7502, lng: 77.1178 },
  { lat: 28.7503, lng: 77.1176 },

  { lat: 28.7520, lng: 77.1200 }, // cluster 2
  { lat: 28.7521, lng: 77.1201 },
];

module.exports = (citizenId) => [
  {
    citizenId,
    description: "Water leaking near hostel gate",
    issueType: "water",
    priority: "high",
    location: locations[0],
    status: "new",
  },
  {
    citizenId,
    description: "Streetlight not working",
    issueType: "electricity",
    priority: "medium",
    location: locations[1],
    status: "new",
  },
  {
    citizenId,
    description: "Potholes after rain",
    issueType: "road",
    priority: "high",
    location: locations[2],
    status: "new",
  },
  {
    citizenId,
    description: "Garbage overflow near canteen",
    issueType: "garbage",
    priority: "medium",
    location: locations[3],
    status: "new",
  },
];
