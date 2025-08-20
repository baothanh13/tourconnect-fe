import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { toursService } from "../../services/toursService";
import { guidesService } from "../../services/guidesService";
import Loading from "../Loading";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import "./GuideComponents.css";

const GuideTours = () => {
  const { user } = useAuth();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.id) {
          const profile = await guidesService.getGuideByUserId(user.id);

          if (profile?.id) {
            const toursData = await toursService.getToursByGuide(profile.id);
            setTours(toursData.tours || []);
          }
        }
      } catch (error) {
        console.error("Error fetching tours:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) return <Loading />;

  return (
    <div className="guide-tours">
      <div className="page-header">
        <h1>My Tours</h1>
        <button className="btn-primary">
          <FaPlus /> Create New Tour
        </button>
      </div>

      {tours.length > 0 ? (
        <div className="tours-grid">
          {tours.map((tour) => (
            <div key={tour.id} className="tour-card">
              <h3>{tour.title}</h3>
              <p>Price: ${tour.price}</p>
              <p>Duration: {tour.duration_hours} hours</p>
              <div className="tour-actions">
                <button className="btn-icon">
                  <FaEye />
                </button>
                <button className="btn-icon">
                  <FaEdit />
                </button>
                <button className="btn-icon">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>You haven't created any tours yet.</p>
          <button className="btn-primary">Create Your First Tour</button>
        </div>
      )}
    </div>
  );
};

export default GuideTours;
