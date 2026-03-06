import { useEffect, useState } from "react";
import AgeDistributionChart from "@/components/dashboard/AgeDistributionChart";
import EmotionTrendChart from "@/components/dashboard/EmotionTrendChart";
import FootTrafficChart from "@/components/dashboard/FootTrafficChart";
import DetectionFeed from "@/components/dashboard/DetectionFeed";
import InsightsPanel from "@/components/dashboard/InsightsPanel";
import { AiInsights } from "@/components/dashboard/AiInsights";
import { useSearchParams } from "react-router-dom";
import { API_URL } from "@/config";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import jsPDF from "jspdf";

interface Session {
  id: string;
  name: string;
  created_at: string;
  source: string;
  total_events: number;
}

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const urlSessionId = searchParams.get("session_id");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(
    urlSessionId,
  );

  useEffect(() => {
    const fetchSessions = () => {
      fetch(`${API_URL}/sessions`)
        .then((res) => res.json())
        .then((data) => {
          setSessions(data);
          if (!urlSessionId && data.length > 0) {
            setSelectedSession(data[0].id);
          }
        })
        .catch((err) => console.error("Failed to fetch sessions:", err));
    };

    fetchSessions(); // fetch immediately

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchSessions, 30000);
    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">RetailVision AI Dashboard</h1>

        <div className="flex items-center gap-3">
          <Link to="/">
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              New Analysis
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={async () => {
              const res = await fetch(
                `${API_URL}/export-report/${selectedSession}`,
              );
              const data = await res.json();

              const doc = new jsPDF();

              // Header
              doc.setFillColor(10, 15, 30);
              doc.rect(0, 0, 210, 40, "F");
              doc.setTextColor(0, 220, 180);
              doc.setFontSize(20);
              doc.setFont("helvetica", "bold");
              doc.text("RetailVision AI", 14, 18);
              doc.setFontSize(11);
              doc.setTextColor(180, 180, 180);
              doc.text("Analytics Report", 14, 28);
              doc.text(`Session: ${data.session_id}`, 14, 35);

              // Summary Section
              doc.setTextColor(0, 0, 0);
              doc.setFontSize(14);
              doc.setFont("helvetica", "bold");
              doc.text("Summary", 14, 55);

              doc.setFontSize(11);
              doc.setFont("helvetica", "normal");
              doc.text(`Total Events: ${data.total_events}`, 14, 65);
              doc.text(
                `Dominant Age Group: ${data.dominant_age_group}`,
                14,
                73,
              );
              doc.text(`Dominant Emotion: ${data.dominant_emotion}`, 14, 81);
              doc.text(`Most Active Zone: ${data.most_active_zone}`, 14, 89);

              // Age Distribution
              doc.setFontSize(14);
              doc.setFont("helvetica", "bold");
              doc.text("Age Distribution", 14, 105);
              doc.setFontSize(11);
              doc.setFont("helvetica", "normal");
              let y = 115;
              Object.entries(data.age_distribution).forEach(([age, count]) => {
                doc.text(`${age}: ${count} visitors`, 14, y);
                y += 8;
              });

              // Emotion Distribution
              y += 5;
              doc.setFontSize(14);
              doc.setFont("helvetica", "bold");
              doc.text("Emotion Distribution", 14, y);
              y += 10;
              doc.setFontSize(11);
              doc.setFont("helvetica", "normal");
              Object.entries(data.emotion_distribution).forEach(
                ([emotion, count]) => {
                  doc.text(`${emotion}: ${count} detections`, 14, y);
                  y += 8;
                },
              );

              // Zone Distribution
              y += 5;
              doc.setFontSize(14);
              doc.setFont("helvetica", "bold");
              doc.text("Zone Distribution", 14, y);
              y += 10;
              doc.setFontSize(11);
              doc.setFont("helvetica", "normal");
              Object.entries(data.zone_distribution).forEach(
                ([zone, count]) => {
                  doc.text(`${zone}: ${count} visitors`, 14, y);
                  y += 8;
                },
              );

              // Footer
              doc.setFontSize(9);
              doc.setTextColor(150, 150, 150);
              doc.text(
                `Generated by RetailVision AI — ${new Date().toLocaleString()}`,
                14,
                285,
              );

              doc.save(`RetailVision_Report_${data.session_id}.pdf`);
            }}
          >
            <Download className="w-4 h-4" />
            Export Report
          </Button>

          {/* Session Selector */}
          {sessions.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Session:</span>
              <select
                className="text-sm bg-card border border-border rounded-lg px-3 py-2 text-foreground"
                value={selectedSession || ""}
                onChange={(e) => setSelectedSession(e.target.value)}
              >
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.created_at} — {s.source} ({s.total_events} events)
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {selectedSession ? (
        <>
          <FootTrafficChart sessionId={selectedSession} />

          <div className="grid grid-cols-2 gap-6">
            <AgeDistributionChart sessionId={selectedSession} />
            <EmotionTrendChart sessionId={selectedSession} />
          </div>

          <DetectionFeed sessionId={selectedSession} />
          <InsightsPanel sessionId={selectedSession} />
          <AiInsights sessionId={selectedSession} />
        </>
      ) : (
        <div className="text-center text-muted-foreground py-20">
          <p className="text-lg">No sessions found.</p>
          <p className="text-sm mt-2">
            Upload a video or start the live camera to begin analysis.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
