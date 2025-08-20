import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { guidesService } from "../../services/guidesService";
import GuideProfileForm from "./GuideProfileForm";
import Loading from "../Loading";
import "./GuideComponents.css";

const GuideProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user?.id) {
          const profileData = await guidesService.getGuideByUserId(user.id);
          setProfile(profileData);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading) return <Loading />;

  if (!profile) {
    return (
      <GuideProfileForm
        onProfileCreated={(newProfile) => setProfile(newProfile)}
      />
    );
  }

  if (editing) {
    return (
      <GuideProfileForm
        initialData={profile}
        onProfileCreated={(updatedProfile) => {
          setProfile(updatedProfile);
          setEditing(false);
        }}
      />
    );
  }

  return (
    <div className="guide-profile">
      <div className="page-header">
        <h1>My Profile</h1>
        <button onClick={() => setEditing(true)} className="btn-primary">
          Edit Profile
        </button>
      </div>

      <div className="profile-content">
        <div className="profile-info">
          <h3>{profile.name}</h3>
          <p>
            <strong>Location:</strong> {profile.location}
          </p>
          <p>
            <strong>Languages:</strong>{" "}
            {Array.isArray(profile.languages)
              ? profile.languages.join(", ")
              : profile.languages}
          </p>
          <p>
            <strong>Experience:</strong> {profile.experience_years} years
          </p>
          <p>
            <strong>Price:</strong> ${profile.price_per_hour}/hour
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span className={`status ${profile.verification_status}`}>
              {profile.verification_status}
            </span>
          </p>
          {profile.description && (
            <div>
              <strong>About:</strong>
              <p>{profile.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuideProfile;
