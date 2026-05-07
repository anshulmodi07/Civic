import Department from "../models/department.js";

export const getDepartments = async (_req, res) => {
  const departments = await Department.find().sort({ name: 1 });
  res.json({ success: true, data: departments });
};
