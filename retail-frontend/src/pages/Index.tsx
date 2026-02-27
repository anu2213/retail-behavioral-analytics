import { useEffect, useState } from "react";
import {
  getSummary,
  getAgeDistribution,
  getEmotionDistribution,
  getTraffic,
} from "@/services/api";

import { motion } from "framer-motion";
import { Users, Clock, Smile, Camera, Activity, UserCheck } from "lucide-react";
import KpiCard from "@/components/dashboard/KpiCard";
import EmotionTrendChart from "@/components/dashboard/EmotionTrendChart";
import AgeDistributionChart from "@/components/dashboard/AgeDistributionChart";
import DetectionFeed from "@/components/dashboard/DetectionFeed";
import InsightsPanel from "@/components/dashboard/InsightsPanel";
import FootTrafficChart from "@/components/dashboard/FootTrafficChart";

const Index = () => {
  const [summary, setSummary] = useState<any>(null);
  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await getSummary();
        setSummary(res.data);
      } catch (err) {
        console.error("Backend error:", err);
      }
    }

    fetchSummary();
  }, []);
  if (!summary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground font-mono">
            Initializing AI analytics engine...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-xl sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 glow-primary">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">
                RetailVision AI
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                Behavioral Analytics Dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              12 cameras active
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-secondary text-xs text-secondary-foreground font-medium">
              Store #042 — Downtown
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {summary && (
            <>
              <KpiCard
                title="Total Visitors"
                value={summary.total_events?.toString() || "0"}
                icon={Users}
                delay={0}
              />

              <KpiCard
                title="Top Emotion"
                value={summary.dominant_emotion || "-"}
                icon={Smile}
                delay={0.05}
              />

              <KpiCard
                title="Top Age Group"
                value={summary.most_common_age_group || "-"}
                icon={UserCheck}
                delay={0.1}
              />

              <KpiCard
                title="Peak Hour"
                value={summary.peak_hour || "-"}
                icon={Clock}
                delay={0.15}
              />
            </>
          )}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          <EmotionTrendChart />
          <AgeDistributionChart />
        </div>

        {/* Foot Traffic + Feed */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <FootTrafficChart />
          </div>
          <div className="lg:col-span-2">
            <DetectionFeed />
          </div>
        </div>

        {/* Insights */}
        <InsightsPanel />

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center py-6 border-t border-border/30"
        >
          <p className="text-xs text-muted-foreground font-mono">
            Powered by OpenCV · DeepFace · SQLite · Real-time Processing
            Pipeline
          </p>
        </motion.footer>
      </main>
    </div>
  );
};

export default Index;
