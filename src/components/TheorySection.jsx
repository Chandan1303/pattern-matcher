import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { BookOpen, Cpu, Search, FileText, Shield, Code } from 'lucide-react';

export function TheorySection() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Understanding DFA Pattern Matching</h2>
        <p className="text-muted-foreground">
          Learn the theoretical foundations behind this efficient string matching algorithm
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-2">
        <AccordionItem value="background" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="font-semibold">Theoretical Background</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground space-y-4 pb-4">
            <p>
              A <strong>Deterministic Finite Automaton (DFA)</strong> is a mathematical model of computation 
              consisting of a finite set of states, an alphabet, transition functions, a start state, and 
              accepting states.
            </p>
            <p>
              For pattern matching, the DFA represents all possible states of pattern matching progress. 
              Each state corresponds to how many characters of the pattern have been matched so far.
            </p>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Formal Definition:</h4>
              <p className="font-mono text-sm">
                DFA = (Q, Σ, δ, q₀, F) where:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li><strong>Q</strong>: Set of states {'{q₀, q₁, ..., qₘ}'}</li>
                <li><strong>Σ</strong>: Input alphabet (characters in pattern)</li>
                <li><strong>δ</strong>: Transition function Q × Σ → Q</li>
                <li><strong>q₀</strong>: Start state (no characters matched)</li>
                <li><strong>F</strong>: Accepting states (pattern fully matched)</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="construction" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <Cpu className="h-5 w-5 text-primary" />
              <span className="font-semibold">DFA Construction Process</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground space-y-4 pb-4">
            <p>
              The DFA is constructed using the <strong>failure function</strong> (also known as the 
              prefix function or LPS array), which computes the longest proper prefix that is also a suffix.
            </p>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Construction Steps:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Create m+1 states for pattern of length m</li>
                <li>State i represents: "first i characters matched"</li>
                <li>Compute failure function for fallback transitions</li>
                <li>For each state and character, compute next state:
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>If character matches pattern[i], go to state i+1</li>
                    <li>Otherwise, use failure function to find fallback state</li>
                  </ul>
                </li>
              </ol>
            </div>
            <p className="text-sm">
              Time complexity: <strong className="font-mono">O(m × |Σ|)</strong> for construction, 
              where m is pattern length and |Σ| is alphabet size.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="simulation" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-primary" />
              <span className="font-semibold">Simulation Process</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground space-y-4 pb-4">
            <p>
              Once the DFA is built, simulation is straightforward: read input characters one by one, 
              follow transitions, and report matches when reaching the accepting state.
            </p>
            <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm">
              <pre className="whitespace-pre-wrap">
{`state = 0  // start state
for i = 0 to n-1:
    state = δ(state, text[i])
    if state == m:  // accepting state
        report match at position i-m+1`}
              </pre>
            </div>
            <p>
              <strong>Key Insight:</strong> Each character is processed exactly once, giving us 
              <strong className="font-mono"> O(n)</strong> time complexity regardless of the pattern.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="complexity" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <Code className="h-5 w-5 text-primary" />
              <span className="font-semibold">Time & Space Complexity</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground space-y-4 pb-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Time Complexity</h4>
                <ul className="space-y-2 text-sm">
                  <li><strong>Preprocessing:</strong> O(m × |Σ|)</li>
                  <li><strong>Matching:</strong> O(n)</li>
                  <li><strong>Total:</strong> O(m × |Σ| + n)</li>
                </ul>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Space Complexity</h4>
                <ul className="space-y-2 text-sm">
                  <li><strong>Transition Table:</strong> O(m × |Σ|)</li>
                  <li><strong>States:</strong> O(m)</li>
                </ul>
              </div>
            </div>
            <p className="text-sm">
              Compared to naive O(n×m) matching, DFA achieves linear time by never backtracking in the text.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="applications" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-semibold">Real-World Applications</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground space-y-4 pb-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <div>
                    <strong>Text Editors</strong>
                    <p className="text-sm">Find & Replace, syntax highlighting, search within files</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <div>
                    <strong>Search Engines</strong>
                    <p className="text-sm">Keyword matching, query processing, indexing</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <div>
                    <strong>Bioinformatics</strong>
                    <p className="text-sm">DNA sequence matching, genome analysis</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <div>
                    <strong>Plagiarism Detection</strong>
                    <p className="text-sm">Document similarity, content matching</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <div>
                    <strong>Network Security</strong>
                    <p className="text-sm">Intrusion detection, pattern-based filtering</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <div>
                    <strong>Compilers</strong>
                    <p className="text-sm">Lexical analysis, tokenization</p>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="comparison" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold">Comparison with Other Algorithms</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground space-y-4 pb-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Algorithm</th>
                    <th className="text-left py-2">Preprocessing</th>
                    <th className="text-left py-2">Matching</th>
                    <th className="text-left py-2">Space</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  <tr className="border-b">
                    <td className="py-2">Naive</td>
                    <td>O(1)</td>
                    <td>O(n×m)</td>
                    <td>O(1)</td>
                  </tr>
                  <tr className="border-b bg-primary/5">
                    <td className="py-2 font-bold">DFA</td>
                    <td>O(m×|Σ|)</td>
                    <td>O(n)</td>
                    <td>O(m×|Σ|)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">KMP</td>
                    <td>O(m)</td>
                    <td>O(n)</td>
                    <td>O(m)</td>
                  </tr>
                  <tr>
                    <td className="py-2">Boyer-Moore</td>
                    <td>O(m+|Σ|)</td>
                    <td>O(n/m) best</td>
                    <td>O(|Σ|)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm">
              DFA offers guaranteed O(n) matching with simple implementation, making it ideal for 
              scenarios with repeated searches using the same pattern.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}