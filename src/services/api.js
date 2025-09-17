class ApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
    this.token = localStorage.getItem("tourconnect_token"); // Fix: Use correct token key
  }

  // Set authorization token
  setAuthToken(token) {
    this.token = token;
    localStorage.setItem("tourconnect_token", token); // Fix: Use correct token key
  }

  // Remove authorization token
  removeAuthToken() {
    this.token = null;
    localStorage.removeItem("tourconnect_token"); // Fix: Use correct token key
  }

  // Get current token (refresh from localStorage if needed)
  getCurrentToken() {
    if (!this.token) {
      this.token = localStorage.getItem("tourconnect_token");
    }
    return this.token;
  }

  // Generic API request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    // Always get fresh token from localStorage
    const currentToken = this.getCurrentToken();

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(currentToken && { Authorization: `Bearer ${currentToken}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    return this.request(url, { method: "GET" });
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }

  // File upload
  async uploadFile(endpoint, file, additionalData = {}) {
    const formData = new FormData();
    formData.append("file", file);

    Object.keys(additionalData).forEach((key) => {
      formData.append(key, additionalData[key]);
    });

    return this.request(endpoint, {
      method: "POST",
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, browser will set it automatically
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    });
  }
}

const apiService = new ApiService();
export default apiService;
