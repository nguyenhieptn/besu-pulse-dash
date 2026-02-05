import { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Node,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TopologyNode } from './TopologyNode';
import { NetworkNode, NodeConnection } from '@/hooks/useNodesData';

interface NetworkTopologyProps {
  nodes: NetworkNode[];
  connections: NodeConnection[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  onNodePositionChange: (nodeId: string, position: { x: number; y: number }) => void;
}

const nodeTypes = {
  topologyNode: TopologyNode,
};

export const NetworkTopology = ({
  nodes,
  connections,
  selectedNodeId,
  onSelectNode,
  onNodePositionChange,
}: NetworkTopologyProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const createFlowNodes = useCallback((): Node[] => 
    nodes.map(node => ({
      id: node.id,
      type: 'topologyNode',
      position: node.position,
      data: {
        name: node.name,
        role: node.role,
        status: node.status,
        isSelected: node.id === selectedNodeId,
        onSelect: () => onSelectNode(node.id),
      },
    })),
    [nodes, selectedNodeId, onSelectNode]
  );

  const createFlowEdges = useCallback((): Edge[] =>
    connections.map(conn => ({
      id: conn.id,
      source: conn.source,
      target: conn.target,
      animated: conn.animated,
      style: {
        stroke: conn.animated ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
        strokeWidth: 2,
        strokeDasharray: conn.animated ? '5 5' : 'none',
      },
    })),
    [connections]
  );

  const [reactFlowNodes, setNodes, onNodesChange] = useNodesState(createFlowNodes());
  const [reactFlowEdges, setEdges, onEdgesChange] = useEdgesState(createFlowEdges());

  // Sync external changes
  useEffect(() => {
    setNodes(createFlowNodes());
  }, [nodes, selectedNodeId, createFlowNodes, setNodes]);

  useEffect(() => {
    setEdges(createFlowEdges());
  }, [connections, createFlowEdges, setEdges]);

  const onNodeDragStop = useCallback(
    (_: any, node: Node) => {
      onNodePositionChange(node.id, node.position);
    },
    [onNodePositionChange]
  );

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  return (
    <div 
      className={`rounded-xl overflow-hidden border border-border bg-background/50 transition-all duration-300 ${
        isFullscreen 
          ? 'fixed inset-0 z-50 rounded-none' 
          : 'w-full h-full'
      }`}
    >
      {/* Fullscreen Toggle Button */}
      <div className="absolute top-3 right-3 z-10">
        <Button
          variant="secondary"
          size="icon"
          onClick={toggleFullscreen}
          className="bg-background/80 backdrop-blur-sm border border-border hover:bg-secondary"
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Fullscreen Header */}
      {isFullscreen && (
        <div className="absolute top-3 left-3 z-10 px-3 py-1.5 bg-background/80 backdrop-blur-sm rounded-lg border border-border">
          <span className="text-sm text-muted-foreground">Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">ESC</kbd> to exit fullscreen</span>
        </div>
      )}

      <ReactFlow
        nodes={reactFlowNodes}
        edges={reactFlowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        className="bg-transparent"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="hsl(var(--muted-foreground) / 0.2)"
        />
        <Controls
          className="!bg-card !border-border !rounded-lg [&>button]:!bg-card [&>button]:!border-border [&>button]:!text-foreground [&>button:hover]:!bg-secondary"
        />
      </ReactFlow>
    </div>
  );
};