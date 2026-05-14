import { useMemo, memo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  MarkerType,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useDocumentStore } from '@/store/documentStore';
import { cn } from '@/lib/utils';

/**
 * ConceptMap — Interactive graph of AI-extracted topic relationships.
 * Uses dagre-like auto-layout via React Flow's default layout.
 * Falls back gracefully when no AI data is available.
 */
export const ConceptMap = memo(function ConceptMap() {
  const clusters = useDocumentStore(s => s.aiClusters);
  const relations = useDocumentStore(s => s.aiClusterRelations);

  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    if (!clusters || clusters.length === 0) {
      return {
        nodes: [
          {
            id: 'empty',
            type: 'default',
            position: { x: 0, y: 0 },
            data: {
              label: 'No concept data yet.\nRun AI analysis to see semantic relationships.',
            },
            style: emptyNodeStyle,
          },
        ],
        edges: [],
      };
    }

    const spacingX = 260;
    const spacingY = 180;
    const cols = Math.min(3, clusters.length);

    const nodes: Node[] = clusters.map((c, i) => ({
      id: c.id,
      type: 'default',
      position: {
        x: (i % cols) * spacingX + 40,
        y: Math.floor(i / cols) * spacingY + 40,
      },
      data: { label: c.label },
      style: {
        background: c.color + '12',
        color: c.color,
        border: `1.5px solid ${c.color}40`,
        borderRadius: '12px',
        padding: '10px 16px',
        fontSize: '12px',
        fontWeight: 600,
        width: 200,
        backdropFilter: 'blur(4px)',
        boxShadow: `0 2px 8px ${c.color}10`,
      },
    }));

    const edges: Edge[] = (relations || []).map((r, i) => ({
      id: `e-${i}`,
      source: r.fromId,
      target: r.toId,
      label: r.label,
      type: 'smoothstep',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
      style: {
        stroke: 'hsl(var(--muted-foreground))',
        strokeWidth: 1.5,
        opacity: 0.5,
      },
      labelStyle: {
        fontSize: '9px',
        fill: 'hsl(var(--foreground))',
      },
      labelBgStyle: {
        fill: 'hsl(var(--background))',
        fillOpacity: 0.85,
      },
      labelBgPadding: [6, 3] as [number, number],
      labelBgBorderRadius: 4,
    }));

    return { nodes, edges };
  }, [clusters, relations]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  if (!clusters || clusters.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xs text-muted-foreground/60 px-8 text-center leading-relaxed">
          Load content and run AI analysis<br />to see concept relationships
        </p>
      </div>
    );
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
      minZoom={0.4}
      maxZoom={2.5}
      proOptions={{ hideAttribution: true }}
      className={cn(
        '[&_.react-flow__background]:bg-transparent',
        '[&_.react-flow__controls-button]:bg-background [&_.react-flow__controls-button]:border [&_.react-flow__controls-button]:border-border [&_.react-flow__controls-button]:text-foreground [&_.react-flow__controls-button]:hover:bg-accent [&_.react-flow__controls-button_svg]:fill-current',
      )}
    >
      <Background color="hsl(var(--muted))" gap={24} size={1} />
      <Controls
        showInteractive={false}
        className="[&_button]:w-7 [&_button]:h-7 [&_svg]:w-3.5 [&_svg]:h-3.5"
      />
      <MiniMap
        style={{
          background: 'hsl(var(--background))',
          border: '1px solid hsl(var(--border))',
          borderRadius: '8px',
        }}
        nodeColor={(node) => node.style?.borderColor || 'hsl(var(--primary))'}
        maskColor="hsl(var(--background))"
        className="[&_.react-flow__minimap-mask]:fill-background/60"
      />
    </ReactFlow>
  );
});

const emptyNodeStyle: React.CSSProperties = {
  background: 'transparent',
  color: 'hsl(var(--muted-foreground))',
  border: '1.5px dashed hsl(var(--border))',
  borderRadius: '12px',
  padding: '20px 24px',
  fontSize: '12px',
  textAlign: 'center',
  whiteSpace: 'pre-line',
  width: 260,
  lineHeight: '1.6',
};
