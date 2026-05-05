import { createContext, useContext, useState, type ReactNode } from 'react';

// Minimal auth stub for the demo. The MVP doesn't need login/MFA/session
// expiry — we just expose a hardcoded user so the chrome can render avatars
// and "logged in" UI without dragging in a real auth layer.

interface DemoUser {
  id: string;
  email: string;
  fullName: string;
}

interface AuthContextType {
  user: DemoUser | null;
  signOut: () => void;
}

const DEMO_USER: DemoUser = {
  id: 'demo-mbi-user',
  email: 'demo@mbi.example.com',
  fullName: 'Demo User',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(DEMO_USER);

  const signOut = () => {
    setUser(null);
    // For MVP signOut is just visual — page reload signs back in.
    setTimeout(() => setUser(DEMO_USER), 250);
  };

  return (
    <AuthContext.Provider value={{ user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
