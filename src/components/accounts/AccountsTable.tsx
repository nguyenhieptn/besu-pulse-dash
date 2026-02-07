import { motion } from 'framer-motion';
import { Fuel, Eye, Wallet } from 'lucide-react';
import { Account, shortenAddress } from '@/hooks/useAccountsData';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface AccountsTableProps {
  accounts: Account[];
  onSelectAccount: (account: Account) => void;
  onFundAccount: (accountId: string) => void;
  onViewInfo: (account: Account) => void;
}

const RoleBadge = ({ role }: { role: string }) => {
  const styles: Record<string, string> = {
    Admin: 'bg-primary/20 text-primary',
    User: 'bg-muted text-muted-foreground',
    Application: 'bg-accent/20 text-accent',
  };

  return (
    <span className={cn('text-xs px-2 py-1 rounded-full font-medium', styles[role] || styles.User)}>
      {role}
    </span>
  );
};

const StatusBadge = ({ status, type }: { status: string; type: 'permission' | 'api' | 'gas' }) => {
  const getStyles = () => {
    if (type === 'permission') {
      return status === 'Allowed' 
        ? 'bg-accent/20 text-accent' 
        : 'bg-destructive/20 text-destructive';
    }
    if (type === 'api') {
      return status === 'Enabled' 
        ? 'bg-accent/20 text-accent' 
        : 'bg-muted text-muted-foreground';
    }
    if (type === 'gas') {
      return status === 'Funded' 
        ? 'bg-accent/20 text-accent' 
        : 'bg-warning/20 text-warning';
    }
    return 'bg-muted text-muted-foreground';
  };

  return (
    <span className={cn('text-xs px-2 py-1 rounded-full font-medium', getStyles())}>
      {status}
    </span>
  );
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const AccountsTable = ({
  accounts,
  onSelectAccount,
  onFundAccount,
  onViewInfo,
}: AccountsTableProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card p-5"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <Wallet className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Accounts List</h3>
          <p className="text-xs text-muted-foreground">{accounts.length} accounts found</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-xs text-muted-foreground font-medium">Wallet Address</TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium">Role</TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium">API Access</TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium">Permission</TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium">Gas Status</TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium">Created</TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((account) => (
              <TableRow
                key={account.id}
                onClick={() => onSelectAccount(account)}
                className={cn(
                  'border-border/30 cursor-pointer transition-colors',
                  account.isNew && 'bg-primary/5 animate-pulse',
                  account.permissionStatus === 'Blocked' && 'bg-destructive/5',
                  !account.isNew && account.permissionStatus !== 'Blocked' && 'hover:bg-secondary/30'
                )}
              >
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-mono text-sm text-primary">
                      {shortenAddress(account.walletAddress)}
                    </span>
                    {account.label && (
                      <span className="text-xs text-muted-foreground">{account.label}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <RoleBadge role={account.role} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={account.apiAccess} type="api" />
                </TableCell>
                <TableCell>
                  <StatusBadge status={account.permissionStatus} type="permission" />
                </TableCell>
                <TableCell>
                  <StatusBadge status={account.gasStatus} type="gas" />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(account.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-warning"
                      onClick={(e) => {
                        e.stopPropagation();
                        onFundAccount(account.id);
                      }}
                    >
                      <Fuel className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewInfo(account);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {accounts.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No accounts found matching your filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};
