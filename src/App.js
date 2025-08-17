import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Import your components and pages
import { AuthProvider } from "./contexts/AuthContext";
import PublicLayout from "./components/PublicLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import GuidesListPage from "./pages/GuidesListPage";
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
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* --- Public Routes with Public Layout --- */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="verify-otp" element={<VerifyOtpPage />} />
            <Route path="guides" element={<GuidesListPage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="help" element={<HelpCenterPage />} />
            <Route path="careers" element={<CareersPage />} />
            <Route path="book-tour" element={<BookTourPage />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="terms" element={<Terms />} />
            <Route path="privacy" element={<PrivacyPolicyPage />} />
            <Route path="become-guide" element={<BecomeGuide />} />
            <Route path="cancellation" element={<CancellationPolicyPage />} />
            <Route path="affiliates" element={<AffiliatesPage />} />
            <Route path="partnerships" element={<PartnershipsPage />} />
          </Route>

          {/* --- Protected Dashboard Routes --- */}
          {/* Tourist Dashboard */}
          <Route
            path="/tourist/dashboard"
            element={
              <ProtectedRoute allowedRoles={["tourist"]}>
                <TouristDashboard />
              </ProtectedRoute>
            }
          />

          {/* Guide Dashboard */}
          <Route
            path="/guide/dashboard"
            element={
              <ProtectedRoute allowedRoles={["guide"]}>
                <GuideDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Dashboard */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Support Dashboard */}
          <Route
            path="/support/dashboard"
            element={
              <ProtectedRoute allowedRoles={["support"]}>
                <SupportDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
