import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Import your components and pages
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import GuidesListPage from "./pages/GuidesListPage_new";
import BlogPage from "./pages/BlogPage";
import CareersPage from "./pages/CareersPage";
import HelpCenterPage from "./pages/HelpCenterPage";
import BookTourPage from "./pages/BookTourPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import BecomeGuide from "./pages/BecomeGuide";
import CancellationPolicyPage from "./pages/CancellationPolicyPage";
import AffiliatesPage from "./pages/AffiliatesPage";
import PartnershipsPage from "./pages/PartnershipsPage";
import GuideDashboard from "./pages/GuideDashboard";
import TouristDashboard from "./pages/TouristDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SupportDashboard from "./pages/SupportDashboard";
import ProtectedRoute from "./components/ProtectedRoute"; // Import the new component

function App() {
  // Your existing state and functions for sidebar, etc.
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <AuthProvider>
      <Router>
        <div className={`App ${sidebarOpen ? "sidebar-open" : ""}`}>
          <Header toggleSidebar={toggleSidebar} />
          <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

          <main className="main-content">
            <Routes>
              {/* --- Public Routes --- */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify-otp" element={<VerifyOtpPage />} />
              <Route path="/guides" element={<GuidesListPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/help" element={<HelpCenterPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/book-tour" element={<BookTourPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/become-guide" element={<BecomeGuide />} />
              <Route
                path="/cancellation"
                element={<CancellationPolicyPage />}
              />
              <Route path="/affiliates" element={<AffiliatesPage />} />
              <Route path="/partnerships" element={<PartnershipsPage />} />
              {/* Add other public routes like /about, /contact etc. here */}

              {/* --- Protected Routes --- */}

              {/* Tourist Dashboard */}
              <Route element={<ProtectedRoute allowedRoles={["tourist"]} />}>
                <Route
                  path="/tourist/dashboard"
                  element={<TouristDashboard />}
                />
              </Route>

              {/* Guide Dashboard */}
              <Route element={<ProtectedRoute allowedRoles={["guide"]} />}>
                <Route path="/guide/dashboard" element={<GuideDashboard />} />
              </Route>

              {/* Admin Dashboard */}
              <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Route>

              {/* Support Dashboard */}
              <Route element={<ProtectedRoute allowedRoles={["support"]} />}>
                <Route
                  path="/support/dashboard"
                  element={<SupportDashboard />}
                />
              </Route>

              {/* Fallback/Error Routes */}
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="*" element={<h1>404: Page Not Found</h1>} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
