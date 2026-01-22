import { useState, useCallback, useRef, useEffect } from 'react';
import { buildDFA, simulateDFA } from '@/lib/dfa';

/**
 * @typedef {Object} SimulationState
 * @property {boolean} isRunning - Whether simulation is currently running
 * @property {boolean} isPaused - Whether simulation is paused
 * @property {number} currentStep - Current step index in simulation
 * @property {number} speed - Milliseconds per step
 */

/**
 * Hook for managing DFA simulation state and controls
 * @param {string} pattern - The pattern to search for
 * @param {string} text - The text to search in
 * @returns {Object} DFA simulation state and control functions
 */
export function useDFASimulation(pattern, text) {
  const [dfa, setDfa] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [simulation, setSimulation] = useState({
    isRunning: false,
    isPaused: false,
    currentStep: -1,
    speed: 500,
  });
  
  const intervalRef = useRef(null);

  // Build DFA when pattern or text changes
  useEffect(() => {
    if (pattern) {
      // Build DFA with both pattern and text to include all characters in alphabet
      const newDfa = buildDFA(pattern, text);
      setDfa(newDfa);
      
      // Pre-compute all steps
      if (text) {
        const result = simulateDFA(pattern, text, newDfa.transitionTable, newDfa.alphabet);
        setMatchResult(result);
      } else {
        setMatchResult(null);
      }
    } else {
      setDfa(null);
      setMatchResult(null);
    }
    
    // Reset simulation
    setSimulation(prev => ({ ...prev, isRunning: false, isPaused: false, currentStep: -1 }));
  }, [pattern, text]);

  const startSimulation = useCallback(() => {
    if (!matchResult || matchResult.steps.length === 0) return;
    
    setSimulation(prev => ({
      ...prev,
      isRunning: true,
      isPaused: false,
      currentStep: prev.currentStep === matchResult.steps.length - 1 ? 0 : prev.currentStep + 1,
    }));
  }, [matchResult]);

  const pauseSimulation = useCallback(() => {
    setSimulation(prev => ({ ...prev, isPaused: true }));
  }, []);

  const resumeSimulation = useCallback(() => {
    setSimulation(prev => ({ ...prev, isPaused: false }));
  }, []);

  const resetSimulation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setSimulation(prev => ({ ...prev, isRunning: false, isPaused: false, currentStep: -1 }));
  }, []);

  const stepForward = useCallback(() => {
    if (!matchResult) return;
    setSimulation(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, matchResult.steps.length - 1),
    }));
  }, [matchResult]);

  const stepBackward = useCallback(() => {
    setSimulation(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, -1),
    }));
  }, []);

  const setSpeed = useCallback((speed) => {
    setSimulation(prev => ({ ...prev, speed }));
  }, []);

  const jumpToStep = useCallback((step) => {
    if (!matchResult) return;
    setSimulation(prev => ({
      ...prev,
      currentStep: Math.max(-1, Math.min(step, matchResult.steps.length - 1)),
    }));
  }, [matchResult]);

  // Auto-advance simulation
  useEffect(() => {
    if (simulation.isRunning && !simulation.isPaused && matchResult) {
      intervalRef.current = setInterval(() => {
        setSimulation(prev => {
          if (prev.currentStep >= matchResult.steps.length - 1) {
            return { ...prev, isRunning: false };
          }
          return { ...prev, currentStep: prev.currentStep + 1 };
        });
      }, simulation.speed);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [simulation.isRunning, simulation.isPaused, simulation.speed, matchResult]);

  const currentStepData = 
    matchResult && simulation.currentStep >= 0 
      ? matchResult.steps[simulation.currentStep] 
      : null;

  return {
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
  };
}