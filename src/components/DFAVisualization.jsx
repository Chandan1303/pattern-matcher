/**
 * @typedef {Object} TransitionGroup
 * @property {number} from - Source state ID
 * @property {number} to - Target state ID
 * @property {string[]} chars - Characters that trigger this transition
 */

/**
 * DFA Visualization Component
 * @param {Object} props
 * @param {import('@/lib/dfa').DFAResult} props.dfa - The DFA to visualize
 * @param {number} props.currentState - Currently active state
 * @param {import('@/lib/dfa').SimulationStep | null} props.currentStep - Current simulation step
 */
export function DFAVisualization({ dfa, currentState, currentStep }) {
  const { states, transitionTable, alphabet } = dfa;
  
  if (states.length <= 1 || alphabet.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Enter a pattern to visualize the DFA
      </div>
    );
  }

  // Group transitions by from-to state pairs (single line per pair)
  const transitionGroups = new Map();
  
  for (let state = 0; state < states.length; state++) {
    for (const char of alphabet) {
      const nextState = transitionTable[state]?.[char] ?? 0;
      const key = `${state}-${nextState}`;
      
      if (!transitionGroups.has(key)) {
        transitionGroups.set(key, {
          from: state,
          to: nextState,
          chars: []
        });
      }
      transitionGroups.get(key).chars.push(char);
    }
  }

  // Perfect layout calculations with improved spacing
  const stateSpacing = 140;
  const startX = 90;
  const centerY = 150;
  const stateRadius = 32;

  const getStateX = (stateId) => startX + stateId * stateSpacing;

  // Calculate single transition path for each state pair
  const getTransitionPath = (from, to) => {
    const x1 = getStateX(from);
    const x2 = getStateX(to);
    
    if (from === to) {
      // Self-loop
      const loopRadius = 40;
      return {
        path: `M ${x1 - 22} ${centerY - stateRadius + 3} 
               C ${x1} ${centerY - stateRadius - loopRadius}, 
                 ${x1} ${centerY - stateRadius - loopRadius}, 
                 ${x1 + 22} ${centerY - stateRadius + 3}`,
        labelX: x1,
        labelY: centerY - stateRadius - loopRadius - 5,
      };
    } else if (to > from) {
      // Forward transition
      return {
        path: `M ${x1 + stateRadius + 3} ${centerY} L ${x2 - stateRadius - 10} ${centerY}`,
        labelX: (x1 + x2) / 2,
        labelY: centerY - 15,
      };
    } else {
      // Backward transition
      const midX = (x1 + x2) / 2;
      const distance = Math.abs(from - to);
      const curveDepth = 70 + distance * 20;
      
      return {
        path: `M ${x1 - stateRadius * 0.7} ${centerY + stateRadius * 0.7}
               Q ${midX} ${centerY + curveDepth}, ${x2 + stateRadius * 0.7} ${centerY + stateRadius * 0.7}`,
        labelX: midX,
        labelY: centerY + curveDepth - 10,
      };
    }
  };

  return (
    <div className="w-full overflow-x-auto bg-white rounded-lg border">
      <svg 
        width={Math.max(750, states.length * stateSpacing + 140)} 
        height={450}
        className="min-w-full"
      >
        <defs>
          {/* Simple arrow markers */}
          <marker
            id="arrow"
            markerWidth="10"
            markerHeight="8"
            refX="9"
            refY="4"
            orient="auto"
          >
            <polygon 
              points="0 0, 10 4, 0 8" 
              className="fill-foreground" 
            />
          </marker>
          <marker
            id="arrow-active"
            markerWidth="10"
            markerHeight="8"
            refX="9"
            refY="4"
            orient="auto"
          >
            <polygon 
              points="0 0, 10 4, 0 8" 
              className="fill-primary" 
            />
          </marker>
          <marker
            id="arrow-success"
            markerWidth="10"
            markerHeight="8"
            refX="9"
            refY="4"
            orient="auto"
          >
            <polygon 
              points="0 0, 10 4, 0 8" 
              className="fill-success" 
            />
          </marker>
        </defs>

        {/* Simple start arrow */}
        <g>
          <line
            x1={startX - 50}
            y1={centerY}
            x2={startX - stateRadius - 8}
            y2={centerY}
            className="stroke-foreground"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
          <text
            x={startX - 55}
            y={centerY - 10}
            className="fill-foreground text-sm font-mono"
            textAnchor="middle"
          >
            start
          </text>
        </g>

        {/* Single transitions with comma-separated labels */}
        {Array.from(transitionGroups.values()).map((group) => {
          const { from, to, chars } = group;
          const { path, labelX, labelY } = getTransitionPath(from, to);
          
          // Check if any character in this transition is currently active
          const isActiveTransition = currentStep && 
            currentStep.fromState === from && 
            currentStep.toState === to;
          
          const isMatch = currentStep?.matched && isActiveTransition;
          
          // Create comma-separated label
          const label = chars.join(',');

          return (
            <g key={`${from}-${to}`}>
              {/* Single transition line */}
              <path
                d={path}
                fill="none"
                className={
                  isMatch 
                    ? 'stroke-success' 
                    : isActiveTransition 
                      ? 'stroke-primary' 
                      : 'stroke-foreground'
                }
                strokeWidth={isActiveTransition ? 2.5 : 2}
                markerEnd={
                  isMatch 
                    ? 'url(#arrow-success)' 
                    : isActiveTransition 
                      ? 'url(#arrow-active)' 
                      : 'url(#arrow)'
                }
              />
              
              {/* Comma-separated character labels */}
              <text
                x={labelX}
                y={labelY}
                className={`text-sm font-mono font-bold ${
                  isActiveTransition ? 'fill-primary' : 'fill-orange-500'
                }`}
                textAnchor="middle"
                style={{ 
                  fontSize: '14px',
                  textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
                }}
              >
                {label}
              </text>
            </g>
          );
        })}

        {/* States with clean, simple styling */}
        {states.map((state) => {
          const cx = getStateX(state.id);
          const isActive = currentState === state.id;
          const isAccepting = state.isAccepting;
          const isMatch = currentStep?.matched && currentState === state.id;

          return (
            <g key={state.id}>
              {/* Accepting state outer ring */}
              {isAccepting && (
                <circle
                  cx={cx}
                  cy={centerY}
                  r={stateRadius + 5}
                  fill="none"
                  className="stroke-foreground"
                  strokeWidth="2"
                />
              )}
              
              {/* Main state circle */}
              <circle
                cx={cx}
                cy={centerY}
                r={stateRadius}
                fill={
                  isMatch 
                    ? 'hsl(var(--success))' 
                    : isActive 
                      ? 'hsl(var(--primary))' 
                      : 'hsl(var(--background))'
                }
                className="stroke-foreground"
                strokeWidth="2"
              />
              
              {/* State label */}
              <text
                x={cx}
                y={centerY + 5}
                className={`text-base font-mono font-bold ${
                  isActive || isMatch ? 'fill-primary-foreground' : 'fill-foreground'
                }`}
                textAnchor="middle"
              >
                {state.label}
              </text>
            </g>
          );
        })}

        {/* Simple legend */}
        <g transform={`translate(${startX}, 380)`}>
          <circle cx={0} cy={0} r={7} className="fill-background stroke-foreground" strokeWidth="2" />
          <text x={16} y={3} className="fill-foreground text-xs">State</text>
          
          <circle cx={90} cy={0} r={7} className="fill-background stroke-foreground" strokeWidth="2" />
          <circle cx={90} cy={0} r={12} fill="none" className="stroke-foreground" strokeWidth="2" />
          <text x={106} y={3} className="fill-foreground text-xs">Accept</text>
          
          <circle cx={180} cy={0} r={7} className="fill-primary" />
          <text x={196} y={3} className="fill-foreground text-xs">Active</text>
        </g>
      </svg>
    </div>
  );
}