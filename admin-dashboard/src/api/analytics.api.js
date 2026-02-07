import api from "./axios";

export const getComplaintSummary = () => {
  return api.get("/analytics/complaint-summary");
};
