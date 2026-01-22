import React from 'react';
import { CheckCircle2, XCircle, Zap } from 'lucide-react';

/**
 * Match Results Component
 * @param {Object} props
 * @param {import('@/lib/dfa').MatchResult | null} props.matchResult - The match results
 * @param {string} props.pattern - The search pattern
 * @param {string} props.text - The search text
 * @param {boolean} props.simulationComplete - Whether simulation is complete
 */
export function MatchResults({ matchResult, pattern, text, simulationComplete }) {
  if (!matchResult || !simulationComplete) {
    return null;
  }

  const { matches, totalComparisons } = matchResult;

  return (
    <div className="space-y-4 animate-slide-in">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-muted/50 border border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            {matches.length > 0 ? (
              <CheckCircle2 className="h-4 w-4 text-success" />
            ) : (
              <XCircle className="h-4 w-4 text-destructive" />
            )}
            Matches Found
          </div>
          <div className="text-2xl font-bold">{matches.length}</div>
        </div>
        
        <div className="p-4 rounded-lg bg-muted/50 border border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Zap className="h-4 w-4 text-warning" />
            Comparisons
          </div>
          <div className="text-2xl font-bold">{totalComparisons}</div>
        </div>
        
        <div className="p-4 rounded-lg bg-muted/50 border border-border">
          <div className="text-sm text-muted-foreground mb-1">Time Complexity</div>
          <div className="text-2xl font-bold font-mono">O(n)</div>
          <div className="text-xs text-muted-foreground">n = {text.length}</div>
        </div>
      </div>

      {/* Match positions */}
      {matches.length > 0 && (
        <div className="p-4 rounded-lg bg-success/10 border border-success/30">
          <h4 className="font-semibold text-success mb-2">Pattern Found At Positions:</h4>
          <div className="flex flex-wrap gap-2">
            {matches.map((pos, idx) => (
              <span 
                key={idx}
                className="px-3 py-1 rounded-full bg-success/20 text-success font-mono text-sm font-medium"
              >
                Index {pos}
              </span>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            The pattern "{pattern}" was found {matches.length} time{matches.length !== 1 ? 's' : ''} in the text.
          </p>
        </div>
      )}

      {matches.length === 0 && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
          <h4 className="font-semibold text-destructive mb-2">No Matches Found</h4>
          <p className="text-sm text-muted-foreground">
            The pattern "{pattern}" does not appear in the given text.
          </p>
        </div>
      )}
    </div>
  );
}