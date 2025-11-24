import React, { useState, useEffect } from 'react';

const Profile = () => {
  const defaultSettings = {
    profile: {
      fullName: 'Aayan Bansal',
      role: 'Administrator',
      avatar: ''
    }
  };

  const [profileData, setProfileData] = useState(defaultSettings.profile);
  const [successMessage, setSuccessMessage] = useState('');

  // Load profile data from localStorage
  const loadProfileData = () => {
    try {
      const savedSettings = localStorage.getItem('ebgSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed.profile) {
          setProfileData({
            fullName: parsed.profile.fullName || defaultSettings.profile.fullName,
            role: parsed.profile.role || defaultSettings.profile.role,
            avatar: parsed.profile.avatar || ''
          });
        }
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  // Function to crop image to center 100x100px
  const cropImageToCenter = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = 100;
          canvas.height = 100;

          // Calculate source rectangle for center crop
          const sourceSize = Math.min(img.width, img.height);
          const sourceX = (img.width - sourceSize) / 2;
          const sourceY = (img.height - sourceSize) / 2;

          // Draw cropped and resized image
          ctx.drawImage(
            img,
            sourceX, sourceY, sourceSize, sourceSize,
            0, 0, 100, 100
          );

          // Convert to base64
          const base64 = canvas.toDataURL('image/png');
          resolve(base64);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    try {
      const croppedImage = await cropImageToCenter(file);
      setProfileData({ ...profileData, avatar: croppedImage });
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image. Please try again.');
    }
  };

  const handleRemoveImage = () => {
    setProfileData({ ...profileData, avatar: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      // Load existing settings
      const savedSettings = localStorage.getItem('ebgSettings');
      let settings = savedSettings ? JSON.parse(savedSettings) : defaultSettings;
      
      // Update profile data
      settings.profile = {
        fullName: profileData.fullName,
        role: profileData.role,
        avatar: profileData.avatar
      };
      
      // Save to localStorage
      localStorage.setItem('ebgSettings', JSON.stringify(settings));
      
      // Dispatch custom event to update header
      window.dispatchEvent(new CustomEvent('settingsUpdated'));
      
      // Show success message
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'AB';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="fade-in-up">
      <div className="page-header">
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">Manage your profile information</p>
      </div>

      <div className="card">
        <div className="card-body">
          {successMessage && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {successMessage}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setSuccessMessage('')}
              ></button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-4 text-center mb-4 mb-md-0">
                <div className="profile-picture-section">
                  <div className="profile-picture-container mb-3">
                    {profileData.avatar ? (
                      <img
                        src={profileData.avatar}
                        alt="Profile"
                        className="profile-picture"
                        style={{
                          width: '150px',
                          height: '150px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '4px solid #006ec8'
                        }}
                      />
                    ) : (
                      <div
                        className="profile-picture-placeholder"
                        style={{
                          width: '150px',
                          height: '150px',
                          borderRadius: '50%',
                          backgroundColor: '#006ec8',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '3rem',
                          fontWeight: 'bold',
                          margin: '0 auto',
                          border: '4px solid #006ec8'
                        }}
                      >
                        {getInitials(profileData.fullName)}
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      id="profilePictureUpload"
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="profilePictureUpload" className="btn btn-primary">
                      <i className="bi bi-camera me-2"></i>Change Picture
                    </label>
                    {profileData.avatar && (
                      <button
                        type="button"
                        className="btn btn-outline-danger ms-2"
                        onClick={handleRemoveImage}
                      >
                        <i className="bi bi-trash me-2"></i>Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-8">
                <div className="mb-3">
                  <label htmlFor="fullName" className="form-label">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="fullName"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="role" className="form-label">
                    Role <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="role"
                    value={profileData.role}
                    onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                    required
                    placeholder="Enter your role"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={localStorage.getItem('userEmail') || 'admin@ebg.com'}
                    disabled
                    placeholder="Email address"
                  />
                  <small className="text-muted">Email cannot be changed</small>
                </div>

                <div className="d-flex gap-2 mt-4">
                  <button type="submit" className="btn btn-primary">
                    <i className="bi bi-check-circle me-2"></i>Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => loadProfileData()}
                  >
                    <i className="bi bi-arrow-counterclockwise me-2"></i>Reset
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;

