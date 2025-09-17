# 🚀 TourConnect Frontend-Backend Setup Guide

## Quick Start Instructions

### 1. Backend Setup

1. **Navigate to backend directory:**

   ```powershell
   cd "c:\Users\LENOVO\tourconnect-fe\backend"
   ```

2. **Install dependencies:**

   ```powershell
   npm install
   ```

3. **Setup environment variables:**

   ```powershell
   # Copy the environment template
   copy .env.example .env

   # Then edit .env file with your actual values
   notepad .env
   ```

4. **Setup database:**

   - Make sure MySQL is running on your system
   - Create a database named `tourconnect_db`
   - Import the SQL file: `mysql -u root -p tourconnect_db < database/Dump20250806.sql`

5. **Start the backend server:**
   ```powershell
   npm start
   # Or for development with auto-restart:
   npm run dev
   ```

### 2. Frontend Setup

1. **Navigate to frontend directory:**

   ```powershell
   cd "c:\Users\LENOVO\tourconnect-fe"
   ```

2. **Install dependencies:**

   ```powershell
   npm install
   ```

3. **Setup environment variables:**

   ```powershell
   # Copy the environment template
   copy .env.example .env

   # Then edit .env file with your actual values
   notepad .env
   ```

4. **Start the frontend server:**
   ```powershell
   npm start
   ```

### 3. Access the API Testing Dashboard

Once both servers are running:

1. **Frontend:** http://localhost:3000
2. **Backend:** http://localhost:5000
3. **API Test Dashboard:** http://localhost:3000/api-test

## 🧪 Testing Frontend-Backend Integration

### Manual Testing Steps:

1. **Start Backend Server:**

   ```powershell
   # In backend directory
   cd "c:\Users\LENOVO\tourconnect-fe\backend"
   npm start
   ```

   You should see: "Server running on http://localhost:5000"

2. **Start Frontend Server:**

   ```powershell
   # In frontend directory
   cd "c:\Users\LENOVO\tourconnect-fe"
   npm start
   ```

   Browser should open to: http://localhost:3000

3. **Test API Connection:**
   - Navigate to: http://localhost:3000/api-test
   - Click "Test Backend Health" - should show ✅ Backend Online
   - Click "Run All Backend Tests" to test all endpoints

### API Endpoints to Test:

| Endpoint             | Method | Purpose             | Test Status |
| -------------------- | ------ | ------------------- | ----------- |
| `/api/health`        | GET    | Health check        | ✅ Ready    |
| `/api/auth/login`    | POST   | User authentication | ✅ Ready    |
| `/api/auth/register` | POST   | User registration   | ✅ Ready    |
| `/api/guides`        | GET    | Get all guides      | ✅ Ready    |
| `/api/guides/:id`    | GET    | Get specific guide  | ✅ Ready    |
| `/api/bookings`      | GET    | Get user bookings   | ✅ Ready    |
| `/api/bookings`      | POST   | Create booking      | ✅ Ready    |

## 🔧 Configuration Checklist

### Backend Configuration (.env):

- [ ] Database connection (MySQL)
- [ ] JWT secret key
- [ ] Port configuration (5000)
- [ ] CORS allowed origins
- [ ] Email configuration (optional)

### Frontend Configuration (.env):

- [ ] API URL (http://localhost:5000)
- [ ] Google Maps API key (for maps)
- [ ] OpenAI API key (for AI features)
- [ ] MoMo payment configuration
- [ ] Frontend URL (http://localhost:3000)

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Errors:**

   - Make sure backend CORS is configured for frontend URL
   - Check that frontend API_URL points to correct backend

2. **Database Connection:**

   - Verify MySQL is running
   - Check database credentials in backend .env
   - Ensure database `tourconnect_db` exists

3. **API Key Issues:**

   - Check all API keys are properly set in .env files
   - Restart servers after changing environment variables

4. **Port Conflicts:**
   - Backend default: 5000
   - Frontend default: 3000
   - Change ports in .env if conflicts occur

### Testing Commands:

```powershell
# Test backend health directly
curl http://localhost:5000/api/health

# Check if backend is running
netstat -an | findstr :5000

# Check if frontend is running
netstat -an | findstr :3000
```

## 📝 Next Steps

1. **Database Setup:** Import the SQL dump file
2. **Environment Variables:** Configure all .env files
3. **API Testing:** Use the /api-test dashboard
4. **Authentication:** Test login/register flows
5. **Integration:** Test guide booking process

## 🔗 Important URLs

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API Documentation: http://localhost:5000/api-docs (if Swagger is configured)
- API Test Dashboard: http://localhost:3000/api-test
- Backend Health: http://localhost:5000/api/health

---

**Note:** Make sure both servers are running simultaneously for full functionality!
