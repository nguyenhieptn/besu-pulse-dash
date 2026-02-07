import { motion } from 'framer-motion';
import { Search, UserPlus, Fuel, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AccountFilters, AccountRole, PermissionStatus, ApiAccess, GasStatus } from '@/hooks/useAccountsData';

interface AccountsActionBarProps {
  filters: AccountFilters;
  lowGasCount: number;
  onFilterChange: (filters: Partial<AccountFilters>) => void;
  onAddAccount: () => void;
  onFundLowGas: () => void;
  isFunding?: boolean;
}

export const AccountsActionBar = ({
  filters,
  lowGasCount,
  onFilterChange,
  onAddAccount,
  onFundLowGas,
  isFunding,
}: AccountsActionBarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card p-4"
    >
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search by address or label..."
            className="pl-10 bg-secondary/50 border-border/50 focus:border-primary placeholder:text-muted-foreground/50"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="w-3 h-3" />
            <span>Filters:</span>
          </div>

          <Select
            value={filters.role}
            onValueChange={(value) => onFilterChange({ role: value as AccountRole | 'All' })}
          >
            <SelectTrigger className="w-32 h-9 text-xs bg-secondary/50 border-border/50">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Roles</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="User">User</SelectItem>
              <SelectItem value="Application">Application</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.permissionStatus}
            onValueChange={(value) => onFilterChange({ permissionStatus: value as PermissionStatus | 'All' })}
          >
            <SelectTrigger className="w-32 h-9 text-xs bg-secondary/50 border-border/50">
              <SelectValue placeholder="Permission" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Allowed">Allowed</SelectItem>
              <SelectItem value="Blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.apiAccess}
            onValueChange={(value) => onFilterChange({ apiAccess: value as ApiAccess | 'All' })}
          >
            <SelectTrigger className="w-32 h-9 text-xs bg-secondary/50 border-border/50">
              <SelectValue placeholder="API" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All API</SelectItem>
              <SelectItem value="Enabled">Enabled</SelectItem>
              <SelectItem value="Disabled">Disabled</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.gasStatus}
            onValueChange={(value) => onFilterChange({ gasStatus: value as GasStatus | 'All' })}
          >
            <SelectTrigger className="w-32 h-9 text-xs bg-secondary/50 border-border/50">
              <SelectValue placeholder="Gas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Gas</SelectItem>
              <SelectItem value="Funded">Funded</SelectItem>
              <SelectItem value="Low Gas">Low Gas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto">
          {lowGasCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onFundLowGas}
              disabled={isFunding}
              className="text-warning border-warning/30 hover:bg-warning/10"
            >
              <Fuel className="w-4 h-4 mr-1.5" />
              Fund Low Gas ({lowGasCount})
            </Button>
          )}
          <Button
            size="sm"
            onClick={onAddAccount}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <UserPlus className="w-4 h-4 mr-1.5" />
            Add Account
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
