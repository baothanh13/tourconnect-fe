import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "tourist", // Default to tourist
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await login(
        formData.email,
        formData.password,
        formData.userType
      );

      if (result.success) {
        // Redirect based on user type
        switch (result.user.userType) {
          case "admin":
            navigate("/admin/dashboard");
            break;
          case "guide":
            navigate("/guide/dashboard");
            break;
          case "support":
            navigate("/support/dashboard");
            break;
          default:
            navigate("/");
        }
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Login to TourConnect</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="userType">Account Type:</label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleInputChange}
              required
            >
              <option value="tourist">Tourist</option>
              <option value="guide">Tour Guide</option>
              <option value="support">Support Staff</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="login-links">
          <Link to="/register">Don't have an account? Register now</Link>
          <Link to="/">← Back to homepage</Link>
        </div>

        {/* Demo credentials for testing */}
        <div className="demo-credentials">
          <h4>Demo accounts:</h4>
          <p>
            <strong>Tourist:</strong> tourist@example.com / 123456
          </p>
          <p>
            <strong>Tour Guide:</strong> guide@example.com / 123456
          </p>
          <p>
            <strong>Admin:</strong> admin@tourconnect.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
