import { useState } from 'react';
import { Receipt, FileSearch, ArrowLeftRight } from 'lucide-react';
import { Navbar } from './components/Navbar';
import GenUIInputBar from './components/GenUIInputBar';
import DemoSidebar from './components/demo/DemoSidebar';
import DemoSpotlight from './components/demo/DemoSpotlight';
import DemoStepBanner from './components/demo/DemoStepBanner';
import DemoAIIndicator from './components/demo/DemoAIIndicator';
import MBIOverviewPage from './components/mbi/MBIOverviewPage';
import MBIAccountingPage from './components/mbi/MBIAccountingPage';
import MBIQuotesPage from './components/mbi/MBIQuotesPage';
import MBITransactionsPage from './components/mbi/MBITransactionsPage';
import { useDemo } from '@/context/DemoContext';

// MBI-only navigation for the MVP. v1 source: src/App.tsx getSimulationConfig().
const MBI_NAV_TABS = [
  {
    id: 'mbi-accounting',
    label: 'Accounting AI',
    icon: <Receipt className="size-4" />,
  },
  {
    id: 'mbi-quotes',
    label: 'Quotes AI',
    icon: <FileSearch className="size-4" />,
  },
  {
    id: 'mbi-transactions',
    label: 'Transactions',
    icon: <ArrowLeftRight className="size-4" />,
  },
];

const DEFAULT_PAGE = 'mbi-overview';

export default function App() {
  const { isDemoActive, currentStep, isSidebarCollapsed } = useDemo();
  const [currentPage, setCurrentPage] = useState<string>(DEFAULT_PAGE);

  // Two modes:
  //  - !isDemoActive  → free navigation, currentPage drives rendering
  //  - isDemoActive   → currentStep.app from DemoContext drives rendering
  const activePage = isDemoActive ? (currentStep?.app ?? DEFAULT_PAGE) : currentPage;

  // Map page ids to nav tab id for the navbar pill highlight.
  // mbi-overview is the home (no tab pill highlighted).
  const activeTab = MBI_NAV_TABS.some((t) => t.id === activePage)
    ? activePage
    : undefined;

  // Push main content right when the expanded DemoSidebar is showing.
  const showExpandedSidebar = isDemoActive && !isSidebarCollapsed;

  const handleNavigate = (id: string) => {
    if (!isDemoActive) setCurrentPage(id);
  };

  return (
    <>
      {/* Always-mounted demo chrome — DemoSidebar self-renders the right state */}
      <DemoSidebar />
      <DemoSpotlight />
      <DemoStepBanner />

      {/* Always-mounted AI prompt bar — auto-hides during the demo flow */}
      <GenUIInputBar />

      {/* Top navbar — visible in both modes */}
      <Navbar
        tabs={MBI_NAV_TABS}
        activeTab={activeTab}
        onNavigate={handleNavigate}
      />

      {/* Main viewport — pt-24 to clear the floating pill navbar (top-6 + h~16) */}
      <main
        className={[
          'min-h-screen pt-24 transition-all duration-300 bg-background',
          showExpandedSidebar ? 'pl-80' : '',
        ].join(' ')}
      >
        {isDemoActive && <DemoAIIndicator />}
        {renderPage(activePage, handleNavigate)}
      </main>
    </>
  );
}

function renderPage(page: string, onNavigate: (id: string) => void) {
  switch (page) {
    case 'mbi-overview':
      return <MBIOverviewPage onNavigate={onNavigate} />;
    case 'mbi-accounting':
      return <MBIAccountingPage />;
    case 'mbi-quotes':
      return <MBIQuotesPage />;
    case 'mbi-transactions':
      return <MBITransactionsPage />;
    case 'mbi-budget':
    case 'mbi-design':
      // Stubbed — out of scope for MVP per Apr 27 stakeholder direction.
      return <ComingSoon page={page} />;
    default:
      return <UnknownPage page={page} />;
  }
}

function ComingSoon({ page }: { page: string }) {
  return (
    <section className="p-12 max-w-2xl mx-auto">
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {page} — out of MVP scope
        </h1>
        <p className="text-muted-foreground text-sm">
          MBIBudgetPage and MBIDesignPage exist in v1 history but are not part of the
          April-23 active demo tour. Available for future phases.
        </p>
      </div>
    </section>
  );
}

function UnknownPage({ page }: { page: string }) {
  return (
    <section className="p-12 max-w-2xl mx-auto">
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Unknown page: <code className="font-mono text-base">{page}</code>
        </h1>
        <p className="text-muted-foreground text-sm">
          The router does not have a case for this page id. Check the demo profile's
          step.app values or the navbar tab ids.
        </p>
      </div>
    </section>
  );
}
