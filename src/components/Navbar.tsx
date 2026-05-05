import { Bell, Sun, Moon } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  Button,
  useTheme,
} from 'strata-design-system';
import logoLightBrand from '@/assets/logo-light-brand.png';
import logoDarkBrand from '@/assets/logo-dark-brand.png';
import { useDemoProfile } from '@/context/useDemoProfile';
import { useAuth } from '@/context/AuthContext';

/**
 * Floating pill navbar — matches the demo-2026-strata visual pattern and the
 * `NavbarFloating` spec returned by the MCP at /components/navbar-floating:
 *   tokens: bg-card/80, backdrop-blur-xl, border-border, rounded-full,
 *           shadow-lg, dark:shadow-glow-md
 *
 * Active tab styling uses `bg-primary text-primary-foreground` — the semantic
 * token that resolves to brand-300 in light mode and brand-500 in dark mode
 * (per variables.css + variables-dark.css). Don't hard-code
 * `bg-brand-300 dark:bg-brand-500` here; the primary token already does that
 * and gives us the correct -foreground pair for accessibility.
 */

interface NavTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface NavbarProps {
  tabs?: NavTab[];
  activeTab?: string;
  onNavigate?: (tabId: string) => void;
}

const DEMO_USER = {
  name: 'Sara Chen',
  role: 'Account Manager',
  initials: 'SC',
};

export function Navbar({ tabs = [], activeTab, onNavigate }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { activeProfile } = useDemoProfile();
  const { user } = useAuth();
  const isDark = theme === 'dark';

  return (
    <div className="fixed top-6 left-0 right-0 z-[100] flex justify-center px-4 transition-all duration-300">
      <nav className="relative flex items-center justify-between gap-2 px-3 py-2 rounded-full bg-card/80 backdrop-blur-xl border border-border shadow-lg dark:shadow-glow-md w-full max-w-7xl transition-all duration-300">
        {/* Brand block — logo + DEALER EXPERIENCE / tenant subtitle */}
        <div className="flex items-center gap-3 shrink-0 pl-2">
          <img
            src={isDark ? logoDarkBrand : logoLightBrand}
            alt="Strata"
            className="h-8 w-auto"
          />
          <div className="hidden md:flex flex-col leading-tight">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Dealer Experience
            </span>
            <span className="text-sm font-bold text-foreground">
              {activeProfile.companyName}
            </span>
          </div>
        </div>

        {/* Center tabs */}
        {tabs.length > 0 && (
          <ul className="flex items-center gap-1">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <li key={tab.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate?.(tab.id)}
                    className={[
                      'flex items-center gap-2 h-9 px-4 rounded-full text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    ].join(' ')}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {/* Right actions */}
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            className="relative rounded-full"
          >
            <Bell className="size-4" />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-full"
          >
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>

          <div className="flex items-center gap-2 pl-2 ml-1 border-l border-border h-8">
            <Avatar size="sm">
              <AvatarFallback>{DEMO_USER.initials}</AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex flex-col leading-tight pr-2">
              <span className="text-xs font-semibold text-foreground">
                {user?.fullName ?? DEMO_USER.name}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {DEMO_USER.role}
              </span>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
