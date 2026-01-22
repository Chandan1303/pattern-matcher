import React from 'react';

/**
 * Text Visualization Component
 * @param {Object} props
 * @param {string} props.text - The text to visualize
 * @param {string} props.pattern - The search pattern
 * @param {import('@/lib/dfa').SimulationStep | null} props.currentStep - Current simulation step
 * @param {import('@/lib/dfa').MatchResult | null} props.matchResult - Match results
 * @param {number} props.currentStepIndex - Current step index
 */
export function TextVisualization({ 
  text, 
  pattern, 
  currentStep, 
  matchResult,
  currentStepIndex 
}) {
  if (!text) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Enter text to visualize the search
      </div>
    );
  }

  // Determine which characters have been matched in completed matches
  const matchedPositions = new Set();
  if (matchResult) {
    for (const match of matchResult.matches) {
      // Only highlight if we've passed this match in simulation
      const matchEndStep = matchResult.steps.findIndex(
        s => s.matchStart === match
      );
      if (currentStepIndex >= matchEndStep && matchEndStep !== -1) {
        for (let i = match; i < match + pattern.length; i++) {
          matchedPositions.add(i);
        }
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* Pattern display */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground w-16">Pattern:</span>
        <div className="flex gap-1 flex-wrap">
          {pattern.split('').map((char, idx) => (
            <div
              key={idx}
              className="char-box char-default"
            >
              {char}
            </div>
          ))}
        </div>
      </div>

      {/* Text display with current position highlighted */}
      <div className="flex items-start gap-3">
        <span className="text-sm font-medium text-muted-foreground w-16 pt-2">Text:</span>
        <div className="flex gap-1 flex-wrap">
          {text.split('').map((char, idx) => {
            const isCurrent = currentStep?.charIndex === idx;
            const isMatched = matchedPositions.has(idx);
            
            return (
              <div
                key={idx}
                className={`
                  char-box transition-all duration-200
                  ${isCurrent 
                    ? 'char-current scale-110 shadow-lg' 
                    : isMatched 
                      ? 'char-matched' 
                      : 'char-default'
                  }
                `}
              >
                {char}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current step info */}
      {currentStep && (
        <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-border animate-slide-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Position:</span>
              <span className="ml-2 font-mono font-semibold">{currentStep.charIndex}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Character:</span>
              <span className="ml-2 font-mono font-semibold">'{currentStep.char}'</span>
            </div>
            <div>
              <span className="text-muted-foreground">Transition:</span>
              <span className="ml-2 font-mono font-semibold">
                q{currentStep.fromState} → q{currentStep.toState}
              </span>
            </div>
            <div>
              {currentStep.matched && (
                <span className="inline-flex items-center gap-1 text-success font-semibold">
                  ✓ Match found at index {currentStep.matchStart}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}