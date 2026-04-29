import api from "./axios";

export const getDepartments = async () => {
  const res = await api.get("/departments");
  return res.data?.data || [];
};

