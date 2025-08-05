import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PaymentForm from '../components/payment/PaymentForm';
import ChatInterface from '../components/communication/ChatInterface';
import { mockGuides } from '../data/mockData';
import './BookingPage.css';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingStep, setBookingStep] = useState(1); // 1: Details, 2: Payment, 3: Confirmation
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    participants: 1,
    specialRequests: '',
    contactInfo: {
      phone: '',
      emergencyContact: ''
    }
  });
  const [showPayment, setShowPayment] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);

  useEffect(() => {
    // Load guide data
    const guideData = mockGuides.find(g => g.id === parseInt(id));
    if (guideData) {
      setGuide(guideData);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContactInfoChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value
      }
    }));
  };

  const calculateTotalPrice = () => {
    if (!guide) return 0;
    const basePrice = guide.pricePerDay || 100;
    const participants = bookingData.participants;
    return basePrice * participants;
  };

  const validateBookingDetails = () => {
    const errors = {};
    
    if (!bookingData.date) errors.date = 'Date is required';
    if (!bookingData.time) errors.time = 'Time is required';
    if (bookingData.participants < 1) errors.participants = 'At least 1 participant required';
    if (!bookingData.contactInfo.phone) errors.phone = 'Phone number is required';

    return errors;
  };

  const handleNextStep = () => {
    const errors = validateBookingDetails();
    if (Object.keys(errors).length === 0) {
      setBookingStep(2);
      setShowPayment(true);
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handlePaymentSuccess = (result) => {
    setPaymentResult(result);
    setShowPayment(false);
    setBookingStep(3);
    
    // Send confirmation notification
    alert(`Payment successful! Booking confirmed.\nTransaction ID: ${result.transactionId}`);
  };

  const handlePaymentError = (error) => {
    alert(`Payment failed: ${error.message}`);
    setShowPayment(false);
  };

  const handleChatWithGuide = () => {
    // Create or open chat with guide
    setShowChat(true);
    // Mock chat creation - in real app, this would create a proper chat
    setSelectedChat({
      id: `chat_${guide.id}_${user.id}`,
      participants: [guide.id, user.id],
      title: `Chat with ${guide.name}`,
      type: 'direct'
    });
  };

  const getAvailableTimes = () => {
    return [
      '08:00', '09:00', '10:00', '11:00', 
      '13:00', '14:00', '15:00', '16:00'
    ];
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading booking details...</p>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="error-container">
        <h2>Guide not found</h2>
        <button onClick={() => navigate('/guides')} className="btn-primary">
          Back to Guides
        </button>
      </div>
    );
  }

  const renderBookingDetails = () => (
    <div className="booking-details">
      <h3>Booking Details</h3>
      
      <div className="guide-summary">
        <img src={guide.avatar} alt={guide.name} className="guide-avatar" />
        <div className="guide-info">
          <h4>{guide.name}</h4>
          <p className="guide-location">📍 {guide.location}</p>
          <p className="guide-price">${guide.pricePerDay}/day</p>
          <div className="guide-rating">
            ⭐ {guide.rating} ({guide.reviews} reviews)
          </div>
        </div>
      </div>

      <div className="booking-form">
        <div className="form-group">
          <label>Select Date *</label>
          <input
            type="date"
            value={bookingData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            min={getMinDate()}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Select Time *</label>
          <select
            value={bookingData.time}
            onChange={(e) => handleInputChange('time', e.target.value)}
            className="form-input"
          >
            <option value="">Choose time</option>
            {getAvailableTimes().map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Number of Participants *</label>
          <div className="participants-selector">
            <button 
              type="button"
              onClick={() => handleInputChange('participants', Math.max(1, bookingData.participants - 1))}
              className="participant-btn"
            >
              -
            </button>
            <span className="participant-count">{bookingData.participants}</span>
            <button 
              type="button"
              onClick={() => handleInputChange('participants', bookingData.participants + 1)}
              className="participant-btn"
            >
              +
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Phone Number *</label>
          <input
            type="tel"
            value={bookingData.contactInfo.phone}
            onChange={(e) => handleContactInfoChange('phone', e.target.value)}
            placeholder="+84 123 456 789"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Emergency Contact</label>
          <input
            type="tel"
            value={bookingData.contactInfo.emergencyContact}
            onChange={(e) => handleContactInfoChange('emergencyContact', e.target.value)}
            placeholder="Emergency contact number"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Special Requests</label>
          <textarea
            value={bookingData.specialRequests}
            onChange={(e) => handleInputChange('specialRequests', e.target.value)}
            placeholder="Any special requirements or preferences..."
            className="form-textarea"
            rows="3"
          />
        </div>

        <div className="price-summary">
          <div className="price-breakdown">
            <div className="price-item">
              <span>Base price per participant:</span>
              <span>${guide.pricePerDay}</span>
            </div>
            <div className="price-item">
              <span>Number of participants:</span>
              <span>{bookingData.participants}</span>
            </div>
            <div className="price-item total">
              <span>Total Amount:</span>
              <span>${calculateTotalPrice()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="booking-confirmation">
      <div className="confirmation-header">
        <div className="success-icon">✅</div>
        <h2>Booking Confirmed!</h2>
        <p>Your tour has been successfully booked</p>
      </div>

      <div className="confirmation-details">
        <div className="confirmation-card">
          <h4>Booking Information</h4>
          <div className="detail-item">
            <span>Guide:</span>
            <span>{guide.name}</span>
          </div>
          <div className="detail-item">
            <span>Date:</span>
            <span>{bookingData.date}</span>
          </div>
          <div className="detail-item">
            <span>Time:</span>
            <span>{bookingData.time}</span>
          </div>
          <div className="detail-item">
            <span>Participants:</span>
            <span>{bookingData.participants}</span>
          </div>
          <div className="detail-item">
            <span>Total Paid:</span>
            <span>${calculateTotalPrice()}</span>
          </div>
        </div>

        {paymentResult && (
          <div className="confirmation-card">
            <h4>Payment Details</h4>
            <div className="detail-item">
              <span>Transaction ID:</span>
              <span>{paymentResult.transactionId}</span>
            </div>
            <div className="detail-item">
              <span>Payment Method:</span>
              <span>{paymentResult.paymentMethod}</span>
            </div>
            <div className="detail-item">
              <span>Payment Time:</span>
              <span>{new Date(paymentResult.timestamp).toLocaleString()}</span>
            </div>
          </div>
        )}

        <div className="confirmation-actions">
          <button 
            className="btn-secondary"
            onClick={handleChatWithGuide}
          >
            💬 Chat with Guide
          </button>
          <button 
            className="btn-primary"
            onClick={() => navigate('/tourist/dashboard')}
          >
            View My Bookings
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="booking-page">
      <div className="container">
        <div className="booking-header">
          <button 
            className="back-btn"
            onClick={() => navigate(`/guides/${id}`)}
          >
            ← Back to Guide
          </button>
          <h1>Book Your Tour</h1>
        </div>

        <div className="booking-steps">
          <div className={`step ${bookingStep >= 1 ? 'active' : ''} ${bookingStep > 1 ? 'completed' : ''}`}>
            <span>1</span>
            <label>Details</label>
          </div>
          <div className={`step ${bookingStep >= 2 ? 'active' : ''} ${bookingStep > 2 ? 'completed' : ''}`}>
            <span>2</span>
            <label>Payment</label>
          </div>
          <div className={`step ${bookingStep >= 3 ? 'active' : ''}`}>
            <span>3</span>
            <label>Confirmation</label>
          </div>
        </div>

        <div className="booking-content">
          {bookingStep === 1 && renderBookingDetails()}
          {bookingStep === 3 && renderConfirmation()}
        </div>

        {bookingStep === 1 && (
          <div className="booking-actions">
            <button 
              className="btn-secondary"
              onClick={handleChatWithGuide}
            >
              💬 Chat with Guide
            </button>
            <button 
              className="btn-primary"
              onClick={handleNextStep}
            >
              Continue to Payment
            </button>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="payment-modal">
          <PaymentForm
            bookingData={{
              id: `booking_${Date.now()}`,
              tourTitle: `Tour with ${guide.name}`,
              date: bookingData.date,
              participants: bookingData.participants,
              pricePerPerson: guide.pricePerDay,
              totalPrice: calculateTotalPrice(),
              customerEmail: user.email
            }}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
            onCancel={() => setShowPayment(false)}
          />
        </div>
      )}

      {/* Chat Interface */}
      {showChat && (
        <ChatInterface
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          selectedChat={selectedChat}
          onChatSelect={setSelectedChat}
        />
      )}
    </div>
  );
};

export default BookingPage;
