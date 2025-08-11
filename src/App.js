// src/App.js (Full version restored)

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Import Authentication Context
import { AuthProvider } from "./contexts/AuthContext";

// Import individual components from separate files
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import GuidesListPage from "./pages/GuidesListPage";
import GuideDetailPage from "./pages/GuideDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import GuideDashboard from "./pages/GuideDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import TouristDashboard from "./pages/TouristDashboard";
import SupportDashboard from "./pages/SupportDashboard";
import BookingPage from "./pages/BookingPage";

// Import new footer pages
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import BecomeGuide from "./pages/BecomeGuide";

// Import new additional pages
import BlogPage from "./pages/BlogPage";
import BookingProcessPage from "./pages/BookingProcessPage";
import CareersPage from "./pages/CareersPage";

// Import API Test Component
import ApiTest from "./components/ApiTest";
import HelpCenterPage from "./pages/HelpCenterPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <AuthProvider>
      <Router>
        <div className={`App ${sidebarOpen ? "sidebar-open" : ""}`}>
          <Header toggleSidebar={toggleSidebar} />
          <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

          <main className="main-content">
            <Routes>
              {/* Routes pointing to imported components */}
              <Route path="/" element={<HomePage />} />
              <Route path="/guides" element={<GuidesListPage />} />
              <Route path="/guides/:id" element={<GuideDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/guide/dashboard" element={<GuideDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/tourist/dashboard" element={<TouristDashboard />} />
              <Route path="/support/dashboard" element={<SupportDashboard />} />
              <Route path="/booking/:id" element={<BookingPage />} />

              {/* Footer pages */}
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/become-guide" element={<BecomeGuide />} />

              {/* Additional pages */}
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/book-tour" element={<BookingProcessPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/help" element={<HelpCenterPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />

              {/* API Testing */}
              <Route path="/api-test" element={<ApiTest />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
