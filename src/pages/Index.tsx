import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBesuNetwork } from '@/hooks/useBesuNetwork';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { NetworkHeartbeat } from '@/components/dashboard/NetworkHeartbeat';
import { NodeInfrastructure } from '@/components/dashboard/NodeInfrastructure';
import { NetworkTraffic } from '@/components/dashboard/NetworkTraffic';
import { RecentEvents } from '@/components/dashboard/RecentEvents';
import { QuickPermissioning } from '@/components/dashboard/QuickPermissioning';

const Index = () => {
  const [activeNav, setActiveNav] = useState('home');
  const { stats, nodes, transactions, tpsHistory, isLive } = useBesuNetwork();

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar activeItem={activeNav} onItemClick={setActiveNav} />

      {/* Main Content */}
      <main className="ml-16 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <Header isLive={isLive} />

          {/* Bento Grid Layout */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 gap-6"
          >
            {/* Row 1: Network Heartbeat - 4 Cards */}
            <NetworkHeartbeat stats={stats} />

            {/* Row 2: Node Infrastructure + Network Traffic */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <NodeInfrastructure nodes={nodes} />
              <NetworkTraffic tpsHistory={tpsHistory} />
            </div>

            {/* Row 3: Recent Events + Quick Permissioning */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RecentEvents transactions={transactions} />
              </div>
              <QuickPermissioning whitelistedAccounts={stats.whitelistedAccounts} />
            </div>
          </motion.div>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 pt-6 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground"
          >
            <p>© 2024 Besu Network Management Dashboard</p>
            <div className="flex items-center gap-4">
              <span>Besu v24.1.0</span>
              <span>•</span>
              <span>Consensus: IBFT 2.0</span>
              <span>•</span>
              <span className="text-accent">All systems operational</span>
            </div>
          </motion.footer>
        </div>
      </main>
    </div>
  );
};

export default Index;