import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Brain, CheckCircle2 } from "lucide-react";
import { API_URL } from "@/config";

const Processing = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");
  const videoPath = searchParams.get("video_path");
  const [complete, setComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Poll processing-status endpoint (not /sessions!)
    intervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/processing-status`);
        const data = await res.json();
        if (data.complete) {
          setComplete(true);
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      } catch (err) {
        console.error(err);
      }
    }, 3000);

    // Fallback after 2 minutes
    const fallback = setTimeout(() => {
      setComplete(true);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }, 120000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      clearTimeout(fallback);
    };
  }, []);

  const streamUrl = `${API_URL}/video-feed/${encodeURIComponent(videoPath || "")}?session_id=${sessionId}`;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Brain className="h-5 w-5 text-primary animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold">Processing Video...</h1>
        </div>

        {/* Live video feed */}
        <div className="rounded-xl overflow-hidden border border-border">
          {!complete ? (
            <img
              src={streamUrl}
              alt="Processing feed"
              className="w-full"
              onError={() => {
                setComplete(true);
                if (intervalRef.current) clearInterval(intervalRef.current);
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 gap-4 bg-card">
              <CheckCircle2 className="h-12 w-12 text-primary" />
              <p className="text-lg font-semibold">Processing Complete!</p>
            </div>
          )}
        </div>

        {complete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center"
          >
            <Button
              size="lg"
              className="glow-primary px-8"
              onClick={() => navigate(`/dashboard?session_id=${sessionId}`)}
            >
              View Dashboard →
            </Button>
          </motion.div>
        )}

        {!complete && (
          <p className="text-sm text-center text-muted-foreground animate-pulse">
            AI is analyzing faces, emotions and age groups in real time...
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default Processing;
