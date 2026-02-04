import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Play, Square, RotateCcw, CheckCircle, Cpu, MemoryStick, Clock } from 'lucide-react';
import { NetworkNode } from '@/hooks/useNodesData';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { cn } from '@/lib/utils';

interface NodeInspectorProps {
  node: NetworkNode | null;
  onControlNode: (nodeId: string, action: 'start' | 'stop' | 'restart') => Promise<void>;
}

const GaugeCircle = ({ value, label, icon: Icon, color }: { value: number; label: string; icon: any; color: string }) => {
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="6"
          />
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon className="w-4 h-4 text-muted-foreground mb-0.5" />
          <span className="text-sm font-semibold font-mono">{value.toFixed(0)}%</span>
        </div>
      </div>
      <span className="text-xs text-muted-foreground mt-2">{label}</span>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-2 border border-border text-xs">
        <p className="text-muted-foreground">{label}</p>
        <p className="font-semibold text-primary">{payload[0].value} peers</p>
      </div>
    );
  }
  return null;
};

export const NodeInspector = ({ node, onControlNode }: NodeInspectorProps) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyEnode = () => {
    if (node) {
      navigator.clipboard.writeText(node.enodeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: 'Copied!', description: 'Enode URL copied to clipboard' });
    }
  };

  const handleControl = async (action: 'start' | 'stop' | 'restart') => {
    if (!node) return;
    setIsLoading(action);
    await onControlNode(node.id, action);
    setIsLoading(null);
    toast({
      title: `Node ${action === 'start' ? 'Started' : action === 'stop' ? 'Stopped' : 'Restarted'}`,
      description: `${node.name} has been ${action === 'restart' ? 'restarted' : action + 'ed'} successfully.`,
    });
  };

  return (
    <AnimatePresence mode="wait">
      {node ? (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          className="glass-card p-5 h-full flex flex-col overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">{node.name}</h3>
              <p className="text-xs text-muted-foreground">{node.role} • {node.ipAddress}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyEnode}
              className="text-xs"
            >
              {copied ? <CheckCircle className="w-3 h-3 mr-1.5" /> : <Copy className="w-3 h-3 mr-1.5" />}
              {copied ? 'Copied' : 'Copy Enode'}
            </Button>
          </div>

          {/* Metrics Gauges */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-foreground mb-4">System Metrics</h4>
            <div className="flex justify-around">
              <GaugeCircle
                value={node.metrics.cpu}
                label="CPU Load"
                icon={Cpu}
                color={node.metrics.cpu > 80 ? 'hsl(var(--destructive))' : node.metrics.cpu > 60 ? 'hsl(var(--warning))' : 'hsl(var(--accent))'}
              />
              <GaugeCircle
                value={node.metrics.ram}
                label="RAM Usage"
                icon={MemoryStick}
                color={node.metrics.ram > 80 ? 'hsl(var(--destructive))' : node.metrics.ram > 60 ? 'hsl(var(--warning))' : 'hsl(var(--accent))'}
              />
              <GaugeCircle
                value={node.metrics.disk}
                label="Disk I/O"
                icon={Clock}
                color={node.metrics.disk > 80 ? 'hsl(var(--destructive))' : node.metrics.disk > 60 ? 'hsl(var(--warning))' : 'hsl(var(--accent))'}
              />
            </div>
          </div>

          {/* Peers Chart */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-foreground mb-3">Peers Count (1h)</h4>
            <div className="h-24 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={node.metrics.peersHistory.slice(-20)} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="peersGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" tick={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="peers"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#peersGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Service Controls */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-foreground mb-3">Service Control</h4>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleControl('start')}
                disabled={node.status === 'Active' || isLoading !== null}
                className="flex-1"
              >
                <Play className={cn('w-3 h-3 mr-1.5', isLoading === 'start' && 'animate-pulse')} />
                Start
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={node.status === 'Down' || isLoading !== null}
                    className="flex-1 text-destructive hover:text-destructive"
                  >
                    <Square className="w-3 h-3 mr-1.5" />
                    Stop
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="glass-card border-border">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Stop {node.name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will shut down the node and disconnect it from the network. 
                      {node.role === 'Validator' && ' As a validator, this may affect network consensus.'}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleControl('stop')}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Stop Node
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleControl('restart')}
                disabled={node.status === 'Down' || isLoading !== null}
                className="flex-1"
              >
                <RotateCcw className={cn('w-3 h-3 mr-1.5', isLoading === 'restart' && 'animate-spin')} />
                Restart
              </Button>
            </div>
          </div>

          {/* Configuration */}
          <div className="flex-1">
            <h4 className="text-sm font-medium text-foreground mb-3">Configuration (besu.toml)</h4>
            <pre className="p-3 rounded-lg bg-secondary/50 border border-border/50 text-xs font-mono text-muted-foreground overflow-x-auto max-h-48 overflow-y-auto">
              {node.config}
            </pre>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-5 h-full flex items-center justify-center text-muted-foreground"
        >
          Select a node to inspect
        </motion.div>
      )}
    </AnimatePresence>
  );
};