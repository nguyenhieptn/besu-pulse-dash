import { motion } from 'framer-motion';
import { History, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Transaction, shortenHash } from '@/hooks/useBesuNetwork';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface RecentEventsProps {
  transactions: Transaction[];
}

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'Success':
      return <CheckCircle2 className="w-4 h-4 text-accent" />;
    case 'Pending':
      return <Clock className="w-4 h-4 text-warning" />;
    default:
      return <XCircle className="w-4 h-4 text-destructive" />;
  }
};

const getMethodColor = (method: string): string => {
  const colors: Record<string, string> = {
    addAccount: 'text-accent bg-accent/10',
    removeAccount: 'text-destructive bg-destructive/10',
    propose: 'text-primary bg-primary/10',
    transfer: 'text-neon-blue bg-primary/10',
    vote: 'text-warning bg-warning/10',
    execute: 'text-accent bg-accent/10',
    deploy: 'text-primary bg-primary/10',
  };
  return colors[method] || 'text-muted-foreground bg-muted';
};

export const RecentEvents = ({ transactions }: RecentEventsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-card p-6 h-full"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <History className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Recent Network Events</h3>
          <p className="text-xs text-muted-foreground">Latest transactions on the network</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-xs text-muted-foreground font-medium">Tx Hash</TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium">Method</TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium">Time</TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx, index) => (
              <motion.tr
                key={tx.hash}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-border/30 hover:bg-secondary/30 transition-colors"
              >
                <TableCell className="font-mono text-sm text-primary">
                  {shortenHash(tx.hash)}
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      'text-xs px-2 py-1 rounded-full font-medium',
                      getMethodColor(tx.method)
                    )}
                  >
                    {tx.method}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{tx.time}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <StatusIcon status={tx.status} />
                    <span className="text-xs text-muted-foreground">{tx.status}</span>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};