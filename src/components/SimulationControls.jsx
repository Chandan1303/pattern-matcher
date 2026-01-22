import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipBack, 
  SkipForward,
  FastForward
} from 'lucide-react';

/**
 * Simulation Controls Component
 * @param {Object} props
 * @param {boolean} props.isRunning - Whether simulation is running
 * @param {boolean} props.isPaused - Whether simulation is paused
 * @param {number} props.currentStep - Current step index
 * @param {number} props.totalSteps - Total number of steps
 * @param {number} props.speed - Speed in milliseconds per step
 * @param {() => void} props.onStart - Start simulation callback
 * @param {() => void} props.onPause - Pause simulation callback
 * @param {() => void} props.onResume - Resume simulation callback
 * @param {() => void} props.onReset - Reset simulation callback
 * @param {() => void} props.onStepForward - Step forward callback
 * @param {() => void} props.onStepBackward - Step backward callback
 * @param {(speed: number) => void} props.onSpeedChange - Speed change callback
 * @param {(step: number) => void} props.onJumpToStep - Jump to step callback
 * @param {boolean} props.disabled - Whether controls are disabled
 */
export function SimulationControls({
  isRunning,
  isPaused,
  currentStep,
  totalSteps,
  speed,
  onStart,
  onPause,
  onResume,
  onReset,
  onStepForward,
  onStepBackward,
  onSpeedChange,
  onJumpToStep,
  disabled,
}) {
  return (
    <div className="space-y-4">
      {/* Main controls */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <Button
          variant="outline"
          size="icon"
          onClick={onReset}
          disabled={disabled || currentStep === -1}
          title="Reset"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={onStepBackward}
          disabled={disabled || currentStep <= 0}
          title="Step Back"
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        
        {!isRunning || isPaused ? (
          <Button
            onClick={isRunning && isPaused ? onResume : onStart}
            disabled={disabled || (currentStep >= totalSteps - 1 && !isPaused)}
            className="px-6"
          >
            <Play className="h-4 w-4 mr-2" />
            {isPaused ? 'Resume' : 'Start'}
          </Button>
        ) : (
          <Button
            onClick={onPause}
            variant="secondary"
            className="px-6"
          >
            <Pause className="h-4 w-4 mr-2" />
            Pause
          </Button>
        )}
        
        <Button
          variant="outline"
          size="icon"
          onClick={onStepForward}
          disabled={disabled || currentStep >= totalSteps - 1}
          title="Step Forward"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => onJumpToStep(totalSteps - 1)}
          disabled={disabled || currentStep >= totalSteps - 1}
          title="Jump to End"
        >
          <FastForward className="h-4 w-4" />
        </Button>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground w-24">
          Step {currentStep + 1} / {totalSteps}
        </span>
        <Slider
          value={[currentStep]}
          min={-1}
          max={totalSteps - 1}
          step={1}
          onValueChange={([value]) => onJumpToStep(value)}
          className="flex-1"
          disabled={disabled}
        />
      </div>

      {/* Speed control */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground w-24">
          Speed: {(1000 / speed).toFixed(1)}x
        </span>
        <Slider
          value={[1000 - speed]}
          min={0}
          max={900}
          step={100}
          onValueChange={([value]) => onSpeedChange(1000 - value)}
          className="flex-1"
        />
        <span className="text-sm text-muted-foreground w-16">
          {speed}ms
        </span>
      </div>
    </div>
  );
}