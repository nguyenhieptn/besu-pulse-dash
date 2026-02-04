import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Shield, Link2, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomNodeData {
  name: string;
  role: 'Validator' | 'RPC Node' | 'Bootnode';
  status: 'Active' | 'Down' | 'Syncing';
  isSelected: boolean;
  onSelect: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'ring-accent shadow-[0_0_15px_hsl(var(--accent)/0.5)]';
    case 'Down':
      return 'ring-destructive shadow-[0_0_15px_hsl(var(--destructive)/0.5)]';
    case 'Syncing':
      return 'ring-warning shadow-[0_0_15px_hsl(var(--warning)/0.5)]';
    default:
      return 'ring-muted';
  }
};

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'Validator':
      return Shield;
    case 'RPC Node':
      return Link2;
    case 'Bootnode':
      return Radio;
    default:
      return Shield;
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case 'Validator':
      return 'bg-primary/20 text-primary';
    case 'RPC Node':
      return 'bg-accent/20 text-accent';
    case 'Bootnode':
      return 'bg-warning/20 text-warning';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

interface TopologyNodeProps {
  data: CustomNodeData;
}

export const TopologyNode = memo(({ data }: TopologyNodeProps) => {
  const Icon = getRoleIcon(data.role);
  const statusRing = getStatusColor(data.status);
  const roleColor = getRoleColor(data.role);

  return (
    <>
      <Handle type="target" position={Position.Left} className="!bg-primary !w-2 !h-2" />
      
      <div
        onClick={data.onSelect}
        className={cn(
          'px-4 py-3 rounded-xl bg-card/90 backdrop-blur-sm border border-border cursor-pointer transition-all duration-300',
          'ring-2 ring-offset-2 ring-offset-background',
          statusRing,
          data.isSelected && 'scale-105 border-primary'
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', roleColor)}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{data.name}</p>
            <p className="text-xs text-muted-foreground">{data.role}</p>
          </div>
        </div>
        
        <div className="mt-2 flex items-center gap-1.5">
          <div
            className={cn(
              'w-1.5 h-1.5 rounded-full',
              data.status === 'Active' && 'bg-accent',
              data.status === 'Down' && 'bg-destructive',
              data.status === 'Syncing' && 'bg-warning animate-pulse'
            )}
          />
          <span className="text-xs text-muted-foreground">{data.status}</span>
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="!bg-primary !w-2 !h-2" />
    </>
  );
});