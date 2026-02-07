import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Loader2, CheckCircle, Copy } from 'lucide-react';
import { AccountRole } from '@/hooks/useAccountsData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAccount: (role: AccountRole, label?: string) => Promise<{ walletAddress: string; apiKey?: string }>;
}

type Step = 'form' | 'creating' | 'success';

export const AddAccountModal = ({ isOpen, onClose, onCreateAccount }: AddAccountModalProps) => {
  const [step, setStep] = useState<Step>('form');
  const [role, setRole] = useState<AccountRole>('User');
  const [label, setLabel] = useState('');
  const [createdAccount, setCreatedAccount] = useState<{ walletAddress: string; apiKey?: string } | null>(null);
  const [copied, setCopied] = useState<'address' | 'apiKey' | null>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setStep('creating');
    try {
      const account = await onCreateAccount(role, label || undefined);
      setCreatedAccount(account);
      setStep('success');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create account', variant: 'destructive' });
      setStep('form');
    }
  };

  const handleCopy = (text: string, type: 'address' | 'apiKey') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleClose = () => {
    setStep('form');
    setRole('User');
    setLabel('');
    setCreatedAccount(null);
    onClose();
  };

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
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border border-border rounded-xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="border-b border-border p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Add New Account</h2>
                  <p className="text-xs text-muted-foreground">Create a fully provisioned account</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-4">
              {step === 'form' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="role">Account Role</Label>
                    <Select value={role} onValueChange={(v) => setRole(v as AccountRole)}>
                      <SelectTrigger className="bg-secondary/50 border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="User">User</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Application">Application</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {role === 'Admin' && 'Full administrative access to the network'}
                      {role === 'User' && 'Standard user access for transactions'}
                      {role === 'Application' && 'API access enabled by default for services'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="label">Label (Optional)</Label>
                    <Input
                      id="label"
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                      placeholder="e.g., Trading Bot, Main Wallet..."
                      className="bg-secondary/50 border-border/50"
                    />
                  </div>

                  <div className="p-3 rounded-lg bg-secondary/50 border border-border/50 space-y-2 text-sm">
                    <p className="text-muted-foreground">This will automatically:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-accent" />
                        Generate a new wallet address
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-accent" />
                        Add to permissioning (Allowed)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-accent" />
                        Fund with 100 ICT gas
                      </li>
                      {role === 'Application' && (
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-accent" />
                          Generate API key
                        </li>
                      )}
                    </ul>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Create Account
                  </Button>
                </motion.div>
              )}

              {step === 'creating' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-8 flex flex-col items-center justify-center gap-4"
                >
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">Creating account...</p>
                </motion.div>
              )}

              {step === 'success' && createdAccount && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="py-4 flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-accent" />
                    </div>
                    <p className="text-lg font-semibold text-foreground">Account Created!</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground uppercase tracking-wider">
                      Wallet Address
                    </label>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border/50">
                      <code className="flex-1 text-xs font-mono text-primary break-all">
                        {createdAccount.walletAddress}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 h-8 w-8"
                        onClick={() => handleCopy(createdAccount.walletAddress, 'address')}
                      >
                        {copied === 'address' ? (
                          <CheckCircle className="w-4 h-4 text-accent" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {createdAccount.apiKey && (
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground uppercase tracking-wider">
                        API Key
                      </label>
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border/50">
                        <code className="flex-1 text-xs font-mono text-accent break-all">
                          {createdAccount.apiKey}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0 h-8 w-8"
                          onClick={() => handleCopy(createdAccount.apiKey!, 'apiKey')}
                        >
                          {copied === 'apiKey' ? (
                            <CheckCircle className="w-4 h-4 text-accent" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-warning">
                        Save this API key now. It won't be shown again.
                      </p>
                    </div>
                  )}

                  <Button onClick={handleClose} className="w-full" variant="outline">
                    Done
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
