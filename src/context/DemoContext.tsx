import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { useDemoProfile } from './useDemoProfile';
import type { DemoStep } from '@/types/demo';

interface DemoContextType {
  currentStepIndex: number;
  /** undefined when the active profile has no steps yet (placeholder profile) */
  currentStep: DemoStep | undefined;
  steps: DemoStep[];
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  isDemoActive: boolean;
  setIsDemoActive: (active: boolean) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  isPaused: boolean;
  togglePause: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children }: { children: ReactNode }) {
  const { activeProfile } = useDemoProfile();
  const steps = activeProfile.steps;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isDemoActive, setIsDemoActive] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Reset step index when profile changes — keep isDemoActive as-is
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPaused(false);
  }, [activeProfile.id]);

  const togglePause = () => setIsPaused((prev) => !prev);

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStepIndex(index);
    }
  };

  return (
    <DemoContext.Provider
      value={{
        currentStepIndex,
        currentStep: steps[currentStepIndex],
        steps,
        nextStep,
        prevStep,
        goToStep,
        isDemoActive,
        setIsDemoActive,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isPaused,
        togglePause,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used within a DemoProvider');
  return ctx;
}
