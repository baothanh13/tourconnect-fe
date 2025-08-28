import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Import your components and pages
import { AuthProvider } from "./contexts/AuthContext";
import PublicLayout from "./components/PublicLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
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

// Guide components
import GuideTours from "./pages/GuideTours";
import CreateTour from "./pages/CreateTour";
import EditTour from "./pages/EditTour";
import TourDetail from "./pages/TourDetail";
import GuideBookings from "./components/guide/GuideBookings";
import GuideEarnings from "./components/guide/GuideEarnings";
import GuideProfile from "./components/guide/GuideProfile";
import GuideProfileForm from "./components/guide/GuideProfileForm";
import GuideManagement from "./components/guide/GuideManagement";
import FindGuideByUser from "./components/guide/FindGuideByUser";
import GuideProfileEditor from "./components/guide/GuideProfileEditor";

// Tourist components
import TouristBookings from "./components/tourist/TouristBookings";
import TouristReviews from "./components/tourist/TouristReviews";
import TouristProfile from "./components/tourist/TouristProfile";

import FAQ from "./pages/FAQ";
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
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="verify-otp" element={<VerifyOtpPage />} />
            <Route path="guides" element={<GuidesListPage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="faq" element={<FAQ />} />
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

          {/* Tourist Routes */}
          <Route
            path="/tourist/bookings"
            element={
              <ProtectedRoute allowedRoles={["tourist"]}>
                <TouristBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tourist/reviews"
            element={
              <ProtectedRoute allowedRoles={["tourist"]}>
                <TouristReviews />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tourist/profile"
            element={
              <ProtectedRoute allowedRoles={["tourist"]}>
                <TouristProfile />
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

          {/* Guide Routes */}
          <Route
            path="/guide/tours"
            element={
              <ProtectedRoute allowedRoles={["guide"]}>
                <GuideTours />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guide/tours/new"
            element={
              <ProtectedRoute allowedRoles={["guide"]}>
                <CreateTour />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guide/tours/:tourId/edit"
            element={
              <ProtectedRoute allowedRoles={["guide"]}>
                <EditTour />
              </ProtectedRoute>
            }
          />
          <Route path="/tours/:tourId" element={<TourDetail />} />
          <Route
            path="/guide/bookings"
            element={
              <ProtectedRoute allowedRoles={["guide"]}>
                <GuideBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guide/earnings"
            element={
              <ProtectedRoute allowedRoles={["guide"]}>
                <GuideEarnings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guide/profile"
            element={
              <ProtectedRoute allowedRoles={["guide"]}>
                <GuideProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guide/profile/create"
            element={
              <ProtectedRoute allowedRoles={["guide"]}>
                <GuideProfileForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guide/tours/new"
            element={
              <ProtectedRoute allowedRoles={["guide"]}>
                <div>Create New Tour - Coming Soon</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/guide/reviews"
            element={
              <ProtectedRoute allowedRoles={["guide"]}>
                <div>Reviews - Coming Soon</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/guide/activities"
            element={
              <ProtectedRoute allowedRoles={["guide"]}>
                <div>Activities - Coming Soon</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/guide/bookings/:id"
            element={
              <ProtectedRoute allowedRoles={["guide"]}>
                <div>Booking Details - Coming Soon</div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/guide/management"
            element={
              <ProtectedRoute allowedRoles={["guide", "admin"]}>
                <GuideManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guide/find-by-user"
            element={
              <ProtectedRoute allowedRoles={["guide", "admin"]}>
                <FindGuideByUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/guide/profile-editor"
            element={
              <ProtectedRoute allowedRoles={["guide", "admin"]}>
                <GuideProfileEditor />
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
