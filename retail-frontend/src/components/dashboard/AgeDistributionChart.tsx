import { useEffect, useState } from "react";
import { getAgeDistribution } from "@/services/api";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const barColors = [
  "hsl(182, 70%, 50%)",
  "hsl(182, 70%, 45%)",
  "hsl(182, 70%, 55%)",
  "hsl(182, 70%, 60%)",
  "hsl(200, 80%, 55%)",
  "hsl(260, 60%, 58%)",
  "hsl(260, 60%, 48%)",
];

const AgeDistributionChart = () => {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    async function fetchAgeData() {
      try {
        const res = await getAgeDistribution();
        console.log(res.data);

        const transformed = Object.entries(res.data).map(([key, value]) => ({
          name: key,
          value: value,
        }));

        setData(transformed);
      } catch (err) {
        console.error("Age distribution error:", err);
      }
    }

    fetchAgeData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Age Distribution
        </h3>
        <p className="text-sm text-muted-foreground">
          OpenCV-powered age group estimation
        </p>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={32}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(222, 25%, 16%)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
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
              cursor={{ fill: "hsl(222, 25%, 16%, 0.3)" }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={barColors[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default AgeDistributionChart;
