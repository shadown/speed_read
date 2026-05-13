import { useMemo, useState } from 'react';
import { useDocumentStore } from '@/store/documentStore';
import {
  HEATMAP_COLORS,
  HEATMAP_LABELS,
  type HeatmapCategory,
  type Paragraph,
} from '@/types';
import { cn } from '@/lib/utils';

const CATEGORIES = Object.keys(HEATMAP_LABELS) as HeatmapCategory[];

/**
 * Heatmap — Color-coded semantic category overlay for paragraphs.
 * Shows a compact colored bar per paragraph with filterable categories.
 * Click a category pill to filter; click again to clear.
 */
export function Heatmap() {
  const paragraphs = useDocumentStore(s => s.paragraphs);
  const heatmap = useDocumentStore(s => s.aiHeatmap);
  const [filter, setFilter] = useState<HeatmapCategory | null>(null);

  const hasData = heatmap && heatmap.length > 0;

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of paragraphs) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return counts;
  }, [paragraphs]);

  const filtered = useMemo(
    () => (filter ? paragraphs.filter((p) => p.category === filter) : paragraphs),
    [paragraphs, filter],
  );

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-32 text-xs text-muted-foreground/60">
        {paragraphs.length > 0
          ? 'Run AI analysis for content heatmap'
          : 'No content loaded'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Category filter pills — polished */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((cat) => {
          const count = categoryCounts[cat] || 0;
          const active = filter === cat;
          const color = HEATMAP_COLORS[cat];
          return (
            <button
              key={cat}
              onClick={() => setFilter(active ? null : cat)}
              className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-200 select-none',
                active
                  ? 'ring-2 ring-offset-1 ring-offset-background shadow-sm'
                  : 'opacity-65 hover:opacity-100 hover:shadow-sm',
              )}
              style={{
                backgroundColor: color + '14',
                color: color,
                border: `1px solid ${color}30`,
                ...(active ? { ringColor: color } : {}),
              }}
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
              <span>{HEATMAP_LABELS[cat]}</span>
              <span className="opacity-60 ml-0.5">({count})</span>
            </button>
          );
        })}
        {filter && (
          <button
            onClick={() => setFilter(null)}
            className="text-[10px] text-muted-foreground hover:text-foreground px-1.5 transition-colors"
          >
            ✕ clear
          </button>
        )}
      </div>

      {/* Paragraph list with color gutters */}
      <div className="space-y-0.5">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="group flex gap-3 rounded-md transition-colors duration-150 hover:bg-accent/40"
          >
            <div
              className="w-1 shrink-0 rounded-full mt-2 transition-all duration-200 group-hover:w-1.5"
              style={{ backgroundColor: HEATMAP_COLORS[p.category] }}
            />
            <div className="flex-1 min-w-0 py-1.5">
              <p className="text-xs leading-relaxed line-clamp-2 text-muted-foreground group-hover:text-foreground transition-colors duration-150">
                {p.text}
              </p>
            </div>
            <span
              className="heatmap-badge shrink-0 self-start mt-2 opacity-0 group-hover:opacity-100 transition-all duration-200"
              style={{
                backgroundColor: HEATMAP_COLORS[p.category] + '14',
                color: HEATMAP_COLORS[p.category],
              }}
            >
              {HEATMAP_LABELS[p.category]}
            </span>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-xs text-muted-foreground/60 text-center py-6">
          No paragraphs match this category filter.
        </div>
      )}
    </div>
  );
}
