import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { bookingsService } from "../../services/bookingsService";
import { guidesService } from "../../services/guidesService";
import Loading from "../Loading";
import { FaCheck, FaTimes, FaEye } from "react-icons/fa";
import "./GuideComponents.css";

const GuideBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.id) {
          const profile = await guidesService.getGuideByUserId(user.id);

          if (profile?.id) {
            const bookingsData = await bookingsService.getGuideBookings(
              profile.id
            );
            setBookings(bookingsData.bookings || []);
          }
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) return <Loading />;

  return (
    <div className="guide-bookings">
      <div className="page-header">
        <h1>My Bookings</h1>
      </div>

      {bookings.length > 0 ? (
        <div className="bookings-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Tourist</th>
                <th>People</th>
                <th>Status</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.date}</td>
                  <td>{booking.tourist_name || "Tourist"}</td>
                  <td>{booking.number_of_tourists}</td>
                  <td>
                    <span className={`status ${booking.status}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>${booking.total_price}</td>
                  <td>
                    <div className="actions">
                      <button className="btn-icon">
                        <FaEye />
                      </button>
                      {booking.status === "pending" && (
                        <>
                          <button className="btn-icon success">
                            <FaCheck />
                          </button>
                          <button className="btn-icon danger">
                            <FaTimes />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <p>No bookings yet.</p>
        </div>
      )}
    </div>
  );
};

export default GuideBookings;
