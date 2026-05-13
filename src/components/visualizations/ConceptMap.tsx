import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  type NodeTypes,
  MarkerType,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useDocumentStore } from '@/store/documentStore';

/**
 * ConceptMap — Interactive semantic relationship graph using React Flow.
 * Displays AI-generated topic clusters as nodes with relationship edges.
 */
export function ConceptMap() {
  const clusters = useDocumentStore(s => s.aiClusters);
  const relations = useDocumentStore(s => s.aiClusterRelations);

  const nodes: Node[] = useMemo(() => {
    if (!clusters || clusters.length === 0) {
      // Placeholder node when no AI data
      return [{
        id: 'placeholder',
        type: 'default',
        position: { x: 150, y: 100 },
        data: { label: 'Load content and run AI analysis\nto see concept relationships' },
        style: {
          background: 'hsl(var(--muted))',
          color: 'hsl(var(--muted-foreground))',
          border: '1px dashed hsl(var(--border))',
          borderRadius: '8px',
          padding: '20px',
          fontSize: '12px',
          textAlign: 'center',
          whiteSpace: 'pre-line',
          width: 200,
        },
      }];
    }

    const spacing = 250;
    const cols = Math.min(3, clusters.length);
    return clusters.map((c, i) => ({
      id: c.id,
      type: 'default',
      position: {
        x: (i % cols) * spacing + 50,
        y: Math.floor(i / cols) * spacing + 50,
      },
      data: { label: c.label },
      style: {
        background: c.color + '15',
        color: c.color,
        border: `2px solid ${c.color}`,
        borderRadius: '12px',
        padding: '12px 16px',
        fontSize: '13px',
        fontWeight: 600,
        width: 200,
      },
    }));
  }, [clusters]);

  const edges: Edge[] = useMemo(() => {
    if (!relations || relations.length === 0) return [];

    return relations.map((r, i) => ({
      id: `edge-${i}`,
      source: r.fromId,
      target: r.toId,
      label: r.label,
      type: 'smoothstep',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: {
        stroke: 'hsl(var(--muted-foreground))',
        opacity: 0.6,
      },
      labelStyle: {
        fontSize: '10px',
        color: 'hsl(var(--muted-foreground))',
      },
    }));
  }, [relations]);

  if (!clusters || clusters.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
        Run AI analysis to see concept clusters
      </div>
    );
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      fitView
      attributionPosition="bottom-left"
      minZoom={0.5}
      maxZoom={2}
      proOptions={{ hideAttribution: true }}
    >
      <Background color="hsl(var(--muted))" gap={20} />
      <Controls showInteractive={false} />
      <MiniMap
        style={{ background: 'hsl(var(--background))' }}
        nodeColor={(node) => node.style?.borderColor || 'hsl(var(--primary))'}
        maskColor="hsl(var(--background))"
      />
    </ReactFlow>
  );
}
