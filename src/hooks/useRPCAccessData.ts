import { useState, useMemo } from 'react';

export type EndpointProtocol = 'HTTP' | 'WS';
export type EndpointExposure = 'Public' | 'Internal';
export type EndpointAuthMode = 'None' | 'API Key';
export type EndpointStatus = 'Active' | 'Disabled';

export type APIKeyStatus = 'Active' | 'Revoked';
export type ClientStatus = 'Normal' | 'Blocked';

export interface RPCEndpoint {
  id: string;
  name: string;
  url: string;
  protocol: EndpointProtocol;
  exposure: EndpointExposure;
  authMode: EndpointAuthMode;
  rateLimitPolicy: string;
  status: EndpointStatus;
}

export interface APIKey {
  id: string;
  name: string;
  keyPrefix: string;
  ownerAccount: string;
  ownerLabel?: string;
  scope: string;
  status: APIKeyStatus;
  lastUsed: Date | null;
  requests24h: number;
  createdAt: Date;
}

export interface RateLimitPolicy {
  id: string;
  name: string;
  requestsPerSecond: number;
  burst: number;
  timeWindow: string;
  blockDuration: string;
  endpointsApplied: number;
}

export interface RPCClient {
  id: string;
  identifier: string;
  type: 'API Key' | 'IP';
  requests24h: number;
  errorRate: number;
  rateLimitHits24h: number;
  status: ClientStatus;
  lastSeen: Date;
}

export interface RPCOverviewData {
  totalEndpoints: number;
  activeEndpoints: number;
  activeAPIKeys: number;
  requestsPerSecond: number;
  rateLimitHits24h: number;
  blockedClients: number;
}

// Mock data
const mockEndpoints: RPCEndpoint[] = [
  { id: '1', name: 'Public RPC', url: 'https://rpc.network.local', protocol: 'HTTP', exposure: 'Public', authMode: 'API Key', rateLimitPolicy: 'Standard', status: 'Active' },
  { id: '2', name: 'Internal RPC', url: 'http://internal-rpc:8545', protocol: 'HTTP', exposure: 'Internal', authMode: 'None', rateLimitPolicy: 'Unlimited', status: 'Active' },
  { id: '3', name: 'WebSocket Gateway', url: 'wss://ws.network.local', protocol: 'WS', exposure: 'Public', authMode: 'API Key', rateLimitPolicy: 'Standard', status: 'Active' },
  { id: '4', name: 'Admin RPC', url: 'http://admin-rpc:8545', protocol: 'HTTP', exposure: 'Internal', authMode: 'None', rateLimitPolicy: 'Admin', status: 'Active' },
  { id: '5', name: 'Legacy Endpoint', url: 'http://legacy:8545', protocol: 'HTTP', exposure: 'Internal', authMode: 'None', rateLimitPolicy: 'Standard', status: 'Disabled' },
];

const mockAPIKeys: APIKey[] = [
  { id: '1', name: 'Production App', keyPrefix: 'pk_live_8x7z...', ownerAccount: '0x1234...5678', ownerLabel: 'DeFi App', scope: 'read,write', status: 'Active', lastUsed: new Date(Date.now() - 300000), requests24h: 45230, createdAt: new Date('2024-01-15') },
  { id: '2', name: 'Analytics Service', keyPrefix: 'pk_live_3m9n...', ownerAccount: '0x2345...6789', ownerLabel: 'Analytics', scope: 'read', status: 'Active', lastUsed: new Date(Date.now() - 60000), requests24h: 12450, createdAt: new Date('2024-02-20') },
  { id: '3', name: 'Staging App', keyPrefix: 'pk_test_5k2p...', ownerAccount: '0x3456...7890', ownerLabel: 'Test Account', scope: 'read,write', status: 'Active', lastUsed: new Date(Date.now() - 3600000), requests24h: 890, createdAt: new Date('2024-03-10') },
  { id: '4', name: 'Old Integration', keyPrefix: 'pk_live_1a2b...', ownerAccount: '0x4567...8901', scope: 'read', status: 'Revoked', lastUsed: new Date('2024-01-01'), requests24h: 0, createdAt: new Date('2023-06-15') },
  { id: '5', name: 'Mobile App', keyPrefix: 'pk_live_9x8y...', ownerAccount: '0x1234...5678', ownerLabel: 'DeFi App', scope: 'read', status: 'Active', lastUsed: new Date(Date.now() - 120000), requests24h: 8920, createdAt: new Date('2024-04-01') },
];

const mockRateLimitPolicies: RateLimitPolicy[] = [
  { id: '1', name: 'Standard', requestsPerSecond: 100, burst: 200, timeWindow: '1s', blockDuration: '60s', endpointsApplied: 2 },
  { id: '2', name: 'Premium', requestsPerSecond: 500, burst: 1000, timeWindow: '1s', blockDuration: '30s', endpointsApplied: 0 },
  { id: '3', name: 'Admin', requestsPerSecond: 1000, burst: 2000, timeWindow: '1s', blockDuration: '10s', endpointsApplied: 1 },
  { id: '4', name: 'Unlimited', requestsPerSecond: -1, burst: -1, timeWindow: '-', blockDuration: '-', endpointsApplied: 1 },
  { id: '5', name: 'Strict', requestsPerSecond: 10, burst: 20, timeWindow: '1s', blockDuration: '300s', endpointsApplied: 0 },
];

