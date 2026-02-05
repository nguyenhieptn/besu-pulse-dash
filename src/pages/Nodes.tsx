import { motion } from 'framer-motion';
import { ArrowLeft, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNodesData } from '@/hooks/useNodesData';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { NetworkTopology } from '@/components/nodes/NetworkTopology';
import { NodeInspector } from '@/components/nodes/NodeInspector';
import { NodesSummaryTable } from '@/components/nodes/NodesSummaryTable';

const Nodes = () => {
  const { nodes, connections, selectedNode, selectNode, updateNodePosition, controlNode } = useNodesData();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeItem="nodes" />

      <main className="ml-16 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="w-10 h-10 rounded-lg bg-secondary/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Nodes Management</h1>
                <p className="text-sm text-muted-foreground">
                  Monitor and control network nodes
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border/50">
              <Radio className="w-4 h-4 text-accent" />
              <span className="text-sm text-muted-foreground">
                {nodes.filter(n => n.status === 'Active').length}/{nodes.length} Active
              </span>
            </div>
          </motion.header>

          {/* Network Topology Map - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="h-[500px] mb-6"
          >
            <NetworkTopology
              nodes={nodes}
              connections={connections}
              selectedNodeId={selectedNode?.id || null}
              onSelectNode={selectNode}
              onNodePositionChange={updateNodePosition}
            />
          </motion.div>

          {/* Node Inspector - Below Topology */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <NodeInspector node={selectedNode} onControlNode={controlNode} />
          </motion.div>

          {/* Nodes Summary Table */}
          <NodesSummaryTable
            nodes={nodes}
            selectedNodeId={selectedNode?.id || null}
            onSelectNode={selectNode}
          />

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 pt-6 border-t border-border/50 text-xs text-muted-foreground text-center"
          >
            <p>Node topology updates in real-time • Drag nodes to rearrange</p>
          </motion.footer>
        </div>
      </main>
    </div>
  );
};

export default Nodes;