import { useEffect, useState } from "react";
import { getRecentDetections } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";
import { ScanFace } from "lucide-react";

const emotionColors: Record<string, string> = {
  Happy: "text-success bg-success/10",
  Neutral: "text-muted-foreground bg-muted",
  Surprised: "text-warning bg-warning/10",
  Sad: "text-accent bg-accent/10",
  Angry: "text-destructive bg-destructive/10",
};

const DetectionFeed = ({ sessionId }: { sessionId: string }) => {
  const [recentDetections, setRecentDetections] = useState<any[]>([]);
  useEffect(() => {
    async function fetchDetections() {
      try {
        const res = await getRecentDetections(sessionId);
        setRecentDetections(res.data);
      } catch (err) {
        console.error("Detection feed error:", err);
      }
    }

    fetchDetections();

    const interval = setInterval(fetchDetections, 5000);

    return () => clearInterval(interval);
  }, [sessionId]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Live Detection Feed
          </h3>
          <p className="text-sm text-muted-foreground">
            Latest face detections from SQLite log
          </p>
        </div>
        <ScanFace className="w-5 h-5 text-primary" />
      </div>
      <div className="space-y-3">
        <AnimatePresence>
          {recentDetections?.map((d) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between py-3 px-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-muted-foreground w-16">
                  {d.timestamp}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {d.age}
                </span>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-md ${emotionColors[d.emotion] || "text-foreground bg-muted"}`}
                >
                  {d.emotion}
                </span>
              </div>
              <div className="flex items-center gap-4">
                {/* Zone */}
                <span className="text-xs text-muted-foreground font-medium">
                  {d.zone || "Unknown Zone"}
                </span>

                {/* Confidence */}
                <span
                  className={`text-xs font-mono px-2 py-0.5 rounded-md ${
                    d.confidence >= 90
                      ? "bg-success/10 text-success"
                      : d.confidence >= 75
                        ? "bg-warning/10 text-warning"
                        : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {d.confidence != null
                    ? `${Number(d.confidence).toFixed(2)}%`
                    : "--"}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default DetectionFeed;
