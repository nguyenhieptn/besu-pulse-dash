import { motion } from 'framer-motion';
import { Users, Plus, Shield, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface QuickPermissioningProps {
  whitelistedAccounts: number;
}

export const QuickPermissioning = ({ whitelistedAccounts }: QuickPermissioningProps) => {
  const [address, setAddress] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const handleAddAccount = async () => {
    if (!address.startsWith('0x') || address.length !== 42) {
      toast({
        title: 'Invalid Address',
        description: 'Please enter a valid Ethereum address (0x...)',
        variant: 'destructive',
      });
      return;
    }

    setIsAdding(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: 'Account Whitelisted',
      description: `Successfully added ${address.slice(0, 10)}...${address.slice(-6)}`,
    });
    
    setAddress('');
    setIsAdding(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="glass-card p-6 h-full flex flex-col"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
          <Shield className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Quick Permissioning</h3>
          <p className="text-xs text-muted-foreground">Manage whitelisted accounts</p>
        </div>
      </div>

      <div className="flex-1">
        {/* Stats */}
        <div className="p-4 rounded-lg bg-secondary/50 border border-border/50 mb-4">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-accent" />
            <div>
              <p className="text-xs text-muted-foreground">Whitelisted Accounts</p>
              <p className="text-2xl font-semibold font-mono text-foreground">
                {whitelistedAccounts.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Add */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Quick Add Account</p>
          <div className="flex gap-2">
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x..."
              className="font-mono text-sm bg-secondary/50 border-border/50 focus:border-primary placeholder:text-muted-foreground/50"
            />
            <Button
              onClick={handleAddAccount}
              disabled={isAdding || !address}
              className="bg-accent hover:bg-accent/90 text-accent-foreground shrink-0"
            >
              {isAdding ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Plus className="w-4 h-4" />
                </motion.div>
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Enter a valid Ethereum address to whitelist
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CheckCircle className="w-3 h-3 text-accent" />
          <span>Last added: 0x7a23...8f9d • 2 minutes ago</span>
        </div>
      </div>
    </motion.div>
  );
};