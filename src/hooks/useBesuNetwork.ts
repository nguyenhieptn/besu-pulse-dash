import { useState, useEffect, useCallback } from 'react';

export interface NodeData {
  id: string;
  name: string;
  role: 'Validator' | 'RPC Node' | 'Bootnode';
  status: 'Running' | 'Stopped' | 'Syncing';
  cpu: number;
  ram: number;
  disk: number;
}

export interface Transaction {
  hash: string;
  method: string;
  time: string;
  status: 'Success' | 'Pending' | 'Failed';
  from: string;
  to: string;
}

export interface TPSDataPoint {
  time: string;
  tps: number;
  peak: number;
}

export interface NetworkStats {
  currentBlock: number;
  avgBlockTime: number;
  activeValidators: number;
  totalValidators: number;
  gasPrice: number;
  whitelistedAccounts: number;
}

export interface BesuNetworkData {
  stats: NetworkStats;
  nodes: NodeData[];
  transactions: Transaction[];
  tpsHistory: TPSDataPoint[];
  isLive: boolean;
}

const generateHash = () => {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
};

const shortenHash = (hash: string) => {
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
};

const methods = ['addAccount', 'propose', 'transfer', 'removeAccount', 'vote', 'execute', 'deploy'];

const generateTransaction = (): Transaction => {
  const timeAgo = Math.floor(Math.random() * 60);
  return {
    hash: generateHash(),
    method: methods[Math.floor(Math.random() * methods.length)],
    time: timeAgo === 0 ? 'Just now' : `${timeAgo}s ago`,
    status: Math.random() > 0.05 ? 'Success' : 'Pending',
    from: generateHash(),
    to: generateHash(),
  };
};

const generateTPSHistory = (): TPSDataPoint[] => {
  const history: TPSDataPoint[] = [];
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000);
    history.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      tps: Math.floor(Math.random() * 150) + 50,
      peak: 250,
    });
  }
  
  return history;
};

const initialNodes: NodeData[] = [
  { id: '1', name: 'Validator-1', role: 'Validator', status: 'Running', cpu: 45, ram: 62, disk: 38 },
  { id: '2', name: 'Validator-2', role: 'Validator', status: 'Running', cpu: 52, ram: 58, disk: 42 },
  { id: '3', name: 'RPC-Node-01', role: 'RPC Node', status: 'Running', cpu: 28, ram: 35, disk: 55 },
];

export const useBesuNetwork = (): BesuNetworkData => {
  const [stats, setStats] = useState<NetworkStats>({
    currentBlock: 1847293,
    avgBlockTime: 2.0,
    activeValidators: 3,
    totalValidators: 3,
    gasPrice: 0,
    whitelistedAccounts: 15000,
  });

  const [nodes, setNodes] = useState<NodeData[]>(initialNodes);
  const [transactions, setTransactions] = useState<Transaction[]>(() => 
    Array.from({ length: 5 }, generateTransaction)
  );
  const [tpsHistory, setTpsHistory] = useState<TPSDataPoint[]>(generateTPSHistory);
  const [isLive, setIsLive] = useState(true);

  // Update block counter every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        currentBlock: prev.currentBlock + 1,
        avgBlockTime: 1.8 + Math.random() * 0.4,
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Update node metrics every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => ({
        ...node,
        cpu: Math.max(10, Math.min(95, node.cpu + (Math.random() - 0.5) * 10)),
        ram: Math.max(20, Math.min(90, node.ram + (Math.random() - 0.5) * 8)),
        disk: Math.min(95, node.disk + Math.random() * 0.1),
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Add new transaction every 2-4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTransactions(prev => [generateTransaction(), ...prev.slice(0, 4)]);
    }, 2000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, []);

  // Update TPS history every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTpsHistory(prev => {
        const newPoint: TPSDataPoint = {
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          tps: Math.floor(Math.random() * 150) + 50,
          peak: 250,
        };
        return [...prev.slice(1), newPoint];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return {
    stats,
    nodes,
    transactions,
    tpsHistory,
    isLive,
  };
};

export { shortenHash };