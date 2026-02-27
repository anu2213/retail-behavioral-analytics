import { useEffect, useState } from "react";
import { getInsights } from "@/services/api";
import { motion } from "framer-motion";
import { Lightbulb, TrendingUp, AlertTriangle, XCircle } from "lucide-react";

const typeConfig = {
  positive: {
    icon: TrendingUp,
    border: "border-success/30",
    text: "text-success",
    bg: "bg-success/10",
  },
  info: {
    icon: Lightbulb,
    border: "border-info/30",
    text: "text-info",
    bg: "bg-info/10",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-warning/30",
    text: "text-warning",
    bg: "bg-warning/10",
  },
  negative: {
    icon: XCircle,
    border: "border-destructive/30",
    text: "text-destructive",
    bg: "bg-destructive/10",
  },
};

const InsightsPanel = () => {
  const [insights, setInsights] = useState<any[]>([]);
  useEffect(() => {
    async function fetchInsights() {
      try {
        const res = await getInsights();
        setInsights(res.data);
      } catch (err) {
        console.error("Insights error:", err);
      }
    }

    fetchInsights();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="glass-card p-6"
    >
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-foreground">
          Business Intelligence
        </h3>
        <p className="text-sm text-muted-foreground">
          AI-generated insights from behavioral data
        </p>
      </div>
      <div className="space-y-4">
        {insights.map((insight, i) => {
          const config = typeConfig[insight.type];
          const Icon = config.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className={`p-4 rounded-lg border ${config.border} bg-card/40`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-md ${config.bg}`}>
                    <Icon className={`w-3.5 h-3.5 ${config.text}`} />
                  </div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {insight.title}
                  </h4>
                </div>
                <span className={`text-sm font-mono font-bold ${config.text}`}>
                  {insight.metric}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pl-9">
                {insight.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default InsightsPanel;
