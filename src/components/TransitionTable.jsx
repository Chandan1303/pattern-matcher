import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

/**
 * Transition Table Component
 * @param {Object} props
 * @param {import('@/lib/dfa').DFAResult} props.dfa - The DFA to display
 * @param {import('@/lib/dfa').SimulationStep | null} props.currentStep - Current simulation step
 */
export function TransitionTable({ dfa, currentStep }) {
  const { states, alphabet, transitionTable } = dfa;

  if (alphabet.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Enter a pattern to see the transition table
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-mono font-bold w-20">State</TableHead>
            {alphabet.map(char => (
              <TableHead key={char} className="font-mono font-bold text-center w-16">
                '{char}'
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {states.map(state => (
            <TableRow 
              key={state.id}
              className={`
                transition-colors duration-200
                ${currentStep?.fromState === state.id ? 'bg-primary/10' : ''}
              `}
            >
              <TableCell className="font-mono font-medium">
                <span className={`
                  inline-flex items-center gap-1
                  ${state.isStart ? 'text-primary' : ''}
                  ${state.isAccepting ? 'text-success font-bold' : ''}
                `}>
                  {state.label}
                  {state.isStart && <span className="text-xs">(start)</span>}
                  {state.isAccepting && <span className="text-xs">(accept)</span>}
                </span>
              </TableCell>
              {alphabet.map(char => {
                const nextState = transitionTable[state.id]?.[char] ?? 0;
                const isActiveTransition = 
                  currentStep?.fromState === state.id && 
                  currentStep?.char === char;
                
                return (
                  <TableCell 
                    key={char} 
                    className={`
                      font-mono text-center transition-all duration-200
                      ${isActiveTransition 
                        ? 'bg-primary text-primary-foreground font-bold scale-110' 
                        : ''
                      }
                    `}
                  >
                    q{nextState}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}