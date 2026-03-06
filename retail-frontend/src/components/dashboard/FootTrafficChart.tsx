import { useEffect, useState } from "react";
import { getTraffic } from "@/services/api";

import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const FootTrafficChart = ({ sessionId }: { sessionId: string }) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchTraffic() {
      try {
        const res = await getTraffic(sessionId);
        setData(res.data);
      } catch (err) {
        console.error("Traffic error:", err);
      }
    }

    fetchTraffic();
    const interval = setInterval(fetchTraffic, 10000); // every 10 sec

    return () => clearInterval(interval); // cleanup
  }, [sessionId]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.45 }}
      className="glass-card p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Foot Traffic</h3>
        <p className="text-sm text-muted-foreground">
          Hourly visitor count today
        </p>
      </div>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 25%, 16%)" />
            <XAxis
              dataKey="hour"
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
            <Line
              type="monotone"
              dataKey="count"
              stroke="hsl(182, 70%, 50%)"
              strokeWidth={2.5}
              dot={{ fill: "hsl(182, 70%, 50%)", r: 3 }}
              activeDot={{
                r: 5,
                fill: "hsl(182, 70%, 50%)",
                stroke: "hsl(222, 44%, 9%)",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default FootTrafficChart;
