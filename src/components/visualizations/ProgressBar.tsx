import { useProgress } from '@/hooks/useProgress';
import { formatTime } from '@/utils';

/**
 * ProgressBar — Visual reading progress with time estimates
 */
export function ProgressBar() {
  const progress = useProgress();

  if (progress.chunksTotal === 0) {
    return (
      <div className="w-full h-2 rounded-full bg-secondary" />
    );
  }

  return (
    <div className="space-y-1">
      <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progress.percentComplete}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>
          {progress.chunksRead}/{progress.chunksTotal} chunks
        </span>
        <span>
          {progress.percentComplete}%
        </span>
        <span>
          ~{formatTime(progress.estimatedSecondsRemaining)} left
        </span>
      </div>
    </div>
  );
}