const mockClients: RPCClient[] = [
  { id: '1', identifier: 'pk_live_8x7z...', type: 'API Key', requests24h: 45230, errorRate: 0.2, rateLimitHits24h: 12, status: 'Normal', lastSeen: new Date(Date.now() - 300000) },
  { id: '2', identifier: '192.168.1.100', type: 'IP', requests24h: 8900, errorRate: 0.5, rateLimitHits24h: 0, status: 'Normal', lastSeen: new Date(Date.now() - 60000) },
  { id: '3', identifier: 'pk_live_3m9n...', type: 'API Key', requests24h: 12450, errorRate: 0.1, rateLimitHits24h: 3, status: 'Normal', lastSeen: new Date(Date.now() - 120000) },
  { id: '4', identifier: '10.0.0.55', type: 'IP', requests24h: 150000, errorRate: 45.2, rateLimitHits24h: 8934, status: 'Blocked', lastSeen: new Date(Date.now() - 7200000) },
  { id: '5', identifier: 'pk_test_5k2p...', type: 'API Key', requests24h: 890, errorRate: 2.1, rateLimitHits24h: 45, status: 'Normal', lastSeen: new Date(Date.now() - 3600000) },
  { id: '6', identifier: '203.45.67.89', type: 'IP', requests24h: 50000, errorRate: 15.3, rateLimitHits24h: 2341, status: 'Blocked', lastSeen: new Date(Date.now() - 86400000) },
];

export function useRPCAccessData(accountContext?: string) {
  const [endpoints] = useState<RPCEndpoint[]>(mockEndpoints);
  const [apiKeys, setApiKeys] = useState<APIKey[]>(mockAPIKeys);
  const [rateLimitPolicies, setRateLimitPolicies] = useState<RateLimitPolicy[]>(mockRateLimitPolicies);
  const [clients, setClients] = useState<RPCClient[]>(mockClients);

  // Filter API keys by account context if provided
  const filteredAPIKeys = useMemo(() => {
    if (!accountContext) return apiKeys;
    return apiKeys.filter(key => key.ownerAccount === accountContext);
  }, [apiKeys, accountContext]);

  // Overview data
  const overview: RPCOverviewData = useMemo(() => ({
    totalEndpoints: endpoints.length,
    activeEndpoints: endpoints.filter(e => e.status === 'Active').length,
    activeAPIKeys: apiKeys.filter(k => k.status === 'Active').length,
    requestsPerSecond: 1247,
    rateLimitHits24h: clients.reduce((sum, c) => sum + c.rateLimitHits24h, 0),
    blockedClients: clients.filter(c => c.status === 'Blocked').length,
  }), [endpoints, apiKeys, clients]);

  // Actions
  const createAPIKey = (data: { name: string; ownerAccount: string; scope: string }) => {
    const newKey: APIKey = {
      id: crypto.randomUUID(),
      name: data.name,
      keyPrefix: `pk_live_${Math.random().toString(36).substring(2, 6)}...`,
      ownerAccount: data.ownerAccount,
      scope: data.scope,
      status: 'Active',
      lastUsed: null,
      requests24h: 0,
      createdAt: new Date(),
    };
    setApiKeys(prev => [newKey, ...prev]);
    return newKey;
  };

  const rotateAPIKey = (keyId: string) => {
    setApiKeys(prev => prev.map(key => 
      key.id === keyId 
        ? { ...key, keyPrefix: `pk_live_${Math.random().toString(36).substring(2, 6)}...` }
        : key
    ));
  };

  const revokeAPIKey = (keyId: string) => {
    setApiKeys(prev => prev.map(key => 
      key.id === keyId 
        ? { ...key, status: 'Revoked' as APIKeyStatus }
        : key
    ));
  };

  const createRateLimitPolicy = (data: Omit<RateLimitPolicy, 'id' | 'endpointsApplied'>) => {
    const newPolicy: RateLimitPolicy = {
      ...data,
      id: crypto.randomUUID(),
      endpointsApplied: 0,
    };
    setRateLimitPolicies(prev => [newPolicy, ...prev]);
    return newPolicy;
  };

  const blockClient = (clientId: string) => {
    setClients(prev => prev.map(client => 
      client.id === clientId 
        ? { ...client, status: 'Blocked' as ClientStatus }
        : client
    ));
  };

  const unblockClient = (clientId: string) => {
    setClients(prev => prev.map(client => 
      client.id === clientId 
        ? { ...client, status: 'Normal' as ClientStatus }
        : client
    ));
  };

  return {
    // Data
    endpoints,
    apiKeys: filteredAPIKeys,
    allApiKeys: apiKeys,
    rateLimitPolicies,
    clients,
    overview,
    accountContext,

    // Actions
    createAPIKey,
    rotateAPIKey,
    revokeAPIKey,
    createRateLimitPolicy,
    blockClient,
    unblockClient,
  };
}
