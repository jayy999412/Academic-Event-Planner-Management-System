import api from "./api";

const dashboardService = {
  getDashboard: () => api.get("/dashboard/admin"),
};

export default dashboardService;
