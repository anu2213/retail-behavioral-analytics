import { Upload } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { API_URL } from "@/config";

import {
  Activity,
  Eye,
  Brain,
  BarChart3,
  Shield,
  Zap,
  ArrowRight,
  Users,
  Smile,
  Clock,
  ChevronRight,
  Star,
  CheckCircle2,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const features = [
  {
    icon: Eye,
    title: "Real-Time Face Detection",
    description:
      "OpenCV-powered detection pipeline processes 30+ FPS across multiple camera feeds simultaneously.",
  },
  {
    icon: Brain,
    title: "Emotion Analysis",
    description:
      "DeepFace integration classifies 7 emotion categories with 94%+ accuracy in varied lighting.",
  },
  {
    icon: Users,
    title: "Age Group Estimation",
    description:
      "Non-invasive demographic profiling estimates age brackets for targeted merchandising insights.",
  },
  {
    icon: BarChart3,
    title: "Business Intelligence",
    description:
      "Auto-generated actionable insights from behavioral patterns — peak hours, mood trends, zone analysis.",
  },
  {
    icon: Shield,
    title: "Privacy-First Architecture",
    description:
      "No facial data stored. All processing is ephemeral — only aggregated anonymous statistics are logged.",
  },
  {
    icon: Zap,
    title: "Edge Processing",
    description:
      "Optimized for on-premise deployment. SQLite logging with minimal latency and zero cloud dependency.",
  },
];

const stats = [
  { value: "97.3%", label: "Detection Accuracy", icon: Eye },
  { value: "30+", label: "FPS Processing", icon: Zap },
  { value: "7", label: "Emotion Categories", icon: Smile },
  { value: "<50ms", label: "Inference Latency", icon: Clock },
];

const testimonials = [
  {
    quote:
      "RetailVision transformed how we understand foot traffic. We optimized staffing and saw a 23% increase in customer satisfaction scores.",
    author: "Sarah Chen",
    role: "VP Operations, Metro Retail Group",
    rating: 5,
  },
  {
    quote:
      "The emotion trend data revealed checkout frustration we never noticed. After queue redesign, complaints dropped 40%.",
    author: "Marcus Alvarez",
    role: "Store Director, Urban Goods Co.",
    rating: 5,
  },
  {
    quote:
      "Privacy-first approach made compliance simple. We deployed across 12 stores in under a week with zero data concerns.",
    author: "Priya Sharma",
    role: "CTO, NextGen Stores",
    rating: 5,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/30 backdrop-blur-2xl bg-background/60">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 glow-primary">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-bold text-foreground tracking-tight">
              RetailVision AI
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Testimonials
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="sm" className="glow-primary">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial="hidden"
              animate="visible"
              custom={3}
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/dashboard">
                <Button size="lg" className="glow-primary text-base px-8 h-12">
                  View Live Dashboard <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>

              <AnalysisOptions />
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="visible"
              custom={1}
              variants={fadeUp}
              className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]"
            >
              Understand Your Customers
              <br />
              <span className="gradient-text">Before They Speak</span>
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="visible"
              custom={2}
              variants={fadeUp}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              AI-powered behavioral analytics that estimates age groups, tracks
              emotional trends, and generates real-time business intelligence —
              all with zero stored facial data.
            </motion.p>

            {/* Stats bar */}
            <motion.div
              initial="hidden"
              animate="visible"
              custom={4}
              variants={fadeUp}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-3xl mx-auto"
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="glass-card p-4 text-center stat-glow"
                >
                  <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold font-mono text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 border-t border-border/20">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={0}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4 font-mono text-xs">
              Core Capabilities
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Everything You Need to
              <br />
              <span className="gradient-text">Decode Customer Behavior</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                custom={i}
                variants={fadeUp}
              >
                <Card className="glass-card border-border/30 hover:border-primary/30 transition-all duration-500 group h-full">
                  <CardContent className="p-6 space-y-4">
                    <div className="p-3 rounded-xl bg-primary/10 w-fit group-hover:glow-primary transition-shadow duration-500">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-24 border-t border-border/20 relative"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[120px]" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={0}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4 font-mono text-xs">
              Pipeline
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              From Camera Feed to
              <br />
              <span className="gradient-text">Actionable Insight</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Capture",
                desc: "Multi-camera RTSP feeds ingested in parallel",
              },
              {
                step: "02",
                title: "Detect",
                desc: "OpenCV cascades isolate faces at 30+ FPS",
              },
              {
                step: "03",
                title: "Analyze",
                desc: "DeepFace classifies age & emotion per frame",
              },
              {
                step: "04",
                title: "Insight",
                desc: "SQLite logs feed real-time dashboard analytics",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                custom={i}
                variants={fadeUp}
                className="text-center relative"
              >
                <div className="text-5xl font-black font-mono text-primary/15 mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
                {i < 3 && (
                  <ChevronRight className="hidden md:block absolute top-8 -right-4 w-6 h-6 text-primary/30" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 border-t border-border/20">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={0}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4 font-mono text-xs">
              Trusted By Leaders
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Real Results from
              <br />
              <span className="gradient-text">Real Retailers</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.author}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                custom={i}
                variants={fadeUp}
              >
                <Card className="glass-card border-border/30 h-full">
                  <CardContent className="p-6 flex flex-col justify-between h-full space-y-6">
                    <div className="space-y-4">
                      <div className="flex gap-1">
                        {Array.from({ length: t.rating }).map((_, j) => (
                          <Star
                            key={j}
                            className="w-4 h-4 fill-warning text-warning"
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed italic">
                        "{t.quote}"
                      </p>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        {t.author}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {t.role}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-border/20 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-primary/8 blur-[120px]" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={0}
            variants={fadeUp}
            className="max-w-3xl mx-auto text-center space-y-8"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Ready to See What Your
              <br />
              <span className="gradient-text">Cameras Are Missing?</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Deploy RetailVision AI in your store today. On-premise,
              privacy-first, and generating insights within minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="glow-primary text-base px-8 h-12">
                  Launch Dashboard <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 h-12 border-border/60"
              >
                Schedule a Demo
              </Button>
            </div>
            <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground pt-4">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" /> No cloud
                dependency
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" /> Privacy
                compliant
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" /> Deploy in
                minutes
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              RetailVision AI
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            Powered by OpenCV · DeepFace · SQLite · Real-time Processing
            Pipeline
          </p>
        </div>
      </footer>
    </div>
  );
};
export default Index;

function AnalysisOptions() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [cameraStatus, setCameraStatus] = useState<"idle" | "running">("idle");
  const navigate = useNavigate();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File type validation
    const validTypes = [
      "video/mp4",
      "video/avi",
      "video/mov",
      "video/mkv",
      "video/webm",
    ];
    if (!validTypes.includes(file.type)) {
      setProgress(
        "Invalid file type. Please upload a video file (mp4, avi, mov, mkv).",
      );
      return;
    }

    // File size validation (500MB max)
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      setProgress("File too large. Maximum size is 500MB.");
      return;
    }

    setUploading(true);
    setShowOptions(false);
    setProgress("Uploading video...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/upload-video`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      console.log("Upload response:", data);
      navigate(
        `/processing?session_id=${data.session_id}&video_path=${encodeURIComponent(data.video_path)}`,
      );
    } catch {
      setProgress("Upload failed. Please try again.");
      setUploading(false);
    }
  };

  const handleStartCamera = async () => {
    setShowOptions(false);
    try {
      const res = await fetch(`${API_URL}/start-camera`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to start camera");
      const data = await res.json();
      setCameraStatus("running");
      setProgress("Live camera started! Redirecting...");
      setTimeout(
        () => navigate(`/dashboard?session_id=${data.session_id}`),
        1500,
      );
    } catch {
      setProgress("Failed to start camera. Is your backend running?");
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <Button
        size="lg"
        variant="outline"
        className="text-base px-8 h-12 border-border/60"
        onClick={() => setShowOptions(!showOptions)}
        disabled={uploading}
      >
        <Zap className="w-5 h-5" />
        {uploading ? "Processing..." : "Start Analysis"}
      </Button>

      {/* Options dropdown */}
      {showOptions && (
        <div className="flex flex-col sm:flex-row gap-3 mt-1 p-4 rounded-xl border border-border/50 bg-background/80 backdrop-blur">
          <Button
            variant="outline"
            className="flex flex-col h-auto py-4 px-6 gap-2 border-primary/30 hover:border-primary"
            onClick={handleStartCamera}
          >
            <Activity className="w-6 h-6 text-primary" />
            <span className="text-sm font-semibold">Live Camera</span>
            <span className="text-xs text-muted-foreground">
              Real-time analysis
            </span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col h-auto py-4 px-6 gap-2 border-primary/30 hover:border-primary"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-6 h-6 text-primary" />
            <span className="text-sm font-semibold">Upload Video</span>
            <span className="text-xs text-muted-foreground">
              Analyze recorded footage
            </span>
          </Button>
        </div>
      )}

      {progress && (
        <p className="text-xs text-muted-foreground animate-pulse">
          {progress}
        </p>
      )}
    </div>
  );
}
