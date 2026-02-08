import { useState } from 'react';
import { Shield, Plus, Infinity } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import type { RateLimitPolicy } from '@/hooks/useRPCAccessData';

interface RateLimitsTableProps {
  policies: RateLimitPolicy[];
  onCreatePolicy: (data: Omit<RateLimitPolicy, 'id' | 'endpointsApplied'>) => void;
}

export function RateLimitsTable({ policies, onCreatePolicy }: RateLimitsTableProps) {
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    requestsPerSecond: 100,
    burst: 200,
    timeWindow: '1s',
    blockDuration: '60s',
  });

  const filteredPolicies = policies.filter(policy =>
    policy.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    onCreatePolicy(formData);
    setIsCreateOpen(false);
    setFormData({
      name: '',
      requestsPerSecond: 100,
      burst: 200,
      timeWindow: '1s',
      blockDuration: '60s',
    });
  };

  const formatValue = (value: number) => {
    if (value === -1) return <Infinity className="h-4 w-4 text-muted-foreground" />;
    return value.toLocaleString();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Search policies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm bg-slate-900/50 border-slate-700"
        />
        <Button 
          onClick={() => setIsCreateOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Policy
        </Button>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="text-muted-foreground">Policy Name</TableHead>
              <TableHead className="text-muted-foreground">Requests/sec</TableHead>
              <TableHead className="text-muted-foreground">Burst</TableHead>
              <TableHead className="text-muted-foreground">Time Window</TableHead>
              <TableHead className="text-muted-foreground">Block Duration</TableHead>
              <TableHead className="text-muted-foreground">Endpoints</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPolicies.map((policy) => (
              <TableRow key={policy.id} className="border-slate-800 hover:bg-slate-800/50">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-400" />
                    <span className="font-medium">{policy.name}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono">
                  {formatValue(policy.requestsPerSecond)}
                </TableCell>
                <TableCell className="font-mono">
                  {formatValue(policy.burst)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {policy.timeWindow === '-' ? '—' : policy.timeWindow}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {policy.blockDuration === '-' ? '—' : policy.blockDuration}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={policy.endpointsApplied > 0 
                      ? 'border-emerald-500/50 text-emerald-400' 
                      : 'border-slate-700'}
                  >
                    {policy.endpointsApplied} endpoint{policy.endpointsApplied !== 1 ? 's' : ''}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create Policy Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-400" />
              Create Rate Limit Policy
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Policy Name</Label>
              <Input
                placeholder="e.g., Standard, Premium"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-slate-800/50 border-slate-700"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Requests per Second</Label>
                <Input
                  type="number"
                  value={formData.requestsPerSecond}
                  onChange={(e) => setFormData(prev => ({ ...prev, requestsPerSecond: parseInt(e.target.value) || 0 }))}
                  className="bg-slate-800/50 border-slate-700"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Burst</Label>
                <Input
                  type="number"
                  value={formData.burst}
                  onChange={(e) => setFormData(prev => ({ ...prev, burst: parseInt(e.target.value) || 0 }))}
                  className="bg-slate-800/50 border-slate-700"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Time Window</Label>
                <Input
                  placeholder="e.g., 1s, 1m"
                  value={formData.timeWindow}
                  onChange={(e) => setFormData(prev => ({ ...prev, timeWindow: e.target.value }))}
                  className="bg-slate-800/50 border-slate-700"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Block Duration</Label>
                <Input
                  placeholder="e.g., 60s, 5m"
                  value={formData.blockDuration}
                  onChange={(e) => setFormData(prev => ({ ...prev, blockDuration: e.target.value }))}
                  className="bg-slate-800/50 border-slate-700"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreate}
              disabled={!formData.name}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create Policy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
