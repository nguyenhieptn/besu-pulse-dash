import { useState, useEffect, useCallback } from 'react';

export interface NodeMetrics {
  cpu: number;
  ram: number;
  disk: number;
  peersHistory: { time: string; peers: number }[];
}

export interface NetworkNode {
  id: string;
  name: string;
  role: 'Validator' | 'RPC Node' | 'Bootnode';
  status: 'Active' | 'Down' | 'Syncing';
  ipAddress: string;
  clientVersion: string;
  uptime: string;
  enodeUrl: string;
  metrics: NodeMetrics;
  config: string;
  position: { x: number; y: number };
}

export interface NodeConnection {
  id: string;
  source: string;
  target: string;
  animated: boolean;
}

const generatePeersHistory = () => {
  const history: { time: string; peers: number }[] = [];
  const now = new Date();
  
  for (let i = 60; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000);
    history.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      peers: Math.floor(Math.random() * 5) + 2,
    });
  }
  
  return history;
};

const generateConfig = (node: { name: string; role: string }) => `# ${node.name} Configuration
[Node]
data-path = "/data/besu"
genesis-file = "/config/genesis.json"
network-id = 1337

[RPC]
rpc-http-enabled = true
rpc-http-host = "0.0.0.0"
rpc-http-port = 8545
rpc-http-cors-origins = ["*"]

[Metrics]
metrics-enabled = true
metrics-host = "0.0.0.0"
metrics-port = 9545

[Consensus]
${node.role === 'Validator' ? 'validator-enabled = true' : 'validator-enabled = false'}
ibft2-block-period = 2`;

const initialNodes: NetworkNode[] = [
  {
    id: 'validator-1',
    name: 'Validator-01',
    role: 'Validator',
    status: 'Active',
    ipAddress: '192.168.1.10',
    clientVersion: 'Besu/v24.1.0',
    uptime: '15d 4h 23m',
    enodeUrl: 'enode://abc123...@192.168.1.10:30303',
    metrics: { cpu: 45, ram: 62, disk: 15, peersHistory: generatePeersHistory() },
    config: '',
    position: { x: 100, y: 150 },
  },
  {
    id: 'validator-2',
    name: 'Validator-02',
    role: 'Validator',
    status: 'Active',
    ipAddress: '192.168.1.11',
    clientVersion: 'Besu/v24.1.0',
    uptime: '15d 4h 20m',
    enodeUrl: 'enode://def456...@192.168.1.11:30303',
    metrics: { cpu: 52, ram: 58, disk: 18, peersHistory: generatePeersHistory() },
    config: '',
    position: { x: 350, y: 50 },
  },
  {
    id: 'validator-3',
    name: 'Validator-03',
    role: 'Validator',
    status: 'Down',
    ipAddress: '192.168.1.12',
    clientVersion: 'Besu/v24.1.0',
    uptime: '0d 0h 0m',
    enodeUrl: 'enode://ghi789...@192.168.1.12:30303',
    metrics: { cpu: 0, ram: 0, disk: 22, peersHistory: [] },
    config: '',
    position: { x: 350, y: 250 },
  },
  {
    id: 'rpc-1',
    name: 'RPC-Node-01',
    role: 'RPC Node',
    status: 'Active',
    ipAddress: '192.168.1.20',
    clientVersion: 'Besu/v24.1.0',
    uptime: '10d 12h 5m',
    enodeUrl: 'enode://jkl012...@192.168.1.20:30303',
    metrics: { cpu: 28, ram: 35, disk: 45, peersHistory: generatePeersHistory() },
    config: '',
    position: { x: 600, y: 150 },
  },
  {
    id: 'bootnode-1',
    name: 'Bootnode-01',
    role: 'Bootnode',
    status: 'Active',
    ipAddress: '192.168.1.5',
    clientVersion: 'Besu/v24.1.0',
    uptime: '30d 8h 45m',
    enodeUrl: 'enode://mno345...@192.168.1.5:30303',
    metrics: { cpu: 12, ram: 25, disk: 10, peersHistory: generatePeersHistory() },
    config: '',
    position: { x: 600, y: 300 },
  },
];

// Add config to each node
initialNodes.forEach(node => {
  node.config = generateConfig(node);
});

const initialConnections: NodeConnection[] = [
  { id: 'e1-2', source: 'validator-1', target: 'validator-2', animated: true },
  { id: 'e1-3', source: 'validator-1', target: 'validator-3', animated: false },
  { id: 'e2-3', source: 'validator-2', target: 'validator-3', animated: false },
  { id: 'e1-rpc', source: 'validator-1', target: 'rpc-1', animated: true },
  { id: 'e2-rpc', source: 'validator-2', target: 'rpc-1', animated: true },
  { id: 'e1-boot', source: 'validator-1', target: 'bootnode-1', animated: true },
  { id: 'erpc-boot', source: 'rpc-1', target: 'bootnode-1', animated: true },
];

export interface NodesData {
  nodes: NetworkNode[];
  connections: NodeConnection[];
  selectedNode: NetworkNode | null;
  selectNode: (nodeId: string | null) => void;
  updateNodePosition: (nodeId: string, position: { x: number; y: number }) => void;
  controlNode: (nodeId: string, action: 'start' | 'stop' | 'restart') => Promise<void>;
}

export const useNodesData = (): NodesData => {
  const [nodes, setNodes] = useState<NetworkNode[]>(initialNodes);
  const [connections, setConnections] = useState<NodeConnection[]>(initialConnections);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('validator-1');

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || null;

  // Update metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => {
        if (node.status === 'Down') return node;
        
        return {
          ...node,
          metrics: {
            ...node.metrics,
            cpu: Math.max(5, Math.min(95, node.metrics.cpu + (Math.random() - 0.5) * 10)),
            ram: Math.max(10, Math.min(90, node.metrics.ram + (Math.random() - 0.5) * 8)),
            peersHistory: [
              ...node.metrics.peersHistory.slice(1),
              {
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                peers: Math.floor(Math.random() * 5) + 2,
              },
            ],
          },
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const selectNode = useCallback((nodeId: string | null) => {
    setSelectedNodeId(nodeId);
  }, []);

  const updateNodePosition = useCallback((nodeId: string, position: { x: number; y: number }) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, position } : node
    ));
  }, []);

  const controlNode = useCallback(async (nodeId: string, action: 'start' | 'stop' | 'restart') => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setNodes(prev => prev.map(node => {
      if (node.id !== nodeId) return node;

      switch (action) {
        case 'start':
          return { ...node, status: 'Syncing' as const };
        case 'stop':
          return { ...node, status: 'Down' as const, metrics: { ...node.metrics, cpu: 0, ram: 0 } };
        case 'restart':
          return { ...node, status: 'Syncing' as const };
        default:
          return node;
      }
    }));

    // Update connections based on node status
    setConnections(prev => prev.map(conn => {
      if (conn.source === nodeId || conn.target === nodeId) {
        return { ...conn, animated: action !== 'stop' };
      }
      return conn;
    }));

    // Simulate sync completion
    if (action === 'start' || action === 'restart') {
      setTimeout(() => {
        setNodes(prev => prev.map(node => 
          node.id === nodeId ? { ...node, status: 'Active' as const } : node
        ));
      }, 3000);
    }
  }, []);

  return {
    nodes,
    connections,
    selectedNode,
    selectNode,
    updateNodePosition,
    controlNode,
  };
};