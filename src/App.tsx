import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { PriceDataProvider } from './context/PriceDataContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DataDisclaimerBanner } from './components/DataDisclaimerBanner';
import { HomePage } from './pages/HomePage';
import { PricesPage } from './pages/PricesPage';
import { CropDetailPage } from './pages/CropDetailPage';
import { ComparePage } from './pages/ComparePage';
import { TrendsPage } from './pages/TrendsPage';
import { MarketsPage } from './pages/MarketsPage';
import { MarketDetailPage } from './pages/MarketDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';

const AppContent: React.FC = () => {
  const { path } = useRouter();

  const renderCurrentPage = () => {
    if (path === '/' || path === '') {
      return <HomePage />;
    }
    if (path === '/prices') {
      return <PricesPage />;
    }
    if (path.startsWith('/crops/')) {
      return <CropDetailPage />;
    }
    if (path === '/compare') {
      return <ComparePage />;
    }
    if (path === '/trends') {
      return <TrendsPage />;
    }
    if (path === '/markets') {
      return <MarketsPage />;
    }
    if (path.startsWith('/markets/')) {
      return <MarketDetailPage />;
    }
    if (path === '/about') {
      return <AboutPage />;
    }
    if (path === '/contact') {
      return <ContactPage />;
    }
    if (path === '/admin') {
      return <AdminPage />;
    }
    // Default fallback to Home
    return <HomePage />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8F3] text-stone-900 font-sans selection:bg-[#2E8B45]/20 selection:text-[#176B35]">
      <Header />
      <DataDisclaimerBanner />
      <main className="flex-1">
        {renderCurrentPage()}
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <PriceDataProvider>
        <RouterProvider>
          <AppContent />
        </RouterProvider>
      </PriceDataProvider>
    </LanguageProvider>
  );
}
