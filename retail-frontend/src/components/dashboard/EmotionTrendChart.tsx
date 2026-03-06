import { useEffect, useState } from "react";
import { getEmotionDistribution } from "@/services/api";

import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const EmotionTrendChart = ({ sessionId }: { sessionId: string }) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchEmotionData() {
      try {
        const res = await getEmotionDistribution(sessionId);
        setData(res.data);
      } catch (err) {
        console.error("Emotion trend error:", err);
      }
    }

    fetchEmotionData();
  }, [sessionId]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Emotional Trends
          </h3>
          <p className="text-sm text-muted-foreground">
            Real-time sentiment analysis via DeepFace
          </p>
        </div>
        <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-success/10 text-success text-xs font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          LIVE
        </div>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="happyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(182, 70%, 50%)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(182, 70%, 50%)"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="neutralGrad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(215, 20%, 55%)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(215, 20%, 55%)"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="sadGrad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(260, 60%, 58%)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(260, 60%, 58%)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 25%, 16%)" />
            <XAxis
              dataKey="hour"
              tickFormatter={(value) => `${value}:00`}
              stroke="hsl(215, 20%, 55%)"
              fontSize={12}
              fontFamily="JetBrains Mono"
            />
            <YAxis
              stroke="hsl(215, 20%, 55%)"
              fontSize={12}
              fontFamily="JetBrains Mono"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222, 44%, 9%)",
                border: "1px solid hsl(222, 25%, 16%)",
                borderRadius: "8px",
                fontFamily: "Inter",
                fontSize: "13px",
              }}
            />
            <Area
              type="monotone"
              dataKey="happy"
              stroke="hsl(182, 70%, 50%)"
              fill="url(#happyGrad)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="neutral"
              stroke="hsl(215, 20%, 55%)"
              fill="url(#neutralGrad)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="sad"
              stroke="hsl(260, 60%, 58%)"
              fill="url(#sadGrad)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-5 mt-4">
        {[
          { label: "Happy", color: "bg-primary" },
          { label: "Neutral", color: "bg-muted-foreground" },
          { label: "Sad", color: "bg-accent" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
            {item.label}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default EmotionTrendChart;
