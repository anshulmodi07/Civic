import api from "./axios";

export const getWorkers = () => {
  return api.get("/users/workers");
};
