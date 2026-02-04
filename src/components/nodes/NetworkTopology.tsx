import { useCallback, useMemo, useEffect } from 'react';
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

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-border bg-background/50">
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