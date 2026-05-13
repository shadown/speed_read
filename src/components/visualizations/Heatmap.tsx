import { useDocumentStore } from '@/store/documentStore';
import { HEATMAP_COLORS, HEATMAP_LABELS, type HeatmapCategory } from '@/types';
import { useState } from 'react';

/**
 * Heatmap — Visual category overlay on document paragraphs.
 * Shows colored indicators in the gutter and category badges on each paragraph.
 */
export function Heatmap() {
  const paragraphs = useDocumentStore(s => s.paragraphs);
  const heatmap = useDocumentStore(s => s.aiHeatmap);
  const [filterCategory, setFilterCategory] = useState<HeatmapCategory | null>(null);

  const categories = Object.keys(HEATMAP_LABELS) as HeatmapCategory[];
  const hasHeatmap = heatmap && heatmap.length > 0;

  const filteredParagraphs = filterCategory
    ? paragraphs.filter(p => p.category === filterCategory)
    : paragraphs;

  // Category filter pills
  const CategoryFilter = () => (
    <div className="flex flex-wrap gap-1.5 mb-4">
      {categories.map((cat) => {
        const count = paragraphs.filter(p => p.category === cat).length;
        const isActive = filterCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => setFilterCategory(isActive ? null : cat)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium transition-all
              ${isActive ? 'ring-2 ring-offset-1 ring-offset-background' : 'opacity-60 hover:opacity-100'}`}
            style={{
              backgroundColor: HEATMAP_COLORS[cat] + '20',
              color: HEATMAP_COLORS[cat],
              border: `1px solid ${HEATMAP_COLORS[cat]}40`,
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: HEATMAP_COLORS[cat] }} />
            {HEATMAP_LABELS[cat]}
            <span className="opacity-60">({count})</span>
          </button>
        );
      })}
      {filterCategory && (
        <button
          onClick={() => setFilterCategory(null)}
          className="text-[10px] text-muted-foreground hover:text-foreground px-1"
        >
          Clear filter
        </button>
      )}
    </div>
  );

  if (!hasHeatmap) {
    return (
      <div className="space-y-4">
        <CategoryFilter />
        <div className="text-xs text-muted-foreground text-center py-8">
          {paragraphs.length > 0
            ? 'Run AI analysis to see content heatmap categories'
            : 'No content loaded'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <CategoryFilter />

      <div className="space-y-2">
        {filteredParagraphs.map((p) => {
          const color = HEATMAP_COLORS[p.category];
          const label = HEATMAP_LABELS[p.category];

          return (
            <div
              key={p.id}
              className="flex gap-3 rounded-md transition-colors hover:bg-accent/50 group"
            >
              {/* Color gutter */}
              <div
                className="w-1 shrink-0 rounded-full"
                style={{ backgroundColor: color }}
              />

              {/* Content */}
              <div className="flex-1 min-w-0 py-1">
                <p className="text-xs leading-relaxed line-clamp-3">
                  {p.text}
                </p>
              </div>

              {/* Badge */}
              <div className="shrink-0 flex items-start pt-1.5">
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    backgroundColor: color + '20',
                    color: color,
                  }}
                >
                  {label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredParagraphs.length === 0 && (
        <div className="text-xs text-muted-foreground text-center py-4">
          No paragraphs match this filter
        </div>
      )}
    </div>
  );
}
