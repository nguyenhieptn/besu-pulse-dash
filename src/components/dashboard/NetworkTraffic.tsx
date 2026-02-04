import { motion } from 'framer-motion';
import { Activity, TrendingUp } from 'lucide-react';
import { TPSDataPoint } from '@/hooks/useBesuNetwork';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';

interface NetworkTrafficProps {
  tpsHistory: TPSDataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 border border-border">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="text-sm font-semibold text-primary">
          {payload[0].value} TPS
        </p>
      </div>
    );
  }
  return null;
};

export const NetworkTraffic = ({ tpsHistory }: NetworkTrafficProps) => {
  const currentTPS = tpsHistory[tpsHistory.length - 1]?.tps || 0;
  const avgTPS = Math.round(
    tpsHistory.reduce((sum, d) => sum + d.tps, 0) / tpsHistory.length
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card p-6 h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Network Traffic</h3>
            <p className="text-xs text-muted-foreground">TPS over last 30 minutes</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Current</p>
            <p className="text-lg font-semibold text-primary font-mono">{currentTPS}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Average</p>
            <p className="text-lg font-semibold text-accent font-mono">{avgTPS}</p>
          </div>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={tpsHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tpsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              interval="preserveStartEnd"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              domain={[0, 300]}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={250}
              stroke="hsl(var(--accent))"
              strokeDasharray="5 5"
              label={{
                value: 'Peak Capacity',
                position: 'right',
                fill: 'hsl(var(--accent))',
                fontSize: 10,
              }}
            />
            <Area
              type="monotone"
              dataKey="tps"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#tpsGradient)"
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
        <TrendingUp className="w-3 h-3 text-accent" />
        <span>Network performing at optimal capacity</span>
      </div>
    </motion.div>
  );
};