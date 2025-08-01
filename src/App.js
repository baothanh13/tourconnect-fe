// src/App.js (Phiên bản đầy đủ đã được khôi phục)

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Import Authentication Context
import { AuthProvider } from "./contexts/AuthContext";

// Import các component từ các file riêng lẻ
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import GuidesListPage from "./pages/GuidesListPage";
import GuideDetailPage from "./pages/GuideDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />

          <main className="main-content">
            <Routes>
              {/* Các Route trỏ đến các component đã được import */}
              <Route path="/" element={<HomePage />} />
              <Route path="/guides" element={<GuidesListPage />} />
              <Route path="/guides/:id" element={<GuideDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
