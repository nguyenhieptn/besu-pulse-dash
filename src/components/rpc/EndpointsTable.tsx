import { useState } from 'react';
import { Globe, Wifi, ExternalLink, Lock, Unlock } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { RPCEndpoint } from '@/hooks/useRPCAccessData';

interface EndpointsTableProps {
  endpoints: RPCEndpoint[];
}

export function EndpointsTable({ endpoints }: EndpointsTableProps) {
  const [search, setSearch] = useState('');
  const [selectedEndpoint, setSelectedEndpoint] = useState<RPCEndpoint | null>(null);

  const filteredEndpoints = endpoints.filter(endpoint =>
    endpoint.name.toLowerCase().includes(search.toLowerCase()) ||
    endpoint.url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search endpoints..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm bg-slate-900/50 border-slate-700"
        />
      </div>

      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="text-muted-foreground">Name</TableHead>
              <TableHead className="text-muted-foreground">Protocol</TableHead>
              <TableHead className="text-muted-foreground">Exposure</TableHead>
              <TableHead className="text-muted-foreground">Auth Mode</TableHead>
              <TableHead className="text-muted-foreground">Rate Limit Policy</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEndpoints.map((endpoint) => (
              <TableRow
                key={endpoint.id}
                className="border-slate-800 cursor-pointer hover:bg-slate-800/50"
                onClick={() => setSelectedEndpoint(endpoint)}
              >
                <TableCell className="font-medium">{endpoint.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-slate-700 gap-1">
                    {endpoint.protocol === 'HTTP' ? (
                      <Globe className="h-3 w-3" />
                    ) : (
                      <Wifi className="h-3 w-3" />
                    )}
                    {endpoint.protocol}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={endpoint.exposure === 'Public' 
                      ? 'border-amber-500/50 text-amber-400 gap-1' 
                      : 'border-slate-700 gap-1'}
                  >
                    {endpoint.exposure === 'Public' ? (
                      <ExternalLink className="h-3 w-3" />
                    ) : (
                      <Lock className="h-3 w-3" />
                    )}
                    {endpoint.exposure}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={endpoint.authMode === 'API Key' 
                      ? 'border-blue-500/50 text-blue-400 gap-1' 
                      : 'border-slate-700 gap-1'}
                  >
                    {endpoint.authMode === 'API Key' ? (
                      <Lock className="h-3 w-3" />
                    ) : (
                      <Unlock className="h-3 w-3" />
                    )}
                    {endpoint.authMode}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground">{endpoint.rateLimitPolicy}</span>
                </TableCell>
                <TableCell>
                  <Badge
                    className={endpoint.status === 'Active' 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' 
                      : 'bg-slate-500/20 text-slate-400 border-slate-500/50'}
                  >
                    {endpoint.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Endpoint Detail Dialog */}
      <Dialog open={!!selectedEndpoint} onOpenChange={() => setSelectedEndpoint(null)}>
        <DialogContent className="bg-slate-900 border-slate-800 max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-400" />
              {selectedEndpoint?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedEndpoint && (
            <div className="space-y-4">
              <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">URL</span>
                  <code className="font-mono text-sm text-blue-400">{selectedEndpoint.url}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Protocol</span>
                  <span>{selectedEndpoint.protocol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Exposure</span>
                  <Badge
                    variant="outline"
                    className={selectedEndpoint.exposure === 'Public' 
                      ? 'border-amber-500/50 text-amber-400' 
                      : 'border-slate-700'}
                  >
                    {selectedEndpoint.exposure}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Auth Mode</span>
                  <span>{selectedEndpoint.authMode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rate Limit Policy</span>
                  <span>{selectedEndpoint.rateLimitPolicy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge
                    className={selectedEndpoint.status === 'Active' 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' 
                      : 'bg-slate-500/20 text-slate-400 border-slate-500/50'}
                  >
                    {selectedEndpoint.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
