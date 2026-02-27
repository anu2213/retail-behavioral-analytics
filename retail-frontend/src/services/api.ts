import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

export const getSummary = () => API.get("/summary");
export const getAgeDistribution = () => API.get("/age-distribution");
export const getEmotionDistribution = () => API.get("/emotion-distribution");
export const getTraffic = () => API.get("/traffic");
export const getRecentDetections = () => API.get("/recent-detections");
export const getInsights = () => API.get("/insights");
