import { Globe, Key, Zap, AlertTriangle, ShieldOff, Server } from 'lucide-react';
import type { RPCOverviewData } from '@/hooks/useRPCAccessData';

interface RPCOverviewProps {
  data: RPCOverviewData;
}

export function RPCOverview({ data }: RPCOverviewProps) {
  const badges = [
    { label: 'Total Endpoints', value: data.totalEndpoints, icon: Globe, color: 'text-blue-400' },
    { label: 'Active Endpoints', value: data.activeEndpoints, icon: Server, color: 'text-emerald-400' },
    { label: 'Active API Keys', value: data.activeAPIKeys, icon: Key, color: 'text-blue-400' },
    { label: 'Requests/sec', value: data.requestsPerSecond.toLocaleString(), icon: Zap, color: 'text-amber-400' },
    { label: 'Rate Limit Hits 24h', value: data.rateLimitHits24h.toLocaleString(), icon: AlertTriangle, color: 'text-amber-400' },
    { label: 'Blocked Clients', value: data.blockedClients, icon: ShieldOff, color: 'text-red-400' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {badges.map((badge) => (
        <div
          key={badge.label}
          className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-lg p-4 flex items-center gap-3"
        >
          <div className={`p-2 rounded-lg bg-slate-800/50 ${badge.color}`}>
            <badge.icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{badge.value}</p>
            <p className="text-xs text-muted-foreground">{badge.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
