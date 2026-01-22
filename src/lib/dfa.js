// DFA Pattern Matching Engine
// Implements the Knuth-Morris-Pratt-style DFA construction for O(n) pattern matching

/**
 * @typedef {Object} DFAState
 * @property {number} id - State identifier
 * @property {boolean} isStart - Whether this is the start state
 * @property {boolean} isAccepting - Whether this is an accepting state
 * @property {string} label - Display label for the state
 */

/**
 * @typedef {Object} DFATransition
 * @property {number} from - Source state ID
 * @property {number} to - Target state ID
 * @property {string} char - Character that triggers this transition
 */

/**
 * @typedef {Object.<number, Object.<string, number>>} TransitionTable
 */

/**
 * @typedef {Object} SimulationStep
 * @property {number} charIndex - Index of current character in text
 * @property {string} char - Current character being processed
 * @property {number} fromState - State before transition
 * @property {number} toState - State after transition
 * @property {boolean} matched - Whether a match was found at this step
 * @property {number} [matchStart] - Starting index of match if found
 */

/**
 * @typedef {Object} DFAResult
 * @property {DFAState[]} states - Array of DFA states
 * @property {DFATransition[]} transitions - Array of transitions
 * @property {TransitionTable} transitionTable - Transition lookup table
 * @property {string[]} alphabet - Characters in the alphabet
 */

/**
 * @typedef {Object} MatchResult
 * @property {SimulationStep[]} steps - Array of simulation steps
 * @property {number[]} matches - Array of match starting positions
 * @property {number} totalComparisons - Total number of character comparisons
 */

// Compute the failure function (lps array) for the pattern
function computeFailureFunction(pattern) {
  const m = pattern.length;
  const lps = new Array(m).fill(0);
  let len = 0;
  let i = 1;

  while (i < m) {
    if (pattern[i] === pattern[len]) {
      len++;
      lps[i] = len;
      i++;
    } else {
      if (len !== 0) {
        len = lps[len - 1];
      } else {
        lps[i] = 0;
        i++;
      }
    }
  }

  return lps;
}

/**
 * Build the DFA from the pattern using KMP failure function
 * This creates a more efficient and cleaner DFA structure
 * @param {string} pattern - The pattern to build DFA for
 * @param {string} [text=''] - Optional text to include in alphabet
 * @returns {DFAResult} The constructed DFA
 */
export function buildDFA(pattern, text = '') {
  if (!pattern) {
    return {
      states: [{ id: 0, isStart: true, isAccepting: false, label: 'q0' }],
      transitions: [],
      transitionTable: { 0: {} },
      alphabet: [],
    };
  }

  const m = pattern.length;
  
  // Get alphabet from both pattern and text, with pattern characters first
  const alphabetSet = new Set();
  const patternChars = [];
  const otherChars = [];
  
  // Add pattern characters first (in order)
  for (const c of pattern) {
    if (c && c.trim() && !alphabetSet.has(c)) { // Filter out empty/whitespace chars
      alphabetSet.add(c);
      patternChars.push(c);
    }
  }
  
  // Add other characters from text
  for (const c of text) {
    if (c && c.trim() && !alphabetSet.has(c)) { // Filter out empty/whitespace chars
      alphabetSet.add(c);
      otherChars.push(c);
    }
  }
  
  // Combine: pattern chars first, then others sorted
  const alphabet = [...patternChars, ...otherChars.sort()];

  // Create states: 0 to m (m+1 states total)
  const states = [];
  for (let i = 0; i <= m; i++) {
    states.push({
      id: i,
      isStart: i === 0,
      isAccepting: i === m,
      label: `q${i}`,
    });
  }

  // Compute failure function for efficient DFA construction
  const failure = computeFailureFunction(pattern);

  // Build transition table
  const transitionTable = {};
  const transitions = [];

  for (let state = 0; state <= m; state++) {
    transitionTable[state] = {};
    
    for (const char of alphabet) {
      let nextState;
      
      if (state < m && pattern[state] === char) {
        // Matching character: advance to next state
        nextState = state + 1;
      } else if (state === m) {
        // We're in accepting state - self-loop for all characters
        // Once pattern is matched, stay in accepting state
        nextState = m;
      } else {
        // Mismatch: use failure function to find fallback state
        let k = state;
        while (k > 0 && pattern[k] !== char) {
          k = failure[k - 1];
        }
        nextState = (pattern[k] === char) ? k + 1 : 0;
      }
      
      transitionTable[state][char] = nextState;
      transitions.push({ from: state, to: nextState, char });
    }
  }

  return { states, transitions, transitionTable, alphabet };
}

/**
 * Simulate the DFA on the input text
 * @param {string} pattern - The pattern being matched
 * @param {string} text - The text to search in
 * @param {TransitionTable} transitionTable - The DFA transition table
 * @param {string[]} alphabet - The alphabet of valid characters
 * @returns {MatchResult} The simulation results
 */
export function simulateDFA(pattern, text, transitionTable, alphabet) {
  const steps = [];
  const matches = [];
  let currentState = 0;
  const m = pattern.length;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const fromState = currentState;
    
    // Check if character is in alphabet
    let toState;
    if (alphabet.includes(char)) {
      toState = transitionTable[currentState][char];
    } else {
      // Character not in pattern alphabet, reset to start
      toState = 0;
    }
    
    currentState = toState;
    
    const isMatch = currentState === m;
    if (isMatch) {
      matches.push(i - m + 1);
    }
    
    steps.push({
      charIndex: i,
      char,
      fromState,
      toState,
      matched: isMatch,
      matchStart: isMatch ? i - m + 1 : undefined,
    });
  }

  return {
    steps,
    matches,
    totalComparisons: text.length,
  };
}

/**
 * Get extended alphabet including text characters
 * @param {string} pattern - The pattern
 * @param {string} text - The text
 * @returns {string[]} Array of unique characters sorted
 */
export function getExtendedAlphabet(pattern, text) {
  const chars = new Set();
  for (const c of pattern) chars.add(c);
  for (const c of text) chars.add(c);
  return Array.from(chars).sort();
}