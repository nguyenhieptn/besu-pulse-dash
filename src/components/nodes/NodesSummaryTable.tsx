import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Server } from 'lucide-react';
import { NetworkNode } from '@/hooks/useNodesData';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface NodesSummaryTableProps {
  nodes: NetworkNode[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-accent/20 text-accent';
    case 'Down':
      return 'bg-destructive/20 text-destructive';
    case 'Syncing':
      return 'bg-warning/20 text-warning';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export const NodesSummaryTable = ({ nodes, selectedNodeId, onSelectNode }: NodesSummaryTableProps) => {
  const [search, setSearch] = useState('');

  const filteredNodes = nodes.filter(node =>
    node.name.toLowerCase().includes(search.toLowerCase()) ||
    node.ipAddress.includes(search) ||
    node.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Server className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">All Nodes</h3>
            <p className="text-xs text-muted-foreground">{nodes.length} nodes in network</p>
          </div>
        </div>

        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search nodes..."
            className="pl-10 bg-secondary/50 border-border/50"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-xs text-muted-foreground font-medium">Status</TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium">Name</TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium">IP Address</TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium">Client Version</TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium text-right">Uptime</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNodes.map((node) => (
              <TableRow
                key={node.id}
                onClick={() => onSelectNode(node.id)}
                className={cn(
                  'border-border/30 cursor-pointer transition-colors',
                  selectedNodeId === node.id ? 'bg-primary/10' : 'hover:bg-secondary/30'
                )}
              >
                <TableCell>
                  <span className={cn('text-xs px-2 py-1 rounded-full font-medium', getStatusBadge(node.status))}>
                    {node.status}
                  </span>
                </TableCell>
                <TableCell className="font-medium">{node.name}</TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">{node.ipAddress}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{node.clientVersion}</TableCell>
                <TableCell className="text-right font-mono text-sm text-muted-foreground">{node.uptime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};