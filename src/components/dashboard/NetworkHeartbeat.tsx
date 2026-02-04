import { motion } from 'framer-motion';
import { Blocks, Clock, Shield, Fuel } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NetworkStats } from '@/hooks/useBesuNetwork';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

interface NetworkHeartbeatProps {
  stats: NetworkStats;
}

// Generate sparkline data
const generateSparkline = () => {
  return Array.from({ length: 20 }, () => ({
    value: 1.8 + Math.random() * 0.4,
  }));
};

export const NetworkHeartbeat = ({ stats }: NetworkHeartbeatProps) => {
  const [glowKey, setGlowKey] = useState(0);
  const [sparklineData, setSparklineData] = useState(generateSparkline);
  const [prevBlock, setPrevBlock] = useState(stats.currentBlock);

  useEffect(() => {
    if (stats.currentBlock !== prevBlock) {
      setGlowKey(prev => prev + 1);
      setPrevBlock(stats.currentBlock);
      setSparklineData(prev => [...prev.slice(1), { value: stats.avgBlockTime }]);
    }
  }, [stats.currentBlock, stats.avgBlockTime, prevBlock]);

  const cards = [
    {
      id: 'block',
      title: 'Current Block',
      value: stats.currentBlock.toLocaleString(),
      icon: Blocks,
      accent: 'primary',
      hasGlow: true,
    },
    {
      id: 'blocktime',
      title: 'Avg Block Time',
      value: `${stats.avgBlockTime.toFixed(1)}s`,
      icon: Clock,
      accent: 'accent',
      hasSparkline: true,
    },
    {
      id: 'validators',
      title: 'Active Validators',
      value: `${stats.activeValidators}/${stats.totalValidators}`,
      icon: Shield,
      accent: 'accent',
      hasPulse: true,
    },
    {
      id: 'gas',
      title: 'Gas Price',
      value: `${stats.gasPrice} Gwei`,
      icon: Fuel,
      accent: 'muted',
      subtitle: 'Free Gas Network',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={`${card.id}-${glowKey}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`glass-card p-5 ${card.hasGlow && card.id === 'block' ? 'block-counter-glow' : ''}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  card.accent === 'primary'
                    ? 'bg-primary/20 text-primary'
                    : card.accent === 'accent'
                    ? 'bg-accent/20 text-accent'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              {card.hasPulse && (
                <div className="w-2.5 h-2.5 rounded-full bg-accent pulse-live emerald-glow" />
              )}
            </div>

            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              {card.title}
            </p>

            <div className="flex items-end justify-between">
              <p
                className={`text-2xl font-semibold ${
                  card.id === 'block' ? 'font-mono text-primary' : ''
                } ${card.accent === 'accent' ? 'text-accent' : ''}`}
              >
                {card.value}
              </p>

              {card.hasSparkline && (
                <div className="w-16 h-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sparklineData}>
                      <defs>
                        <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(var(--accent))"
                        strokeWidth={1.5}
                        fill="url(#sparklineGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {card.subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};