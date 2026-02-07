import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, CheckCircle, Fuel, Ban, ShieldCheck, KeyRound, Loader2 } from 'lucide-react';
import { Account } from '@/hooks/useAccountsData';
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
import { cn } from '@/lib/utils';

interface AccountQuickInfoProps {
  account: Account | null;
  isOpen: boolean;
  onClose: () => void;
  onFund: (accountId: string) => Promise<void>;
  onBlock: (accountId: string) => Promise<void>;
  onUnblock: (accountId: string) => Promise<void>;
  onRegenerateApiKey: (accountId: string) => Promise<string>;
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const AccountQuickInfo = ({
  account,
  isOpen,
  onClose,
  onFund,
  onBlock,
  onUnblock,
  onRegenerateApiKey,
}: AccountQuickInfoProps) => {
  const [copied, setCopied] = useState<'address' | 'apiKey' | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCopy = (text: string, type: 'address' | 'apiKey') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
    toast({ title: 'Copied!', description: `${type === 'address' ? 'Wallet address' : 'API key'} copied to clipboard` });
  };

  const handleAction = async (action: string, fn: () => Promise<void | string>) => {
    setLoading(action);
    try {
      await fn();
      toast({ title: 'Success', description: `Action completed successfully` });
    } catch (error) {
      toast({ title: 'Error', description: 'Action failed', variant: 'destructive' });
    }
    setLoading(null);
  };

  if (!account) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-screen w-full max-w-md bg-card border-l border-border z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border p-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Account Details</h2>
                {account.label && (
                  <p className="text-sm text-muted-foreground">{account.label}</p>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6">
              {/* Wallet Address */}
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground uppercase tracking-wider">
                  Full Wallet Address
                </label>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border/50">
                  <code className="flex-1 text-sm font-mono text-primary break-all">
                    {account.walletAddress}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => handleCopy(account.walletAddress, 'address')}
                  >
                    {copied === 'address' ? (
                      <CheckCircle className="w-4 h-4 text-accent" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Status Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">Role</p>
                  <p className={cn(
                    'text-sm font-medium',
                    account.role === 'Admin' && 'text-primary',
                    account.role === 'Application' && 'text-accent',
                    account.role === 'User' && 'text-foreground'
                  )}>
                    {account.role}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">Permission</p>
                  <p className={cn(
                    'text-sm font-medium',
                    account.permissionStatus === 'Allowed' ? 'text-accent' : 'text-destructive'
                  )}>
                    {account.permissionStatus}
                  </p>
                </div>
              </div>

              {/* API Section */}
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground uppercase tracking-wider">
                  API Access
                </label>
                <div className="p-3 rounded-lg bg-secondary/50 border border-border/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span className={cn(
                      'text-sm font-medium',
                      account.apiAccess === 'Enabled' ? 'text-accent' : 'text-muted-foreground'
                    )}>
                      {account.apiAccess}
                    </span>
                  </div>
                  {account.apiKey && (
                    <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                      <code className="flex-1 text-xs font-mono text-muted-foreground truncate">
                        {account.apiKey}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 h-8 w-8"
                        onClick={() => handleCopy(account.apiKey!, 'apiKey')}
                      >
                        {copied === 'apiKey' ? (
                          <CheckCircle className="w-3 h-3 text-accent" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Gas Section */}
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground uppercase tracking-wider">
                  ICT Gas
                </label>
                <div className="p-3 rounded-lg bg-secondary/50 border border-border/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Balance</span>
                    <span className={cn(
                      'text-sm font-mono font-medium',
                      account.gasStatus === 'Funded' ? 'text-accent' : 'text-warning'
                    )}>
                      {account.gasBalance} ICT
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last Funded</span>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(account.lastFundedAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Admin Actions */}
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground uppercase tracking-wider">
                  Admin Actions
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAction('fund', () => onFund(account.id))}
                    disabled={loading !== null}
                    className="text-warning border-warning/30 hover:bg-warning/10"
                  >
                    {loading === 'fund' ? (
                      <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                    ) : (
                      <Fuel className="w-4 h-4 mr-1.5" />
                    )}
                    Fund
                  </Button>

                  {account.permissionStatus === 'Allowed' ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={loading !== null}
                          className="text-destructive border-destructive/30 hover:bg-destructive/10"
                        >
                          <Ban className="w-4 h-4 mr-1.5" />
                          Block
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="glass-card border-border">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Block Account?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will revoke network access and disable API for this account.
                            {account.role === 'Admin' && ' Blocking an admin account may affect network operations.'}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleAction('block', () => onBlock(account.id))}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Block Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAction('unblock', () => onUnblock(account.id))}
                      disabled={loading !== null}
                      className="text-accent border-accent/30 hover:bg-accent/10"
                    >
                      {loading === 'unblock' ? (
                        <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                      ) : (
                        <ShieldCheck className="w-4 h-4 mr-1.5" />
                      )}
                      Unblock
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAction('regenerate', () => onRegenerateApiKey(account.id))}
                    disabled={loading !== null}
                    className="col-span-2"
                  >
                    {loading === 'regenerate' ? (
                      <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                    ) : (
                      <KeyRound className="w-4 h-4 mr-1.5" />
                    )}
                    Regenerate API Key
                  </Button>
                </div>
              </div>

              {/* Created At */}
              <div className="pt-4 border-t border-border/50 text-xs text-muted-foreground">
                Created: {formatDate(account.createdAt)}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
