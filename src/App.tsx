import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Toaster } from "./components/ui/toaster";
import DashboardPage from "./pages/DashboardPage";
import AIControlPage from "./pages/AIControlPage";
import PropertiesPage from "./pages/cms/PropertiesPage";
import LeadsPage from "./pages/crm/LeadsPage";
import BlogManagementPage from "./pages/blog/BlogManagementPage";
import ContentResearchPage from "./pages/blog/ContentResearchPage";
import BatchJobsPage from "./pages/blog/BatchJobsPage";
import { MainLayout } from "./components/layout/MainLayout";

import { PublicLayout } from "./components/layout/PublicLayout";
import HomePage from "./pages/public/HomePage";
import PropertiesPagePublic from "./pages/public/PropertiesPage";
import AboutPage from "./pages/public/AboutPage";
import ContactPage from "./pages/public/ContactPage";
import PropertyDetailsPage from "./pages/public/PropertyDetailsPage";

function App() {
  return (
    <ThemeProvider>
      <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/properties" element={<PublicLayout><PropertiesPagePublic /></PublicLayout>} />
          <Route path="/properties/:id" element={<PublicLayout><PropertyDetailsPage /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />

          {/* Admin Routes */}
          <Route path="/dashboard" element={<MainLayout><DashboardPage /></MainLayout>} />
          <Route path="/ai-control" element={<AIControlPage />} /> {/* Has internal layout */}
          <Route path="/cms/properties" element={<PropertiesPage />} /> {/* Has internal layout */}
          <Route path="/cms/agents" element={<PropertiesPage />} />
          <Route path="/cms/pages" element={<PropertiesPage />} />
          <Route path="/crm/leads" element={<LeadsPage />} /> {/* Has internal layout */}
          <Route path="/crm/deals" element={<LeadsPage />} />
          <Route path="/crm/pipeline" element={<LeadsPage />} />

          {/* Blog Routes wrapped in MainLayout */}
          <Route path="/blog/*" element={
            <MainLayout>
              <Routes>
                <Route path="posts" element={<BlogManagementPage />} />
                <Route path="research" element={<ContentResearchPage />} />
                <Route path="jobs" element={<BatchJobsPage />} />
              </Routes>
            </MainLayout>
          } />

          <Route path="/users" element={<LeadsPage />} />
          <Route path="/settings" element={<LeadsPage />} />
        </Routes>
      </Suspense>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;