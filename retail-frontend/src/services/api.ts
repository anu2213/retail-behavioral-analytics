import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

export const getSummary = (sessionId?: string) =>
  API.get("/summary", { params: sessionId ? { session_id: sessionId } : {} });

export const getAgeDistribution = (sessionId?: string) =>
  API.get("/age-distribution", {
    params: sessionId ? { session_id: sessionId } : {},
  });

export const getEmotionDistribution = (sessionId?: string) =>
  API.get("/emotion-distribution", {
    params: sessionId ? { session_id: sessionId } : {},
  });

export const getTraffic = (sessionId?: string) =>
  API.get("/traffic", { params: sessionId ? { session_id: sessionId } : {} });

export const getRecentDetections = (sessionId?: string) =>
  API.get("/recent-detections", {
    params: sessionId ? { session_id: sessionId } : {},
  });

export const getInsights = (sessionId?: string) =>
  API.get("/insights", { params: sessionId ? { session_id: sessionId } : {} });

export const getAiSalesAdvice = (sessionId?: string) =>
  API.get("/ai-sales-advice", {
    params: sessionId ? { session_id: sessionId } : {},
  });
export const getSessions = () => API.get("/sessions");

export const getLatestSession = () => API.get("/latest-session");
