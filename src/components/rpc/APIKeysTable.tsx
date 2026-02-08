import { useState } from 'react';
import { Key, RotateCcw, Ban, Plus, Copy, Check } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { APIKey } from '@/hooks/useRPCAccessData';

interface APIKeysTableProps {
  apiKeys: APIKey[];
  accountContext?: string;
  onCreateKey: (data: { name: string; ownerAccount: string; scope: string }) => void;
  onRotateKey: (keyId: string) => void;
  onRevokeKey: (keyId: string) => void;
}

export function APIKeysTable({ 
  apiKeys, 
  accountContext,
  onCreateKey, 
  onRotateKey, 
  onRevokeKey 
}: APIKeysTableProps) {
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [keyToRotate, setKeyToRotate] = useState<string | null>(null);
  const [keyToRevoke, setKeyToRevoke] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Form state
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyOwner, setNewKeyOwner] = useState(accountContext || '');
  const [newKeyScope, setNewKeyScope] = useState('read');

  const filteredKeys = apiKeys.filter(key =>
    key.name.toLowerCase().includes(search.toLowerCase()) ||
    key.keyPrefix.toLowerCase().includes(search.toLowerCase()) ||
    key.ownerAccount.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    onCreateKey({
      name: newKeyName,
      ownerAccount: newKeyOwner || '0x' + Math.random().toString(16).substring(2, 10) + '...',
      scope: newKeyScope,
    });
    setIsCreateOpen(false);
    setNewKeyName('');
    setNewKeyOwner(accountContext || '');
    setNewKeyScope('read');
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Search API keys..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm bg-slate-900/50 border-slate-700"
        />
        <Button 
          onClick={() => setIsCreateOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create API Key
        </Button>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="text-muted-foreground">Name</TableHead>
              <TableHead className="text-muted-foreground">Key Prefix</TableHead>
              <TableHead className="text-muted-foreground">Owner</TableHead>
              <TableHead className="text-muted-foreground">Scope</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Last Used</TableHead>
              <TableHead className="text-muted-foreground">Requests 24h</TableHead>
              <TableHead className="text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredKeys.map((key) => (
              <TableRow key={key.id} className="border-slate-800 hover:bg-slate-800/50">
                <TableCell className="font-medium">{key.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-sm text-blue-400">{key.keyPrefix}</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(key.keyPrefix, key.id)}
                    >
                      {copiedId === key.id ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <code className="font-mono text-xs text-muted-foreground">{key.ownerAccount}</code>
                    {key.ownerLabel && (
                      <span className="text-xs text-slate-400">{key.ownerLabel}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-slate-700 text-xs">
                    {key.scope}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={key.status === 'Active' 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' 
                      : 'bg-red-500/20 text-red-400 border-red-500/50'}
                  >
                    {key.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {key.lastUsed 
                    ? formatDistanceToNow(key.lastUsed, { addSuffix: true })
                    : 'Never'}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {key.requests24h.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-blue-500/20 hover:text-blue-400"
                      onClick={() => setKeyToRotate(key.id)}
                      disabled={key.status === 'Revoked'}
                      title="Rotate Key"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-red-500/20 hover:text-red-400"
                      onClick={() => setKeyToRevoke(key.id)}
                      disabled={key.status === 'Revoked'}
                      title="Revoke Key"
                    >
                      <Ban className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create API Key Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-blue-400" />
              Create New API Key
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Key Name</Label>
              <Input
                placeholder="e.g., Production App"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="bg-slate-800/50 border-slate-700"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Owner Account</Label>
              <Input
                placeholder="0x..."
                value={newKeyOwner}
                onChange={(e) => setNewKeyOwner(e.target.value)}
                disabled={!!accountContext}
                className="bg-slate-800/50 border-slate-700 font-mono"
              />
              {accountContext && (
                <p className="text-xs text-muted-foreground">
                  Locked to current account context
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Scope</Label>
              <Select value={newKeyScope} onValueChange={setNewKeyScope}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800">
                  <SelectItem value="read">Read Only</SelectItem>
                  <SelectItem value="read,write">Read & Write</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreate}
              disabled={!newKeyName}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rotate Confirmation */}
      <AlertDialog open={!!keyToRotate} onOpenChange={() => setKeyToRotate(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Rotate API Key?</AlertDialogTitle>
            <AlertDialogDescription>
              This will generate a new key prefix. The old key will stop working immediately.
              Make sure to update your applications with the new key.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (keyToRotate) onRotateKey(keyToRotate);
                setKeyToRotate(null);
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Rotate Key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Revoke Confirmation */}
      <AlertDialog open={!!keyToRevoke} onOpenChange={() => setKeyToRevoke(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-400">Revoke API Key?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The API key will be permanently disabled
              and all requests using this key will fail.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (keyToRevoke) onRevokeKey(keyToRevoke);
                setKeyToRevoke(null);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Revoke Key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
