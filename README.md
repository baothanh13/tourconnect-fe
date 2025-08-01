# TourConnect Frontend 🌍

A modern web application connecting tourists with local tour guides, built with React.js.

## 🌟 Overview

TourConnect is a comprehensive platform that bridges the gap between tourists seeking authentic local experiences and professional tour guides. The platform offers role-based functionality for tourists, guides, support staff, and administrators.

## 🚀 Features

### Authentication System
- **Multi-role login**: Tourist, Guide, Support Staff, Administrator
- **Dynamic registration**: Role-specific registration forms
- **Persistent sessions**: Stay logged in across browser sessions
- **Demo credentials**: Easy testing with predefined accounts

### Tourist Features
- Browse verified tour guides
- Advanced search and filtering
- View guide profiles and specialties
- Book tours (coming soon)
- Leave reviews (coming soon)

### Guide Features
- Profile management with specialties
- Availability scheduling (coming soon)
- Booking management (coming soon)
- Revenue tracking (coming soon)

### Admin Features
- User verification system (coming soon)
- Platform management (coming soon)
- Analytics dashboard (coming soon)

## 🛠️ Technology Stack

- **Frontend**: React 19.1.1
- **Routing**: React Router 6.26.2
- **State Management**: React Context API
- **Styling**: CSS3 with Grid and Flexbox
- **Development**: Create React App
- **Version Control**: Git & GitHub

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/baothanh13/tourconnect-fe.git
   cd tourconnect-fe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🧪 Demo Credentials

Test the application with these demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Tourist | `tourist@example.com` | `123456` |
| Guide | `guide@example.com` | `123456` |
| Admin | `admin@tourconnect.com` | `admin123` |

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.js       # Navigation header
│   ├── Footer.js       # Page footer
│   └── guide/          # Guide-specific components
├── contexts/           # React Context providers
│   └── AuthContext.js  # Authentication state management
├── pages/              # Page components
│   ├── HomePage.js     # Landing page
│   ├── LoginPage.js    # Authentication
│   ├── RegisterPage.js # User registration
│   ├── GuidesListPage.js # Guide browsing
│   └── GuideDetailPage.js # Individual guide profiles
├── data/               # Mock data and utilities
│   └── mockData.js     # Development data
├── App.js              # Main application component
├── App.css             # Global styles
└── index.js            # Application entry point
```

## 🔄 Development Roadmap

### Phase 1: Core Authentication ✅
- [x] Multi-role authentication system
- [x] User registration with role-specific forms
- [x] Dynamic header with user status
- [x] Comprehensive mock data structure

### Phase 2: Enhanced Search & Booking 🔄
- [ ] Advanced guide filtering
- [ ] Real-time availability checking
- [ ] Booking system implementation
- [ ] Payment integration (MoMo)

### Phase 3: Guide Management 📋
- [ ] Guide dashboard
- [ ] Schedule management
- [ ] Booking request handling
- [ ] Revenue tracking

### Phase 4: Admin & Support 📊
- [ ] Admin dashboard
- [ ] User verification system
- [ ] Support ticket system
- [ ] Analytics and reporting

### Phase 5: Advanced Features 🚀
- [ ] Real-time chat
- [ ] GPS tracking
- [ ] Mobile app (React Native)
- [ ] AI-powered recommendations

## 📄 Available Scripts

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🌐 System Requirements

### Functional Requirements
- **Tourists**: Search guides, book tours, make payments, leave reviews
- **Guides**: Manage profiles, handle bookings, receive payments
- **Support**: Assist users, handle disputes
- **Admin**: Verify guides, monitor platform, manage policies

### Non-Functional Requirements
- **Security**: OTP authentication, secure payments
- **Integration**: MoMo payments, Google Maps, SMS/Email notifications
- **Performance**: Fast loading, responsive design
- **Scalability**: Microservices architecture ready

## 🔗 Related Projects

- **Backend API**: Coming soon (Node.js + SQL Server)
- **Mobile App**: Planned (React Native)
- **Admin Panel**: Integrated in main app

## 📞 Contact

- **Project Owner**: Bao Thanh
- **GitHub**: [@baothanh13](https://github.com/baothanh13)
- **Repository**: [tourconnect-fe](https://github.com/baothanh13/tourconnect-fe)

## 📜 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React team for the amazing framework
- Create React App for the development setup
- All contributors and testers

---

**Built with ❤️ for authentic travel experiences**
