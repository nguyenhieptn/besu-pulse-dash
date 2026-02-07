import { useState, useCallback, useMemo } from 'react';

export type AccountRole = 'Admin' | 'User' | 'Application';
export type PermissionStatus = 'Allowed' | 'Blocked';
export type ApiAccess = 'Enabled' | 'Disabled';
export type GasStatus = 'Funded' | 'Low Gas';

export interface Account {
  id: string;
  walletAddress: string;
  label?: string;
  role: AccountRole;
  apiAccess: ApiAccess;
  apiKey?: string;
  permissionStatus: PermissionStatus;
  gasStatus: GasStatus;
  gasBalance: number;
  lastFundedAt?: string;
  createdAt: string;
  isNew?: boolean;
}

export interface AccountsOverview {
  total: number;
  allowed: number;
  blocked: number;
  admin: number;
  apiEnabled: number;
  lowGas: number;
}

export interface AccountFilters {
  search: string;
  role: AccountRole | 'All';
  permissionStatus: PermissionStatus | 'All';
  apiAccess: ApiAccess | 'All';
  gasStatus: GasStatus | 'All';
}

const generateWalletAddress = (): string => {
  const chars = '0123456789abcdef';
  let address = '0x';
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
};

const generateApiKey = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = 'bsk_';
  for (let i = 0; i < 32; i++) {
    key += chars[Math.floor(Math.random() * chars.length)];
  }
  return key;
};

const shortenAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const generateDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

const initialAccounts: Account[] = [
  {
    id: '1',
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    label: 'Main Admin',
    role: 'Admin',
    apiAccess: 'Enabled',
    apiKey: generateApiKey(),
    permissionStatus: 'Allowed',
    gasStatus: 'Funded',
    gasBalance: 1000,
    lastFundedAt: generateDate(2),
    createdAt: generateDate(90),
  },
  {
    id: '2',
    walletAddress: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    label: 'Backup Admin',
    role: 'Admin',
    apiAccess: 'Enabled',
    apiKey: generateApiKey(),
    permissionStatus: 'Allowed',
    gasStatus: 'Funded',
    gasBalance: 850,
    lastFundedAt: generateDate(5),
    createdAt: generateDate(85),
  },
  {
    id: '3',
    walletAddress: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
    label: 'Trading Bot',
    role: 'Application',
    apiAccess: 'Enabled',
    apiKey: generateApiKey(),
    permissionStatus: 'Allowed',
    gasStatus: 'Funded',
    gasBalance: 500,
    lastFundedAt: generateDate(1),
    createdAt: generateDate(60),
  },
  {
    id: '4',
    walletAddress: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
    label: 'Oracle Service',
    role: 'Application',
    apiAccess: 'Enabled',
    apiKey: generateApiKey(),
    permissionStatus: 'Allowed',
    gasStatus: 'Low Gas',
    gasBalance: 15,
    lastFundedAt: generateDate(30),
    createdAt: generateDate(45),
  },
  {
    id: '5',
    walletAddress: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
    label: 'User Account 1',
    role: 'User',
    apiAccess: 'Disabled',
    permissionStatus: 'Allowed',
    gasStatus: 'Funded',
    gasBalance: 200,
    lastFundedAt: generateDate(10),
    createdAt: generateDate(40),
  },
  {
    id: '6',
    walletAddress: '0x2844A00b0EdA46DE7F8252B36AD93B65A9FeB4b1',
    label: 'User Account 2',
    role: 'User',
    apiAccess: 'Enabled',
    apiKey: generateApiKey(),
    permissionStatus: 'Allowed',
    gasStatus: 'Low Gas',
    gasBalance: 8,
    lastFundedAt: generateDate(45),
    createdAt: generateDate(35),
  },
  {
    id: '7',
    walletAddress: '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82',
    label: 'Deprecated Service',
    role: 'Application',
    apiAccess: 'Disabled',
    permissionStatus: 'Blocked',
    gasStatus: 'Low Gas',
    gasBalance: 0,
    createdAt: generateDate(100),
  },
  {
    id: '8',
    walletAddress: '0x976EA74026E726554dB657fA54763abd0C3a0aa9',
    label: 'Suspended User',
    role: 'User',
    apiAccess: 'Disabled',
    permissionStatus: 'Blocked',
    gasStatus: 'Funded',
    gasBalance: 150,
    lastFundedAt: generateDate(60),
    createdAt: generateDate(80),
  },
  {
    id: '9',
    walletAddress: '0x14dC79964da2C08b23698B3D3cc7Ca32193d9955',
    role: 'User',
    apiAccess: 'Disabled',
    permissionStatus: 'Allowed',
    gasStatus: 'Funded',
    gasBalance: 300,
    lastFundedAt: generateDate(7),
    createdAt: generateDate(20),
  },
  {
    id: '10',
    walletAddress: '0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f',
    label: 'Payment Gateway',
    role: 'Application',
    apiAccess: 'Enabled',
    apiKey: generateApiKey(),
    permissionStatus: 'Allowed',
    gasStatus: 'Low Gas',
    gasBalance: 5,
    lastFundedAt: generateDate(50),
    createdAt: generateDate(55),
  },
];

