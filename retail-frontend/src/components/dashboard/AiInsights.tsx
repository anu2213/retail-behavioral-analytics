import { Brain, Sparkles, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getAiSalesAdvice } from "@/services/api";

interface SalesAdvice {
  summary: Record<string, unknown>;
  ai_recommendations: string;
}

function parseRecommendations(text: string): string[] {
  return text
    .split(/\n+/)
    .filter((line) => /^\d+\./.test(line.trim()))
    .map((line) =>
      line
        .replace(/^\d+\.\s*\*{0,2}.*?\*{0,2}:\s*/, "")
        .replace(/\*\*/g, "")
        .trim(),
    );
}

export function AiInsights({ sessionId }: { sessionId: string }) {
  const [salesAdvice, setSalesAdvice] = useState<SalesAdvice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAiSalesAdvice(sessionId)
      .then((res) => {
        setSalesAdvice(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load AI sales advice.");
        setLoading(false);
      });
  }, [sessionId]);

  const recommendations = salesAdvice
    ? parseRecommendations(salesAdvice.ai_recommendations)
    : [];

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          AI Sales Recommendations
        </h3>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating recommendations...
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && !error && recommendations.length > 0 && (
        <div className="space-y-3">
          {recommendations.map((rec, i) => (
            <div
              key={i}
              className="flex gap-3 rounded-lg border border-border/50 bg-secondary/30 p-3 transition-all hover:border-primary/20 hover:bg-secondary/50"
            >
              <div className="mt-0.5 shrink-0">
                <Brain className="h-4 w-4 text-primary" />
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Recommendation {i + 1}
                </span>
                <p className="mt-0.5 text-sm leading-relaxed text-foreground/85">
                  {rec}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && recommendations.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No recommendations available.
        </p>
      )}
    </div>
  );
}
