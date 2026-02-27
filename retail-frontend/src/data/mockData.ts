export const emotionData = [
  { time: "09:00", happy: 42, neutral: 30, surprised: 12, sad: 8, angry: 5, fear: 3 },
  { time: "10:00", happy: 55, neutral: 25, surprised: 8, sad: 6, angry: 4, fear: 2 },
  { time: "11:00", happy: 48, neutral: 28, surprised: 15, sad: 5, angry: 3, fear: 1 },
  { time: "12:00", happy: 60, neutral: 22, surprised: 10, sad: 4, angry: 2, fear: 2 },
  { time: "13:00", happy: 52, neutral: 26, surprised: 11, sad: 6, angry: 3, fear: 2 },
  { time: "14:00", happy: 45, neutral: 32, surprised: 9, sad: 7, angry: 5, fear: 2 },
  { time: "15:00", happy: 58, neutral: 24, surprised: 10, sad: 4, angry: 2, fear: 2 },
  { time: "16:00", happy: 50, neutral: 27, surprised: 13, sad: 5, angry: 3, fear: 2 },
  { time: "17:00", happy: 38, neutral: 35, surprised: 8, sad: 10, angry: 6, fear: 3 },
  { time: "18:00", happy: 35, neutral: 38, surprised: 7, sad: 11, angry: 7, fear: 2 },
];

export const ageDistribution = [
  { group: "0-12", count: 85, percentage: 8 },
  { group: "13-17", count: 124, percentage: 12 },
  { group: "18-25", count: 287, percentage: 27 },
  { group: "26-35", count: 312, percentage: 29 },
  { group: "36-50", count: 168, percentage: 16 },
  { group: "51-65", count: 62, percentage: 6 },
  { group: "65+", count: 22, percentage: 2 },
];

export const footTrafficData = [
  { hour: "08", visitors: 23 },
  { hour: "09", visitors: 67 },
  { hour: "10", visitors: 112 },
  { hour: "11", visitors: 145 },
  { hour: "12", visitors: 189 },
  { hour: "13", visitors: 176 },
  { hour: "14", visitors: 198 },
  { hour: "15", visitors: 167 },
  { hour: "16", visitors: 143 },
  { hour: "17", visitors: 120 },
  { hour: "18", visitors: 89 },
  { hour: "19", visitors: 45 },
];

export const recentDetections = [
  { id: 1, timestamp: "18:42:15", age: "26-35", emotion: "Happy", confidence: 94, zone: "Entrance" },
  { id: 2, timestamp: "18:42:08", age: "18-25", emotion: "Neutral", confidence: 87, zone: "Aisle 3" },
  { id: 3, timestamp: "18:41:55", age: "36-50", emotion: "Surprised", confidence: 91, zone: "Checkout" },
  { id: 4, timestamp: "18:41:42", age: "13-17", emotion: "Happy", confidence: 82, zone: "Electronics" },
  { id: 5, timestamp: "18:41:30", age: "26-35", emotion: "Neutral", confidence: 89, zone: "Aisle 1" },
  { id: 6, timestamp: "18:41:18", age: "51-65", emotion: "Happy", confidence: 76, zone: "Pharmacy" },
];

export const insights = [
  {
    title: "Peak Happiness at Noon",
    description: "Customer satisfaction peaks between 12:00-13:00, correlating with lunch promotions. Consider extending promotional hours.",
    type: "positive" as const,
    metric: "+18%",
  },
  {
    title: "Young Adults Dominate Traffic",
    description: "18-35 age group represents 56% of visitors. Tailor product placement and marketing to this demographic.",
    type: "info" as const,
    metric: "56%",
  },
  {
    title: "Evening Mood Decline",
    description: "Negative emotions increase 40% after 17:00. Consider ambient improvements — lighting, music, staffing.",
    type: "warning" as const,
    metric: "+40%",
  },
  {
    title: "Checkout Zone Stress",
    description: "Surprise and frustration spike at checkout counters. Queue optimization recommended.",
    type: "negative" as const,
    metric: "3.2x",
  },
];

export const kpiData = {
  totalVisitors: 1060,
  avgDwellTime: "8.4 min",
  dominantEmotion: "Happy",
  dominantAge: "26-35",
  detectionRate: "97.3%",
  activeCameras: 12,
};
