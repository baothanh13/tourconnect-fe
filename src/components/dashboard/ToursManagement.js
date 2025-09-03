import React, { useState, useEffect, useCallback } from "react";
import { toursService } from "../../services/toursService";
import Loading from "../Loading";
import {
  FaEye,
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaInfoCircle,
  FaTrash
} from "react-icons/fa";
import "./ToursManagement.css";

const ToursManagement = () => {
  const [allTours, setAllTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    search: "",
  });
  const [selectedTour, setSelectedTour] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
  });

  const fetchTours = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      };

      const data = await toursService.getAllTours(params);

      // Handle different response formats
      let toursData = [];
      if (Array.isArray(data)) {
        toursData = data;
      } else if (data.tours && Array.isArray(data.tours)) {
        toursData = data.tours;
      } else if (data.data && Array.isArray(data.data)) {
        toursData = data.data;
      } else {
        toursData = [];
      }

      setAllTours(toursData);
      setFilteredTours(toursData);
      setPagination(prev => ({
        ...prev,
        total: data.total || toursData.length,
      }));
    } catch (error) {
      console.error("Failed to fetch tours:", error);
      alert("Failed to fetch tours. Please check your connection.");
      setAllTours([]);
      setFilteredTours([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  // Filter tours based on search and category
  const applyFilters = useCallback(() => {
    let filtered = allTours;

    // Filter by search term (title, description, guide name, tour ID)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (tour) =>
          tour.title?.toLowerCase().includes(searchTerm) ||
          tour.description?.toLowerCase().includes(searchTerm) ||
          tour.guide_name?.toLowerCase().includes(searchTerm) ||
          tour.id?.toLowerCase().includes(searchTerm) ||
          tour.guide_id?.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(
        (tour) => tour.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    setFilteredTours(filtered);
  }, [allTours, filters]);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleViewTour = (tour) => {
    setSelectedTour(tour);
    setShowModal(true);
  };

  const handleDeleteTour = async (tourId) => {
    if (window.confirm("Are you sure you want to delete this tour? This action cannot be undone.")) {
      try {
        await toursService.deleteTour(tourId);
        // Refresh tours after deletion
        fetchTours();
        alert("Tour deleted successfully!");
      } catch (error) {
        console.error("Failed to delete tour:", error);
        alert("Failed to delete tour. Please try again.");
      }
    }
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case "adventure":
        return "adventure";
      case "cultural":
        return "cultural";
      case "nature":
        return "nature";
      case "food":
        return "food";
      case "historical":
        return "historical";
      default:
        return "default";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(amount) || 0);
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return "N/A";
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const truncateId = (id) => {
    if (!id) return "N/A";
    return `#${id.substring(0, 8)}...`;
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="tours-management">
      <div className="tours-management-header">
        <h2>Tours Management</h2>
        <div className="filters">
          <input
            type="text" 
            placeholder="Search tours by title, description, guide, or tour ID..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="search-input"
          />
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">All Categories</option>
            <option value="adventure">Adventure</option>
            <option value="cultural">Cultural</option>
            <option value="nature">Nature</option>
            <option value="food">Food</option>
            <option value="historical">Historical</option>
          </select>
        </div>
      </div>

      {filteredTours.length === 0 ? (
        <div className="no-tours">
          <FaMapMarkerAlt size={48} color="#ccc" />
          <p>
            {filters.category || filters.search
              ? `No tours found matching your criteria`
              : "No tours found"}
          </p>
        </div>
      ) : (
        <div className="tours-table">
          <table>
            <thead>
              <tr>
                <th>Tour ID</th>
                <th>Guide ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Duration</th>
                <th>Max People</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTours.map((tour) => (
                <tr key={tour.id}>
                  <td>
                    <span className="tour-id" title={tour.id}>
                      {truncateId(tour.id)}
                    </span>
                  </td>
                  <td>
                    <span className="guide-id" title={tour.guide_id}>
                      {truncateId(tour.guide_id)}
                    </span>
                  </td>
                  <td className="title-cell">
                    <span title={tour.title}>
                      {tour.title.length > 30
                        ? `${tour.title.substring(0, 30)}...`
                        : tour.title}
                    </span>
                  </td>
                  <td className="description-cell">
                    <span title={tour.description}>
                      {truncateText(tour.description, 50)}
                    </span>
                  </td>
                  <td>
                    <div className="duration-info">
                      <FaClock />
                      <span>{tour.duration_hours}h</span>
                    </div>
                  </td>
                  <td>
                    <div className="people-info">
                      <FaUsers />
                      <span>{tour.max_people}</span>
                    </div>
                  </td>
                  <td className="price">
                    {formatCurrency(tour.price)}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleViewTour(tour)}
                        className="btn-view"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleDeleteTour(tour.id)}
                        className="btn-delete"
                        title="Delete Tour"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {pagination.page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}

      {/* Tour Details Modal */}
      {showModal && selectedTour && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Tour Details</h3>
              <button onClick={() => setShowModal(false)} className="close-btn">
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="tour-section">
                <h4>
                  <FaInfoCircle /> Basic Information
                </h4>
                <div className="detail-grid">
                  <div className="tour-detail-item">
                    <strong>Tour ID:</strong>
                    <span className="tour-id-full">
                      {selectedTour.id}
                    </span>
                  </div>
                  <div className="tour-detail-item">
                    <strong>Guide ID:</strong>
                    <span className="guide-id-full">
                      {selectedTour.guide_id}
                    </span>
                  </div>
                  <div className="tour-detail-item">
                    <strong>Title:</strong>
                    <span>{selectedTour.title}</span>
                  </div>
                  <div className="tour-detail-item">
                    <strong>Category:</strong>
                    <span className={`category-badge ${getCategoryColor(selectedTour.category)}`}>
                      {selectedTour.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="tour-section">
                <h4>
                  <FaMapMarkerAlt /> Tour Details
                </h4>
                <div className="detail-grid">
                  <div className="tour-detail-item">
                    <strong>Duration:</strong>
                    <span>{selectedTour.duration_hours} hours</span>
                  </div>
                  <div className="tour-detail-item">
                    <strong>Max People:</strong>
                    <span>{selectedTour.max_people} people</span>
                  </div>
                  <div className="tour-detail-item">
                    <strong>Price:</strong>
                    <span className="amount-large">
                      {formatCurrency(selectedTour.price)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="tour-section">
                <h4>
                  <FaInfoCircle /> Description
                </h4>
                <div className="tour-description-full">
                  <p>{selectedTour.description}</p>
                </div>
              </div>

              {selectedTour.image_url && (
                <div className="tour-section">
                  <h4>
                    <FaMapMarkerAlt /> Tour Image
                  </h4>
                  <div className="tour-image-full">
                    <img src={selectedTour.image_url} alt={selectedTour.title} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToursManagement;
