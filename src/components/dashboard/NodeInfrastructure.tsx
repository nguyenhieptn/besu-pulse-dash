import { motion } from 'framer-motion';
import { Server, Cpu, MemoryStick, HardDrive } from 'lucide-react';
import { NodeData } from '@/hooks/useBesuNetwork';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface NodeInfrastructureProps {
  nodes: NodeData[];
}

const getProgressColor = (value: number): string => {
  if (value < 60) return 'bg-accent';
  if (value < 80) return 'bg-warning';
  return 'bg-destructive';
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Running':
      return 'bg-accent';
    case 'Syncing':
      return 'bg-warning';
    default:
      return 'bg-destructive';
  }
};

export const NodeInfrastructure = ({ nodes }: NodeInfrastructureProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-6 h-full"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <Server className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Node Infrastructure</h3>
          <p className="text-xs text-muted-foreground">Real-time node metrics</p>
        </div>
      </div>

      <div className="space-y-4">
        {nodes.map((node, index) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="p-4 rounded-lg bg-secondary/50 border border-border/50"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={cn('w-2 h-2 rounded-full', getStatusColor(node.status))} />
                <div>
                  <p className="font-medium text-sm">{node.name}</p>
                  <p className="text-xs text-muted-foreground">{node.role}</p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent font-medium">
                {node.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* CPU */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Cpu className="w-3 h-3" />
                  <span>CPU</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    className={cn('h-full rounded-full transition-all duration-500', getProgressColor(node.cpu))}
                    initial={{ width: 0 }}
                    animate={{ width: `${node.cpu}%` }}
                  />
                </div>
                <p className="text-xs font-mono text-muted-foreground">{node.cpu.toFixed(0)}%</p>
              </div>

              {/* RAM */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MemoryStick className="w-3 h-3" />
                  <span>RAM</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    className={cn('h-full rounded-full transition-all duration-500', getProgressColor(node.ram))}
                    initial={{ width: 0 }}
                    animate={{ width: `${node.ram}%` }}
                  />
                </div>
                <p className="text-xs font-mono text-muted-foreground">{node.ram.toFixed(0)}%</p>
              </div>

              {/* Disk */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <HardDrive className="w-3 h-3" />
                  <span>Disk</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    className={cn('h-full rounded-full transition-all duration-500', getProgressColor(node.disk))}
                    initial={{ width: 0 }}
                    animate={{ width: `${node.disk}%` }}
                  />
                </div>
                <p className="text-xs font-mono text-muted-foreground">{node.disk.toFixed(0)}%</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};