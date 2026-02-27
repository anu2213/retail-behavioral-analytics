import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  delay?: number;
}

const KpiCard = ({ title, value, subtitle, icon: Icon, trend, delay = 0 }: KpiCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card p-5 stat-glow group hover:border-primary/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:glow-primary transition-all">
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className={`text-xs font-mono font-medium px-2 py-1 rounded-md ${
            trend.positive 
              ? "bg-success/10 text-success" 
              : "bg-destructive/10 text-destructive"
          }`}>
            {trend.positive ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1 font-mono">{subtitle}</p>}
    </motion.div>
  );
};

export default KpiCard;
