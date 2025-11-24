import React, { useState, useEffect } from 'react';
import { opportunitiesAPI } from '../../utils/api';

const InvestmentOpportunityManagement = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    minInvestment: '',
    maxInvestment: '',
    expectedReturn: '',
    duration: '',
    status: 'Active'
  });

  // Fetch opportunities from API
  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await opportunitiesAPI.getAll();
      setOpportunities(response.data.data || response.data || []);
    } catch (err) {
      console.error('Error fetching opportunities:', err);
      setError('Failed to load opportunities. Please try again later.');
      setOpportunities([]);
    } finally {
      setLoading(false);
    }
  };

  const getInitialFormData = () => ({
    title: '',
    description: '',
    minInvestment: '',
    maxInvestment: '',
    expectedReturn: '',
    duration: '',
    status: 'Active'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that only allowed opportunity types can be created
    const allowedTitles = ['Master Franchise Opportunities', 'Signature Store Opportunities'];
    const titleMatch = allowedTitles.some(title => 
      formData.title.toLowerCase().includes(title.toLowerCase())
    );
    
    if (!titleMatch) {
      alert('Only "Master Franchise Opportunities" or "Signature Store Opportunities" are allowed.');
      return;
    }
    
    // Prevent creating duplicate opportunity types
    const existingOpportunity = opportunities.find(opp => 
      allowedTitles.some(title => 
        opp.title.toLowerCase().includes(title.toLowerCase()) &&
        formData.title.toLowerCase().includes(title.toLowerCase())
      ) && (!editingOpportunity || opp.id !== editingOpportunity.id)
    );
    
    if (existingOpportunity && !editingOpportunity) {
      alert(`An opportunity with this type already exists. Please edit the existing one instead.`);
      return;
    }
    
    try {
      const submitData = {
        ...formData,
        minInvestment: parseFloat(formData.minInvestment),
        maxInvestment: parseFloat(formData.maxInvestment)
      };
      
      if (editingOpportunity) {
        await opportunitiesAPI.update(editingOpportunity.id, submitData);
      } else {
        await opportunitiesAPI.create(submitData);
      }
      closeModal();
      fetchOpportunities(); // Refresh opportunities list
    } catch (err) {
      console.error('Error saving opportunity:', err);
      alert('Failed to save opportunity. Please try again.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData(getInitialFormData());
    setEditingOpportunity(null);
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showModal) {
        closeModal();
      }
    };
    if (showModal) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal]);

  // Handle backdrop click
  useEffect(() => {
    const handleBackdropClick = (e) => {
      if (showModal && e.target.classList.contains('modal-backdrop')) {
        closeModal();
      }
    };
    document.addEventListener('click', handleBackdropClick);
    return () => {
      document.removeEventListener('click', handleBackdropClick);
    };
  }, [showModal]);

  const handleEdit = (opportunity) => {
    setEditingOpportunity(opportunity);
    setFormData({ 
      ...opportunity, 
      minInvestment: opportunity.minInvestment.toString(), 
      maxInvestment: opportunity.maxInvestment.toString() 
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this opportunity?')) {
      try {
        await opportunitiesAPI.delete(id);
        fetchOpportunities(); // Refresh opportunities list
      } catch (err) {
        console.error('Error deleting opportunity:', err);
        alert('Failed to delete opportunity. Please try again.');
      }
    }
  };

  // Filter opportunities - Only allow Master Franchise and Signature Store Opportunities
  const allowedTitles = ['Master Franchise Opportunities', 'Signature Store Opportunities'];
  
  // Filter opportunities to only show the two allowed types
  const filteredOpportunities = opportunities.filter(opportunity => {
    const isAllowed = allowedTitles.some(title => 
      opportunity.title.toLowerCase().includes(title.toLowerCase())
    );
    const matchesSearch = 
      opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.expectedReturn.toLowerCase().includes(searchTerm.toLowerCase());
    return isAllowed && matchesSearch;
  });

  return (
    <div className="fade-in-up">
      <div className="page-header">
        <h1 className="page-title">Investment Opportunity Management</h1>
      </div>

      {/* Search and Add Button */}
      <div className="search-filter-bar">
        <input
          type="text"
          className="form-control"
          placeholder="Search by title, description or return..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span className="text-muted" style={{ fontSize: '14px' }}>
            Only two opportunities allowed: Master Franchise Opportunities & Signature Store Opportunities
          </span>
          {filteredOpportunities.length >= 2 && (
            <span className="badge badge-warning" style={{ fontSize: '12px' }}>
              Maximum of 2 opportunities reached
            </span>
          )}
          <button 
            className="btn btn-primary" 
            onClick={() => { 
              if (filteredOpportunities.length >= 2) {
                alert('Only two opportunities are allowed: Master Franchise Opportunities and Signature Store Opportunities. Please edit existing ones.');
                return;
              }
              setShowModal(true); 
              setEditingOpportunity(null); 
              setFormData(getInitialFormData()); 
            }}
            disabled={filteredOpportunities.length >= 2}
          >
            Add New Opportunity
          </button>
        </div>
      </div>

      {/* Opportunities Table */}
      <div className="card">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading opportunities...</p>
            </div>
          ) : error ? (
            <div className="text-center py-5">
              <div className="alert alert-danger" role="alert">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
                <button className="btn btn-sm btn-outline-danger ms-3" onClick={fetchOpportunities}>
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Investment Range</th>
                    <th>Expected Return</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOpportunities.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        <div className="empty-state">
                          <i className="bi bi-briefcase"></i>
                          <h4>No opportunities found</h4>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredOpportunities.map((opportunity) => (
                      <tr key={opportunity.id}>
                        <td>
                          <strong>{opportunity.title}</strong>
                        </td>
                        <td>
                          <span className="text-muted">{opportunity.description}</span>
                        </td>
                        <td>
                          ₹{opportunity.minInvestment?.toLocaleString('en-IN') || 0} - ₹{opportunity.maxInvestment?.toLocaleString('en-IN') || 0}
                        </td>
                        <td>
                          <span className="text-success" style={{ fontWeight: 600 }}>
                            {opportunity.expectedReturn}
                          </span>
                        </td>
                        <td>{opportunity.duration}</td>
                        <td>
                          <span className={`badge ${
                            opportunity.status === 'Active' 
                              ? 'badge-success' 
                              : opportunity.status === 'Closed'
                              ? 'badge-danger'
                              : 'badge-warning'
                          }`}>
                            {opportunity.status}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn btn-sm btn-warning investment-opportunity-btn" 
                              onClick={() => handleEdit(opportunity)}
                              title="Edit"
                            >
                              <i className="bi bi-pencil me-1"></i>Edit
                            </button>
                            <button 
                              className="btn btn-sm btn-danger investment-opportunity-btn" 
                              onClick={() => handleDelete(opportunity.id)}
                              title="Delete"
                            >
                              <i className="bi bi-trash me-1"></i>Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Opportunity Modal */}
      {showModal && (
        <>
          <div className="modal-backdrop show" onClick={closeModal}></div>
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editingOpportunity ? 'Edit Opportunity' : 'Add New Opportunity'}</h5>
                  <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Title</label>
                      <select
                        className="form-select"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        disabled={editingOpportunity !== null}
                      >
                        <option value="">Select Opportunity Type</option>
                        <option value="Master Franchise Opportunities">Master Franchise Opportunities</option>
                        <option value="Signature Store Opportunities">Signature Store Opportunities</option>
                      </select>
                      {editingOpportunity && (
                        <small className="form-text text-muted">
                          Cannot change opportunity type when editing. Create a new one to change the type.
                        </small>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows="4"
                        required
                      />
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Minimum Investment (₹)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={formData.minInvestment}
                          onChange={(e) => setFormData({ ...formData, minInvestment: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Maximum Investment (₹)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={formData.maxInvestment}
                          onChange={(e) => setFormData({ ...formData, maxInvestment: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Expected Return (%)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.expectedReturn}
                          onChange={(e) => setFormData({ ...formData, expectedReturn: e.target.value })}
                          placeholder="e.g., 15%"
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Duration</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                          placeholder="e.g., 24 months"
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      >
                        <option value="Active">Active</option>
                        <option value="Closed">Closed</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                    <button type="submit" className="btn btn-primary">
                      {editingOpportunity ? 'Update Opportunity' : 'Add Opportunity'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InvestmentOpportunityManagement;
