import { motion } from 'framer-motion';
import { Users, UserCheck, UserX, ShieldCheck, Key, Fuel } from 'lucide-react';
import { AccountsOverview as OverviewData } from '@/hooks/useAccountsData';

interface AccountsOverviewProps {
  overview: OverviewData;
}

export const AccountsOverview = ({ overview }: AccountsOverviewProps) => {
  const badges = [
    {
      id: 'total',
      label: 'Total Accounts',
      value: overview.total,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/20',
    },
    {
      id: 'allowed',
      label: 'Allowed',
      value: overview.allowed,
      icon: UserCheck,
      color: 'text-accent',
      bgColor: 'bg-accent/20',
    },
    {
      id: 'blocked',
      label: 'Blocked',
      value: overview.blocked,
      icon: UserX,
      color: 'text-destructive',
      bgColor: 'bg-destructive/20',
    },
    {
      id: 'admin',
      label: 'Admin Accounts',
      value: overview.admin,
      icon: ShieldCheck,
      color: 'text-primary',
      bgColor: 'bg-primary/20',
    },
    {
      id: 'apiEnabled',
      label: 'API Enabled',
      value: overview.apiEnabled,
      icon: Key,
      color: 'text-accent',
      bgColor: 'bg-accent/20',
    },
    {
      id: 'lowGas',
      label: 'Low Gas',
      value: overview.lowGas,
      icon: Fuel,
      color: 'text-warning',
      bgColor: 'bg-warning/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {badges.map((badge, index) => {
        const Icon = badge.icon;
        return (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card px-4 py-3 flex items-center gap-3"
          >
            <div className={`w-9 h-9 rounded-lg ${badge.bgColor} flex items-center justify-center`}>
              <Icon className={`w-4 h-4 ${badge.color}`} />
            </div>
            <div>
              <p className="text-xl font-semibold font-mono text-foreground">{badge.value}</p>
              <p className="text-xs text-muted-foreground">{badge.label}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
