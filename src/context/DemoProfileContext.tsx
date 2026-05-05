import { createContext, useState, useEffect, type ReactNode } from 'react';
import type { DemoProfile, DemoProfileId } from '@/types/demo';
import { DEMO_PROFILES, DEFAULT_PROFILE_ID } from '@/config/demoProfiles';

export interface DemoProfileContextType {
  activeProfile: DemoProfile;
  profiles: DemoProfile[];
  switchProfile: (id: DemoProfileId) => void;
}

// Exported so the hook (in useDemoProfile.ts) can subscribe. Splitting the
// hook into its own module keeps this file as a pure component file, which
// is what Vite's Fast Refresh requires.
export const DemoProfileContext = createContext<
  DemoProfileContextType | undefined
>(undefined);

const STORAGE_KEY = 'demo-profile';

export function DemoProfileProvider({ children }: { children: ReactNode }) {
  const [activeProfileId, setActiveProfileId] = useState<DemoProfileId>(
    () =>
      (localStorage.getItem(STORAGE_KEY) as DemoProfileId | null) ??
      DEFAULT_PROFILE_ID,
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, activeProfileId);
  }, [activeProfileId]);

  const activeProfile =
    DEMO_PROFILES.find((p) => p.id === activeProfileId) ?? DEMO_PROFILES[0];

  const switchProfile = (id: DemoProfileId) => {
    setActiveProfileId(id);
  };

  return (
    <DemoProfileContext.Provider
      value={{
        activeProfile,
        profiles: DEMO_PROFILES,
        switchProfile,
      }}
    >
      {children}
    </DemoProfileContext.Provider>
  );
}
