module.exports = [
  {
    name: "Test Citizen",
    email: "citizen@test.com",
    role: "citizen"
  },

  /* Department Admins */

  {
    name: "Water Admin",
    email: "water.admin@test.com",
    role: "admin",
    department: "water"
  },
  {
    name: "Electricity Admin",
    email: "electric.admin@test.com",
    role: "admin",
    department: "electricity"
  },
  {
    name: "Road Admin",
    email: "road.admin@test.com",
    role: "admin",
    department: "road"
  },
  {
    name: "Sanitation Admin",
    email: "sanitation.admin@test.com",
    role: "admin",
    department: "sanitation"
  },

  /* Workers */

  {
    name: "Water Worker",
    email: "water.worker@test.com",
    role: "worker",
    department: "water",
    skills: ["water"],
    availabilityStatus: "available",
  },
  {
    name: "Electricity Worker",
    email: "electric.worker@test.com",
    role: "worker",
    department: "electricity",
    skills: ["electricity"],
    availabilityStatus: "available",
  },
  {
    name: "Road Worker",
    email: "road.worker@test.com",
    role: "worker",
    department: "road",
    skills: ["road"],
    availabilityStatus: "available",
  },
  {
    name: "Garbage Worker",
    email: "garbage.worker@test.com",
    role: "worker",
    department: "sanitation",
    skills: ["garbage"],
    availabilityStatus: "available",
  },
];