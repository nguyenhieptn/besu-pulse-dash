import { useSearchParams } from 'react-router-dom';
import { Globe, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { RPCOverview } from '@/components/rpc/RPCOverview';
import { EndpointsTable } from '@/components/rpc/EndpointsTable';
import { APIKeysTable } from '@/components/rpc/APIKeysTable';
import { RateLimitsTable } from '@/components/rpc/RateLimitsTable';
import { ClientsTable } from '@/components/rpc/ClientsTable';
import { useRPCAccessData } from '@/hooks/useRPCAccessData';

export default function RPCAccess() {
  const [searchParams, setSearchParams] = useSearchParams();
  const accountContext = searchParams.get('account') || undefined;
  
  const {
    endpoints,
    apiKeys,
    rateLimitPolicies,
    clients,
    overview,
    createAPIKey,
    rotateAPIKey,
    revokeAPIKey,
    createRateLimitPolicy,
    blockClient,
    unblockClient,
  } = useRPCAccessData(accountContext);

  // Default tab based on context
  const defaultTab = accountContext ? 'api-keys' : 'endpoints';

  const clearAccountContext = () => {
    searchParams.delete('account');
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen flex w-full bg-slate-950">
      <Sidebar />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Globe className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">RPC Access</h1>
                <p className="text-muted-foreground">Network access control and API management</p>
              </div>
            </div>
            
            {/* Account Context Indicator */}
            {accountContext && (
              <Badge 
                variant="outline" 
                className="border-blue-500/50 text-blue-400 px-3 py-1.5 gap-2"
              >
                <span className="text-muted-foreground">Filtered by:</span>
                <code className="font-mono text-xs">{accountContext}</code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 hover:bg-blue-500/20 -mr-1"
                  onClick={clearAccountContext}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>

          {/* Overview */}
          <RPCOverview data={overview} />

          {/* Tabs */}
          <Tabs defaultValue={defaultTab} className="space-y-6">
            <TabsList className="bg-slate-900/50 border border-slate-800 p-1">
              <TabsTrigger 
                value="endpoints"
                className="data-[state=active]:bg-slate-800 data-[state=active]:text-foreground"
              >
                Endpoints
              </TabsTrigger>
              <TabsTrigger 
                value="api-keys"
                className="data-[state=active]:bg-slate-800 data-[state=active]:text-foreground"
              >
                API Keys
                {accountContext && (
                  <Badge className="ml-2 bg-blue-500/20 text-blue-400 border-0 text-xs">
                    Filtered
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="rate-limits"
                className="data-[state=active]:bg-slate-800 data-[state=active]:text-foreground"
              >
                Rate Limits
              </TabsTrigger>
              <TabsTrigger 
                value="clients"
                className="data-[state=active]:bg-slate-800 data-[state=active]:text-foreground"
              >
                Clients
              </TabsTrigger>
            </TabsList>

            <TabsContent value="endpoints">
              <EndpointsTable endpoints={endpoints} />
            </TabsContent>

            <TabsContent value="api-keys">
              <APIKeysTable
                apiKeys={apiKeys}
                accountContext={accountContext}
                onCreateKey={createAPIKey}
                onRotateKey={rotateAPIKey}
                onRevokeKey={revokeAPIKey}
              />
            </TabsContent>

            <TabsContent value="rate-limits">
              <RateLimitsTable
                policies={rateLimitPolicies}
                onCreatePolicy={createRateLimitPolicy}
              />
            </TabsContent>

            <TabsContent value="clients">
              <ClientsTable
                clients={clients}
                onBlockClient={blockClient}
                onUnblockClient={unblockClient}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