export interface AccountsData {
  accounts: Account[];
  filteredAccounts: Account[];
  overview: AccountsOverview;
  filters: AccountFilters;
  selectedAccount: Account | null;
  isQuickInfoOpen: boolean;
  isAddModalOpen: boolean;
  setFilters: (filters: Partial<AccountFilters>) => void;
  selectAccount: (account: Account | null) => void;
  openQuickInfo: (account: Account) => void;
  closeQuickInfo: () => void;
  openAddModal: () => void;
  closeAddModal: () => void;
  createAccount: (role: AccountRole, label?: string) => Promise<Account>;
  fundAccount: (accountId: string) => Promise<void>;
  fundLowGasAccounts: () => Promise<number>;
  blockAccount: (accountId: string) => Promise<void>;
  unblockAccount: (accountId: string) => Promise<void>;
  regenerateApiKey: (accountId: string) => Promise<string>;
}

export const useAccountsData = (): AccountsData => {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [filters, setFiltersState] = useState<AccountFilters>({
    search: '',
    role: 'All',
    permissionStatus: 'All',
    apiAccess: 'All',
    gasStatus: 'All',
  });
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isQuickInfoOpen, setIsQuickInfoOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const overview = useMemo<AccountsOverview>(() => ({
    total: accounts.length,
    allowed: accounts.filter(a => a.permissionStatus === 'Allowed').length,
    blocked: accounts.filter(a => a.permissionStatus === 'Blocked').length,
    admin: accounts.filter(a => a.role === 'Admin').length,
    apiEnabled: accounts.filter(a => a.apiAccess === 'Enabled').length,
    lowGas: accounts.filter(a => a.gasStatus === 'Low Gas').length,
  }), [accounts]);

  const filteredAccounts = useMemo(() => {
    return accounts.filter(account => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesAddress = account.walletAddress.toLowerCase().includes(searchLower);
        const matchesLabel = account.label?.toLowerCase().includes(searchLower);
        if (!matchesAddress && !matchesLabel) return false;
      }

      // Role filter
      if (filters.role !== 'All' && account.role !== filters.role) return false;

      // Permission status filter
      if (filters.permissionStatus !== 'All' && account.permissionStatus !== filters.permissionStatus) return false;

      // API access filter
      if (filters.apiAccess !== 'All' && account.apiAccess !== filters.apiAccess) return false;

      // Gas status filter
      if (filters.gasStatus !== 'All' && account.gasStatus !== filters.gasStatus) return false;

      return true;
    });
  }, [accounts, filters]);

  const setFilters = useCallback((newFilters: Partial<AccountFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  const selectAccount = useCallback((account: Account | null) => {
    setSelectedAccount(account);
  }, []);

  const openQuickInfo = useCallback((account: Account) => {
    setSelectedAccount(account);
    setIsQuickInfoOpen(true);
  }, []);

  const closeQuickInfo = useCallback(() => {
    setIsQuickInfoOpen(false);
  }, []);

  const openAddModal = useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  const closeAddModal = useCallback(() => {
    setIsAddModalOpen(false);
  }, []);

  const createAccount = useCallback(async (role: AccountRole, label?: string): Promise<Account> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newAccount: Account = {
      id: Date.now().toString(),
      walletAddress: generateWalletAddress(),
      label,
      role,
      apiAccess: role === 'Application' ? 'Enabled' : 'Disabled',
      apiKey: role === 'Application' ? generateApiKey() : undefined,
      permissionStatus: 'Allowed',
      gasStatus: 'Funded',
      gasBalance: 100,
      lastFundedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      isNew: true,
    };

    setAccounts(prev => [newAccount, ...prev]);
    
    // Remove "new" highlight after 5 seconds
    setTimeout(() => {
      setAccounts(prev => prev.map(a => 
        a.id === newAccount.id ? { ...a, isNew: false } : a
      ));
    }, 5000);

    return newAccount;
  }, []);

  const fundAccount = useCallback(async (accountId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setAccounts(prev => prev.map(account => {
      if (account.id === accountId) {
        const updated = {
          ...account,
          gasBalance: account.gasBalance + 100,
          gasStatus: 'Funded' as GasStatus,
          lastFundedAt: new Date().toISOString(),
        };
        // Update selected account if it's the one being funded
        if (selectedAccount?.id === accountId) {
          setSelectedAccount(updated);
        }
        return updated;
      }
      return account;
    }));
  }, [selectedAccount]);

  const fundLowGasAccounts = useCallback(async (): Promise<number> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const lowGasAccounts = accounts.filter(a => a.gasStatus === 'Low Gas');
    const count = lowGasAccounts.length;

    setAccounts(prev => prev.map(account => {
      if (account.gasStatus === 'Low Gas') {
        return {
          ...account,
          gasBalance: account.gasBalance + 100,
          gasStatus: 'Funded' as GasStatus,
          lastFundedAt: new Date().toISOString(),
        };
      }
      return account;
    }));

    return count;
  }, [accounts]);

  const blockAccount = useCallback(async (accountId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setAccounts(prev => prev.map(account => {
      if (account.id === accountId) {
        const updated = {
          ...account,
          permissionStatus: 'Blocked' as PermissionStatus,
          apiAccess: 'Disabled' as ApiAccess,
        };
        if (selectedAccount?.id === accountId) {
          setSelectedAccount(updated);
        }
        return updated;
      }
      return account;
    }));
  }, [selectedAccount]);

  const unblockAccount = useCallback(async (accountId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setAccounts(prev => prev.map(account => {
      if (account.id === accountId) {
        const updated = {
          ...account,
          permissionStatus: 'Allowed' as PermissionStatus,
        };
        if (selectedAccount?.id === accountId) {
          setSelectedAccount(updated);
        }
        return updated;
      }
      return account;
    }));
  }, [selectedAccount]);

  const regenerateApiKey = useCallback(async (accountId: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newKey = generateApiKey();
    
    setAccounts(prev => prev.map(account => {
      if (account.id === accountId) {
        const updated = {
          ...account,
          apiKey: newKey,
          apiAccess: 'Enabled' as ApiAccess,
        };
        if (selectedAccount?.id === accountId) {
          setSelectedAccount(updated);
        }
        return updated;
      }
      return account;
    }));

    return newKey;
  }, [selectedAccount]);

  return {
    accounts,
    filteredAccounts,
    overview,
    filters,
    selectedAccount,
    isQuickInfoOpen,
    isAddModalOpen,
    setFilters,
    selectAccount,
    openQuickInfo,
    closeQuickInfo,
    openAddModal,
    closeAddModal,
    createAccount,
    fundAccount,
    fundLowGasAccounts,
    blockAccount,
    unblockAccount,
    regenerateApiKey,
  };
};

export { shortenAddress, generateApiKey };
