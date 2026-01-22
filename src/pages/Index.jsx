import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DFAVisualization } from '@/components/DFAVisualization';
import { TransitionTable } from '@/components/TransitionTable';
import { TextVisualization } from '@/components/TextVisualization';
import { SimulationControls } from '@/components/SimulationControls';
import { MatchResults } from '@/components/MatchResults';
import { TheorySection } from '@/components/TheorySection';
import { useDFASimulation } from '@/hooks/useDFASimulation';
import { Search, GitBranch, Table2, BookOpen } from 'lucide-react';

const Index = () => {
  const [pattern, setPattern] = useState('unity');
  const [text, setText] = useState('university');
  
  const {
    dfa,
    matchResult,
    simulation,
    currentStepData,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    resetSimulation,
    stepForward,
    stepBackward,
    setSpeed,
    jumpToStep,
  } = useDFASimulation(pattern, text);

  const currentState = currentStepData?.toState ?? 0;
  const simulationComplete = matchResult ? simulation.currentStep >= matchResult.steps.length - 1 : false;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">DFA Pattern Matcher</h1>
              <p className="text-sm text-muted-foreground">
                String Pattern Matching using Deterministic Finite Automata
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Input Section */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Input Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pattern" className="text-sm font-medium">
                  Pattern to Search
                </Label>
                <Input
                  id="pattern"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="Enter pattern (e.g., aba)"
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Length: {pattern.length} characters
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="text" className="text-sm font-medium">
                  Text to Search In
                </Label>
                <Input
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter text (e.g., abababaabab)"
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Length: {text.length} characters
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visualization Tabs */}
        <Tabs defaultValue="diagram" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="diagram" className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              <span className="hidden sm:inline">DFA Diagram</span>
              <span className="sm:hidden">Diagram</span>
            </TabsTrigger>
            <TabsTrigger value="table" className="flex items-center gap-2">
              <Table2 className="h-4 w-4" />
              <span className="hidden sm:inline">Transition Table</span>
              <span className="sm:hidden">Table</span>
            </TabsTrigger>
            <TabsTrigger value="theory" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Theory</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="diagram" className="mt-6 space-y-6">
            {/* DFA Visualization */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5 text-primary" />
                  DFA State Diagram
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dfa ? (
                  <DFAVisualization 
                    dfa={dfa} 
                    currentState={currentState}
                    currentStep={currentStepData}
                  />
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Enter a pattern to visualize the DFA
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Text Visualization */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Text Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <TextVisualization
                  text={text}
                  pattern={pattern}
                  currentStep={currentStepData}
                  matchResult={matchResult}
                  currentStepIndex={simulation.currentStep}
                />
              </CardContent>
            </Card>

            {/* Simulation Controls */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Simulation Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <SimulationControls
                  isRunning={simulation.isRunning}
                  isPaused={simulation.isPaused}
                  currentStep={simulation.currentStep}
                  totalSteps={matchResult?.steps.length ?? 0}
                  speed={simulation.speed}
                  onStart={startSimulation}
                  onPause={pauseSimulation}
                  onResume={resumeSimulation}
                  onReset={resetSimulation}
                  onStepForward={stepForward}
                  onStepBackward={stepBackward}
                  onSpeedChange={setSpeed}
                  onJumpToStep={jumpToStep}
                  disabled={!pattern || !text}
                />
              </CardContent>
            </Card>

            {/* Results */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Results</CardTitle>
              </CardHeader>
              <CardContent>
                <MatchResults
                  matchResult={matchResult}
                  pattern={pattern}
                  text={text}
                  simulationComplete={simulationComplete}
                />
                {!simulationComplete && (
                  <p className="text-center text-muted-foreground py-4">
                    Run the simulation to see results
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="table" className="mt-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Table2 className="h-5 w-5 text-primary" />
                  Transition Table
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dfa ? (
                  <TransitionTable 
                    dfa={dfa} 
                    currentStep={currentStepData}
                  />
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Enter a pattern to see the transition table
                  </p>
                )}
              </CardContent>
            </Card>

            {dfa && dfa.alphabet.length > 0 && (
              <Card className="glass-card mt-6">
                <CardHeader>
                  <CardTitle>Table Explanation</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-2">
                  <p>
                    The transition table δ(state, character) → next_state shows how the DFA 
                    moves between states when reading each character.
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Rows</strong>: Current state (q0 = start, q{pattern.length} = accept)</li>
                    <li><strong>Columns</strong>: Input characters from the pattern alphabet</li>
                    <li><strong>Cells</strong>: Next state after reading that character</li>
                  </ul>
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                      💡 Why does the accepting state have a self-loop?
                    </p>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Once the pattern is found, the DFA stays in the accepting state (q{pattern.length}) for all subsequent characters. 
                      This represents that the pattern matching goal has been achieved. The self-loop on all alphabet symbols 
                      shows that the automaton remains in the "success" state regardless of what follows.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="theory" className="mt-6">
            <Card className="glass-card">
              <CardContent className="pt-6">
                <TheorySection />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            DFA Pattern Matcher • O(n) String Matching Algorithm Visualizer
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;