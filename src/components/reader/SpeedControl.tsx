import { useReaderStore } from '@/store/readerStore';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import type { ChunkSize } from '@/types';

const WPM_PRESETS = [100, 200, 300, 400, 500, 750, 1000];
const CHUNK_OPTIONS: Array<{ value: ChunkSize; label: string }> = [
  { value: 'word', label: 'Word' },
  { value: '3word', label: '3 Words' },
  { value: 'phrase', label: 'Phrase' },
  { value: 'sentence', label: 'Sentence' },
];

export function SpeedControl() {
  const wpm = useReaderStore(s => s.wpm);
  const setWpm = useReaderStore(s => s.setWpm);
  const chunkSize = useReaderStore(s => s.chunkSize);
  const setChunkSize = useReaderStore(s => s.setChunkSize);

  return (
    <div className="flex items-center gap-4">
      {/* WPM Slider */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground w-8">WPM</span>
        <Slider
          value={[wpm]}
          onValueChange={([v]) => setWpm(v)}
          min={50}
          max={1500}
          step={10}
          className="w-24"
        />
        <span className="text-xs font-mono w-10 text-right">{wpm}</span>
      </div>

      {/* Preset buttons */}
      <div className="flex gap-1">
        {WPM_PRESETS.map((preset) => (
          <Button
            key={preset}
            variant={wpm === preset ? 'default' : 'ghost'}
            size="sm"
            className="text-[10px] px-1.5 h-6"
            onClick={() => setWpm(preset)}
          >
            {preset}
          </Button>
        ))}
      </div>

      {/* Chunk size selector */}
      <div className="flex gap-1 border-l pl-3 ml-2">
        {CHUNK_OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            variant={chunkSize === opt.value ? 'default' : 'ghost'}
            size="sm"
            className="text-[10px] px-1.5 h-6"
            onClick={() => setChunkSize(opt.value)}
          >
            {opt.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
