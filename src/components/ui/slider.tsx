import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ className, value, onValueChange, min = 0, max = 100, step = 1 }, ref) => {
    const percentage = ((value[0] - min) / (max - min)) * 100;

    return (
      <div
        ref={ref}
        className={cn('relative flex w-full touch-none select-none items-center h-5', className)}
      >
        <div className="relative w-full h-2 rounded-full bg-secondary">
          <div
            className="absolute h-full rounded-full bg-primary transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={(e) => onValueChange([parseInt(e.target.value)])}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-primary bg-background shadow-sm pointer-events-none"
          style={{ left: `${percentage}%`, marginLeft: '-8px' }}
        />
      </div>
    );
  },
);
Slider.displayName = 'Slider';

export { Slider };
