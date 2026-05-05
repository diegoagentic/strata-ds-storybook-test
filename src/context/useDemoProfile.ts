import { useContext } from 'react';
import { DemoProfileContext } from './DemoProfileContext';

export function useDemoProfile() {
  const ctx = useContext(DemoProfileContext);
  if (!ctx)
    throw new Error('useDemoProfile must be used within DemoProfileProvider');
  return ctx;
}
