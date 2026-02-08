import { useState } from 'react';
import { User, Key, Globe, ShieldOff, ShieldCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { RPCClient } from '@/hooks/useRPCAccessData';

interface ClientsTableProps {
  clients: RPCClient[];
  onBlockClient: (clientId: string) => void;
  onUnblockClient: (clientId: string) => void;
}

export function ClientsTable({ clients, onBlockClient, onUnblockClient }: ClientsTableProps) {
  const [search, setSearch] = useState('');
  const [clientToBlock, setClientToBlock] = useState<string | null>(null);
  const [clientToUnblock, setClientToUnblock] = useState<string | null>(null);

  const filteredClients = clients.filter(client =>
    client.identifier.toLowerCase().includes(search.toLowerCase())
  );

  const getErrorRateColor = (rate: number) => {
    if (rate < 1) return 'text-emerald-400';
    if (rate < 5) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm bg-slate-900/50 border-slate-700"
        />
      </div>

      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="text-muted-foreground">Client</TableHead>
              <TableHead className="text-muted-foreground">Type</TableHead>
              <TableHead className="text-muted-foreground">Requests 24h</TableHead>
              <TableHead className="text-muted-foreground">Error Rate</TableHead>
              <TableHead className="text-muted-foreground">Rate Limit Hits</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Last Seen</TableHead>
              <TableHead className="text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow 
                key={client.id} 
                className={`border-slate-800 hover:bg-slate-800/50 ${
                  client.status === 'Blocked' ? 'bg-red-500/5' : ''
                }`}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    {client.type === 'API Key' ? (
                      <Key className="h-4 w-4 text-blue-400" />
                    ) : (
                      <Globe className="h-4 w-4 text-slate-400" />
                    )}
                    <code className="font-mono text-sm">{client.identifier}</code>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-slate-700">
                    {client.type}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono">
                  {client.requests24h.toLocaleString()}
                </TableCell>
                <TableCell>
                  <span className={`font-mono ${getErrorRateColor(client.errorRate)}`}>
                    {client.errorRate.toFixed(1)}%
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`font-mono ${client.rateLimitHits24h > 100 ? 'text-amber-400' : ''}`}>
                    {client.rateLimitHits24h.toLocaleString()}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    className={client.status === 'Normal' 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' 
                      : 'bg-red-500/20 text-red-400 border-red-500/50'}
                  >
                    {client.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDistanceToNow(client.lastSeen, { addSuffix: true })}
                </TableCell>
                <TableCell className="text-right">
                  {client.status === 'Normal' ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-red-500/20 hover:text-red-400"
                      onClick={() => setClientToBlock(client.id)}
                    >
                      <ShieldOff className="h-4 w-4 mr-1" />
                      Block
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-emerald-500/20 hover:text-emerald-400"
                      onClick={() => setClientToUnblock(client.id)}
                    >
                      <ShieldCheck className="h-4 w-4 mr-1" />
                      Unblock
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Block Confirmation */}
      <AlertDialog open={!!clientToBlock} onOpenChange={() => setClientToBlock(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-400">Block Client?</AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately block all RPC requests from this client.
              The client will receive 403 Forbidden responses until unblocked.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (clientToBlock) onBlockClient(clientToBlock);
                setClientToBlock(null);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Block Client
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Unblock Confirmation */}
      <AlertDialog open={!!clientToUnblock} onOpenChange={() => setClientToUnblock(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Unblock Client?</AlertDialogTitle>
            <AlertDialogDescription>
              This will restore RPC access for this client immediately.
              They will be subject to normal rate limiting rules.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (clientToUnblock) onUnblockClient(clientToUnblock);
                setClientToUnblock(null);
              }}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Unblock Client
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
