import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toursService } from "../services/toursService";
import { guidesService } from "../services/guidesService";
import { bookingsService } from "../services/bookingsService";
import Loading from "../components/Loading";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaExclamationTriangle
} from "react-icons/fa";
import "./GuideSchedule.css";

const GuideSchedule = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [guideProfile, setGuideProfile] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weeklyTours, setWeeklyTours] = useState([]);
  const [weekInfo, setWeekInfo] = useState({ start: "", end: "" });
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [autoRefresh] = useState(true);

  // Load guide profile and weekly tours
  useEffect(() => {
    const loadScheduleData = async () => {
      if (!user || !user.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get guide profile
        const profile = await guidesService.getGuideByUserId(user.id);
        if (!profile || !profile.id) {
          navigate("/guide/profile/create");
          return;
        }

        setGuideProfile(profile);

        // Load weekly tours
        await loadWeeklyTours(profile.id, currentDate);
      } catch (error) {
        setError(`Failed to load schedule: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadScheduleData();
  }, [user, navigate, currentDate]);

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, []);

  // Auto-refresh tours data every 5 minutes
  useEffect(() => {
    if (!autoRefresh || !guideProfile?.id) return;

    const refreshInterval = setInterval(async () => {
      try {
        await loadWeeklyTours(guideProfile.id, currentDate);
      } catch (error) {
        console.error("Auto-refresh failed:", error);
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(refreshInterval);
  }, [autoRefresh, guideProfile?.id, currentDate]);

  const loadWeeklyTours = async (guideId, date) => {
    try {
      const dateString = formatDateForAPI(date);
      console.log("Loading weekly tours for:", dateString, "guideId:", guideId);
      
      const response = await toursService.getToursByWeek(dateString, guideId);
      console.log("API Response:", response);
      
      setWeeklyTours(response.tours || []);
      setWeekInfo(response.week || { start: "", end: "" });
    } catch (error) {
      console.error("Error loading weekly tours:", error);
      setWeeklyTours([]);
      setWeekInfo({ start: "", end: "" });
    }
  };

  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };


  const formatTime = (timeString) => {
    if (!timeString) return "";
    return new Date(`2000-01-01 ${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getWeekDays = () => {
    // If weekInfo is not available, calculate from currentDate
    let startDate;
    
    if (weekInfo.start && weekInfo.start !== "") {
      startDate = new Date(weekInfo.start);
    } else {
      // Calculate Monday of the current week
      startDate = new Date(currentDate);
      const dayOfWeek = startDate.getDay();
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      startDate.setDate(startDate.getDate() + diffToMonday);
    }
    
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  const getToursForDay = (day) => {
    // Backend returns tour_date in MM-DD-YYYY format
    const month = String(day.getMonth() + 1).padStart(2, "0");
    const dayNum = String(day.getDate()).padStart(2, "0");
    const year = day.getFullYear();
    const backendDateFormat = `${month}-${dayNum}-${year}`;
    
    return weeklyTours.filter(tour => tour.tour_date === backendDateFormat);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "status-active";
      case "draft":
        return "status-draft";
      case "completed":
        return "status-completed";
      default:
        return "status-default";
    }
  };

  // Check if tour is currently happening
  const isTourHappening = (tour) => {
    if (!tour.tour_date || !tour.tour_time) return false;
    
    // Convert MM-DD-YYYY format to YYYY-MM-DD for Date constructor
    const [month, day, year] = tour.tour_date.split('-');
    const formattedDate = `${year}-${month}-${day}`;
    const tourDateTime = new Date(`${formattedDate} ${tour.tour_time}`);
    const now = currentTime;
    
    // Tour is happening if it's within 2 hours of start time
    const timeDiff = tourDateTime.getTime() - now.getTime();
    return timeDiff >= 0 && timeDiff <= 2 * 60 * 60 * 1000; // 2 hours in milliseconds
  };

  // Check if tour is upcoming today
  const isTourUpcoming = (tour) => {
    if (!tour.tour_date || !tour.tour_time) return false;
    
    // Convert MM-DD-YYYY format to YYYY-MM-DD for Date constructor
    const [month, day, year] = tour.tour_date.split('-');
    const formattedDate = `${year}-${month}-${day}`;
    const tourDateTime = new Date(`${formattedDate} ${tour.tour_time}`);
    const now = currentTime;
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tourDate = new Date(tourDateTime.getFullYear(), tourDateTime.getMonth(), tourDateTime.getDate());
    
    return tourDate.getTime() === today.getTime() && tourDateTime > now;
  };

  // Format current time for display
  const formatCurrentTime = () => {
    return currentTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  // Format current date for display
  const formatCurrentDate = () => {
    return currentTime.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="guide-schedule-page">
      {/* Header */}
      <div className="schedule-header">
        <div className="header-left">
          <button
            className="back-btn-guide"
            onClick={() => navigate("/guide/dashboard")}
          >
            <FaArrowLeft style={{ marginRight: "8px" }}/>
            Back to Dashboard
          </button>
          <div className="header-title">
            <h1>My Schedule</h1>
            <p>Manage your tour schedule and availability</p>
          </div>
        </div>
        
        <div className="header-actions">
          <div className="real-time-info">
            <div className="current-time">
              <FaClock />
              <span>{formatCurrentTime()}</span>
            </div>
            <div className="current-date">
              {formatCurrentDate()}
            </div>
          </div>
          <button className="today-btn" onClick={goToToday}>
              Today
            </button>
        </div>
      </div>

    

      {/* Error Message */}
      {error && (
        <div className="error-banner">
          <FaExclamationTriangle />
          <span>{error}</span>
        </div>
      )}

      {/* Schedule Grid */}
      <div className="schedule-grid">
        {getWeekDays().map((day, index) => {
          const dayTours = getToursForDay(day);
          // More reliable way to check if it's today
          const today = new Date();
          const isToday = day.getFullYear() === today.getFullYear() &&
                         day.getMonth() === today.getMonth() &&
                         day.getDate() === today.getDate();
          
          return (
            <div key={index} className={`day-column ${isToday ? "today" : ""}`}>
              <div className="day-header">
                <h3>{day.toLocaleDateString("en-US", { weekday: "short" })}</h3>
                <span className="day-number">{day.getDate()}</span>
                {isToday && <span className="today-badge">Today</span>}
              </div>
              
              <div className="day-tours">
                {dayTours.length > 0 ? (
                  dayTours.map((tour) => {
                    const isHappening = isTourHappening(tour);
                    const isUpcoming = isTourUpcoming(tour);
                    
                    return (
                      <div 
                        key={tour.id} 
                        className={`tour-card-guide ${getStatusColor(tour.status)} ${isHappening ? 'tour-happening' : ''} ${isUpcoming ? 'tour-upcoming' : ''}`}
                      >
                        <div className="tour-header-guide">
                          <h4 className="tour-title-guide">{tour.title}</h4>
                        </div>
                      
                      <div className="tour-details-guide">
                        <div className="tour-time-guide">
                          <FaClock />
                          <span>{formatTime(tour.tour_time)}</span>
                        </div>
                        
                      </div>
                      <div className="tour-category-guide">
                          <FaMapMarkerAlt />
                          <span>{tour.category}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="empty-day">
                    <FaCalendarAlt />
                    <p>No tours scheduled</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
     </div>


        <div className="summary-card">
          <div className="summary-stats">
              
            <button className="stat-btn"
              onClick={() => navigateWeek("prev")}
            >
              <FaArrowLeft />
            </button>
            <div className="stat">
              <span className="stat-number">{weeklyTours.length}</span>
              <span className="stat-label">Total Tours</span>
            </div> 
              <button className="stat-btn"
                  onClick={() => navigateWeek("next")}
                >
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
  );
};

export default GuideSchedule;
