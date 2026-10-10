import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { PriceDataProvider } from './context/PriceDataContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DataDisclaimerBanner } from './components/DataDisclaimerBanner';
import { HomePage } from './pages/HomePage';
import { PricesPage } from './pages/PricesPage';
import { CropDirectoryPage } from './pages/CropDirectoryPage';
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
    if (path === '/directory') {
      return <CropDirectoryPage />;
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
    return <HomePage />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF2] dark:bg-[#071C11] text-stone-900 dark:text-stone-100 font-sans selection:bg-emerald-500/20 selection:text-emerald-900 transition-colors">
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
    <ThemeProvider>
      <LanguageProvider>
        <PriceDataProvider>
          <RouterProvider>
            <AppContent />
          </RouterProvider>
        </PriceDataProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
