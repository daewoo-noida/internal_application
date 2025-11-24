import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const Settings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'branch');

  const tabs = [
    { id: 'branch', label: 'Branch', icon: 'bi-diagram-2' },
    { id: 'brand', label: 'Brand', icon: 'bi-tag' },
    { id: 'business-category', label: 'Business Category', icon: 'bi-list-nested' },
    { id: 'investment-type', label: 'Investment Type', icon: 'bi-graph-up-arrow' },
    { id: 'territory', label: 'Territory', icon: 'bi-diagram-2' },
  ];

  // Branch Data
  const [branches, setBranches] = useState([
    { id: 1, name: 'Chandigarh', location: 'Zirakpur' },
    { id: 2, name: 'Mumbai', location: 'Andheri East, Mumbai' },
    { id: 3, name: 'Noida', location: 'noida' },
    { id: 4, name: 'Hyderabad-FW', location: 'Hyderabad' },
    { id: 5, name: 'Kochi', location: 'Kochi' },
  ]);

  // Brand Data
  const [brands, setBrands] = useState([
    { id: 1, name: 'Daewoo', description: 'Daewoo Appliances', status: 'Active' },
  ]);

  // Business Category Data
  const [businessCategories, setBusinessCategories] = useState([
    { id: 1, name: 'Retail', description: 'Retail business category' },
    { id: 2, name: 'Manufacturing', description: 'Manufacturing business category' },
  ]);

  // Investment Type Data
  const [investmentTypes, setInvestmentTypes] = useState([
    { id: 1, name: 'Equity', description: 'Equity investment type' },
    { id: 2, name: 'Debt', description: 'Debt investment type' },
  ]);

  // Territory Data
  const [territories, setTerritories] = useState([
    { id: 1, opportunity: 'Master Franchise Opportunities', assignmentType: 'MANUALLY', location: 'Western & Central Uttar Pradesh', selectedLocations: ['Himachal Pradesh'] },
    { id: 2, opportunity: 'Master Franchise Opportunities', assignmentType: 'MANUALLY', location: 'Mumbai Metropolitan & Western Maharashtra', selectedLocations: [] },
    { id: 3, opportunity: 'Master Franchise Opportunities', assignmentType: 'MANUALLY', location: 'Bihar', selectedLocations: [] },
    { id: 4, opportunity: 'Master Franchise Opportunities', assignmentType: 'MANUALLY', location: 'West Bengal', selectedLocations: [] },
    { id: 5, opportunity: 'Master Franchise Opportunities', assignmentType: 'MANUALLY', location: 'Uttarakhand', selectedLocations: [] },
    { id: 6, opportunity: 'Master Franchise Opportunities', assignmentType: 'MANUALLY', location: 'North East', selectedLocations: [] },
    { id: 7, opportunity: 'Master Franchise Opportunities', assignmentType: 'MANUALLY', location: 'Jammu & Kashmir', selectedLocations: [] },
    { id: 8, opportunity: 'Master Franchise Opportunities', assignmentType: 'MANUALLY', location: 'Himachal Pradesh', selectedLocations: [] },
    { id: 9, opportunity: 'Master Franchise Opportunities', assignmentType: 'MANUALLY', location: 'Goa', selectedLocations: [] },
    { id: 10, opportunity: 'Master Franchise Opportunities', assignmentType: 'MANUALLY', location: 'Chhattisgarh', selectedLocations: [] },
    { id: 11, opportunity: 'Master Franchise Opportunities', assignmentType: 'MANUALLY', location: 'Eastern Uttar Pradesh & Bundelkhand', selectedLocations: [] },
    { id: 12, opportunity: 'Master Franchise Opportunities', assignmentType: 'MANUALLY', location: 'Marathwada & Southern Maharashtra', selectedLocations: [] },
    { id: 13, opportunity: 'Master Franchise Opportunities', assignmentType: 'MANUALLY', location: 'Vidarbha & North Maharashtra', selectedLocations: [] },
    { id: 14, opportunity: 'Master Franchise Opportunities', assignmentType: 'MANUALLY', location: 'Jharkhand', selectedLocations: [] },
    { id: 15, opportunity: 'Master Franchise Opportunities', assignmentType: 'MANUALLY', location: 'North & Central Karnataka', selectedLocations: [] },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Opportunity options for Territory
  // Only two opportunities allowed: Master Franchise and Signature Store
  const opportunityOptions = [
    'Master Franchise Opportunities',
    'Signature Store Opportunities'
  ];

  // Initialize form data based on active tab
  const getInitialFormData = () => {
    if (activeTab === 'branch') {
      return { name: '', location: '' };
    }
    if (activeTab === 'brand') {
      return { name: '', description: '', status: 'Active' };
    }
    if (activeTab === 'territory') {
      return { opportunity: 'Master Franchise Opportunities', assignmentType: 'MANUALLY', location: '', selectedLocations: [], file: null, newLocation: '' };
    }
    return { name: '', description: '' };
  };

  const [formData, setFormData] = useState(getInitialFormData());

  // Update form data when tab changes
  useEffect(() => {
    setFormData(getInitialFormData());
    setSearchTerm('');
    setShowModal(false);
    setEditingItem(null);
    setCurrentPage(1);
  }, [activeTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('tab', tabId);
    setSearchParams(newSearchParams);
  };

  useEffect(() => {
    const tab = searchParams.get('tab');
    const validTabs = tabs.map(t => t.id);
    if (tab && validTabs.includes(tab)) {
      setActiveTab(tab);
    } else {
      setActiveTab('branch');
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('tab', 'branch');
      setSearchParams(newSearchParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const getCurrentData = () => {
    switch (activeTab) {
      case 'branch':
        return branches;
      case 'brand':
        return brands;
      case 'business-category':
        return businessCategories;
      case 'investment-type':
        return investmentTypes;
      case 'territory':
        return territories;
      default:
        return [];
    }
  };

  const setCurrentData = (newData) => {
    switch (activeTab) {
      case 'branch':
        setBranches(newData);
        break;
      case 'brand':
        setBrands(newData);
        break;
      case 'business-category':
        setBusinessCategories(newData);
        break;
      case 'investment-type':
        setInvestmentTypes(newData);
        break;
      case 'territory':
        setTerritories(newData);
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentData = getCurrentData();
    
    // For territory, ensure location is set if selectedLocations exist
    let finalFormData = { ...formData };
    if (activeTab === 'territory') {
      // Use the main location field or first selected location
      if (!finalFormData.location && finalFormData.selectedLocations && finalFormData.selectedLocations.length > 0) {
        finalFormData.location = finalFormData.selectedLocations[0];
      }
      // Remove temporary fields
      delete finalFormData.newLocation;
      delete finalFormData.file; // File is not stored in data, just for upload reference
    }
    
    if (editingItem) {
      const updatedData = currentData.map(item => 
        item.id === editingItem.id ? { ...finalFormData, id: editingItem.id } : item
      );
      setCurrentData(updatedData);
    } else {
      const newId = currentData.length > 0 ? Math.max(...currentData.map(item => item.id)) + 1 : 1;
      setCurrentData([...currentData, { ...finalFormData, id: newId }]);
    }
    
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData(getInitialFormData());
    setEditingItem(null);
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

  const handleEdit = (item) => {
    setEditingItem(item);
    if (activeTab === 'territory') {
      // Ensure selectedLocations array exists and newLocation is empty
      setFormData({
        ...item,
        selectedLocations: item.selectedLocations || [],
        newLocation: '',
        file: null
      });
    } else {
      setFormData(item);
    }
    setShowModal(true);
  };

  const handleDelete = (id) => {
    const currentData = getCurrentData();
    if (window.confirm(`Are you sure you want to delete this ${activeTab.replace('-', ' ')}?`)) {
      setCurrentData(currentData.filter(item => item.id !== id));
    }
  };

  const getFilteredData = () => {
    const currentData = getCurrentData();
    if (activeTab === 'branch') {
      return currentData.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (activeTab === 'brand') {
      return currentData.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (activeTab === 'territory') {
      return currentData.filter(item =>
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.opportunity && item.opportunity.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    return currentData.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const filteredData = getFilteredData();

  // Pagination for Territory tab
  const getPaginatedData = () => {
    if (activeTab === 'territory') {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return filteredData.slice(startIndex, endIndex);
    }
    return filteredData;
  };

  const paginatedData = getPaginatedData();
  const totalPages = activeTab === 'territory' ? Math.ceil(filteredData.length / itemsPerPage) : 1;

  const getModalTitle = () => {
    const tabName = activeTab.replace('-', ' ');
    return editingItem ? `Edit ${tabName.charAt(0).toUpperCase() + tabName.slice(1)}` : `Create ${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`;
  };

  return (
    <div className="fade-in-up">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage system settings and preferences</p>
      </div>

      {/* Tabs */}
      <div className="settings-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => handleTabChange(tab.id)}
          >
            <i className={`bi ${tab.icon}`}></i>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="card">
        <div className="card-body">
          {/* Search and Create */}
          <div className="search-filter-bar">
            <input
              type="text"
              className="form-control"
              placeholder={
                activeTab === 'branch' 
                  ? 'Search name or location...' 
                  : activeTab === 'brand' 
                  ? 'Search name...' 
                  : activeTab === 'territory'
                  ? 'Search name or region...'
                  : 'Search name or description...'
              }
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
            />
            <button
              className="btn btn-primary"
              onClick={() => {
                setShowModal(true);
                setEditingItem(null);
                setFormData(getInitialFormData());
              }}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Create {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
            </button>
          </div>

          {/* Table */}
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  {activeTab === 'branch' ? (
                    <>
                      <th>Branch Name</th>
                      <th>Location</th>
                    </>
                  ) : activeTab === 'brand' ? (
                    <>
                      <th>Brand Name</th>
                      <th>Status</th>
                    </>
                  ) : activeTab === 'territory' ? (
                    <>
                      <th>Opportunity</th>
                      <th>Assignment Type</th>
                      <th>Location / Pincode</th>
                    </>
                  ) : (
                    <>
                      <th>Name</th>
                      <th>Description</th>
                    </>
                  )}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={activeTab === 'territory' ? "4" : activeTab === 'branch' || activeTab === 'brand' ? "3" : "3"} className="text-center empty-state">
                      <i className="bi bi-inbox"></i>
                      <div>No {activeTab.replace('-', ' ')} found</div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item) => (
                    <tr key={item.id}>
                      {activeTab === 'territory' ? (
                        <>
                          <td>{item.opportunity || '-'}</td>
                          <td>{item.assignmentType || '-'}</td>
                          <td>{item.location || '-'}</td>
                        </>
                      ) : (
                        <>
                          <td>{item.name}</td>
                          <td>
                            {activeTab === 'branch' 
                              ? item.location 
                              : activeTab === 'brand' 
                              ? (
                                <span className={`badge ${item.status === 'Active' ? 'badge-success' : 'badge-secondary'}`}>
                                  {item.status || 'Active'}
                                </span>
                              )
                              : (item.description || '-')
                            }
                          </td>
                        </>
                      )}
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-warning settings-action-btn"
                            onClick={() => handleEdit(item)}
                            title="Edit"
                          >
                            <i className="bi bi-pencil me-1"></i>Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger settings-action-btn"
                            onClick={() => handleDelete(item.id)}
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
        </div>

      </div>

      {/* Pagination for Territory tab */}
      {activeTab === 'territory' && filteredData.length > itemsPerPage && (
        <div className="card mt-3">
          <div className="card-footer">
            <nav>
              <ul className="pagination mb-0 justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Prev
                  </button>
                </li>
                {[...Array(totalPages)].map((_, index) => {
                  const pageNum = index + 1;
                  if (totalPages > 5) {
                    // Show first page, last page, current page and pages around it
                    if (pageNum === 1 || pageNum === totalPages || 
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                      return (
                        <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </button>
                        </li>
                      );
                    }
                    if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                      return (
                        <li key={pageNum} className="page-item disabled">
                          <span className="page-link">...</span>
                        </li>
                      );
                    }
                    return null;
                  }
                  return (
                    <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    </li>
                  );
                })}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <>
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{getModalTitle()}</h5>
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    {activeTab === 'territory' ? (
                      <>
                        <div className="mb-3">
                          <label className="form-label">Select Opportunity</label>
                          <select
                            className="form-select"
                            value={formData.opportunity || 'Master Franchise Opportunities'}
                            onChange={(e) => setFormData({ ...formData, opportunity: e.target.value })}
                            required
                          >
                            {opportunityOptions.map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Select Assignment Type</label>
                          <select
                            className="form-select"
                            value={formData.assignmentType || 'MANUALLY'}
                            onChange={(e) => setFormData({ ...formData, assignmentType: e.target.value })}
                            required
                          >
                            <option value="MANUALLY">Manually</option>
                            <option value="AUTOMATICALLY">Automatically</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Enter Location</label>
                          <div className="d-flex gap-2 align-items-end">
                            <input
                              type="text"
                              className="form-control"
                              id="territoryLocationInput"
                              value={formData.newLocation || ''}
                              onChange={(e) => setFormData({ ...formData, newLocation: e.target.value })}
                              placeholder="Enter location"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter' && formData.newLocation && formData.newLocation.trim()) {
                                  e.preventDefault();
                                  const newLoc = formData.newLocation.trim();
                                  if (!formData.selectedLocations || !formData.selectedLocations.includes(newLoc)) {
                                    const updatedLocations = [...(formData.selectedLocations || []), newLoc];
                                    setFormData({ 
                                      ...formData, 
                                      selectedLocations: updatedLocations,
                                      newLocation: '',
                                      location: newLoc // Set main location to the latest
                                    });
                                  } else {
                                    setFormData({ ...formData, newLocation: '' });
                                  }
                                }
                              }}
                              required={!formData.selectedLocations || formData.selectedLocations.length === 0}
                            />
                            <div>
                              <input
                                type="file"
                                className="form-control"
                                id="territoryFile"
                                onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                                style={{ display: 'none' }}
                              />
                              <label htmlFor="territoryFile" className="btn btn-secondary mb-0" style={{ whiteSpace: 'nowrap' }}>
                                Choose file
                              </label>
                            </div>
                          </div>
                          {formData.file && (
                            <small className="text-muted mt-1 d-block">{formData.file.name}</small>
                          )}
                          {!formData.file && (
                            <small className="text-muted mt-1 d-block">No file chosen</small>
                          )}
                        </div>
                        <div className="mb-3">
                          <small className="text-muted">
                            {Math.max(0, 4 - (formData.selectedLocations?.length || 0))} location slots left
                          </small>
                        </div>
                        {formData.selectedLocations && formData.selectedLocations.length > 0 && (
                          <div className="mb-3">
                            <div className="d-flex flex-wrap gap-2">
                              {formData.selectedLocations.map((loc, index) => (
                                <span key={index} className="badge bg-primary d-flex align-items-center gap-2">
                                  <i className="bi bi-geo-alt"></i>
                                  {loc}
                                  <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    style={{ fontSize: '0.7rem' }}
                                    onClick={() => {
                                      const newLocations = formData.selectedLocations.filter((_, i) => i !== index);
                                      setFormData({ ...formData, selectedLocations: newLocations });
                                    }}
                                  ></button>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="mb-3">
                          <label className="form-label">
                            {activeTab === 'branch' ? 'Branch Name' : activeTab === 'brand' ? 'Brand Name' : 'Name'}
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                          />
                        </div>
                        {activeTab === 'brand' && (
                          <div className="mb-3">
                            <label className="form-label">Brand Description</label>
                            <textarea
                              className="form-control"
                              value={formData.description || ''}
                              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                              rows="3"
                              required
                            />
                          </div>
                        )}
                        {activeTab !== 'branch' && activeTab !== 'brand' && activeTab !== 'territory' && (
                          <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea
                              className="form-control"
                              value={formData.description || ''}
                              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                              rows="3"
                              required
                            />
                          </div>
                        )}
                        {activeTab === 'branch' && (
                          <div className="mb-3">
                            <label className="form-label">Location</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.location || ''}
                              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                              required
                            />
                          </div>
                        )}
                        {activeTab === 'brand' && (
                          <div className="mb-3">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="brandStatus"
                                checked={formData.status === 'Active'}
                                onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'Active' : 'Inactive' })}
                              />
                              <label className="form-check-label" htmlFor="brandStatus">
                                Active
                              </label>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <div className="modal-footer" style={activeTab === 'territory' && !editingItem ? { justifyContent: 'space-between' } : {}}>
                    {activeTab === 'territory' && !editingItem ? (
                      <>
                        <button type="submit" className="btn btn-primary">
                          Add
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={closeModal}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button type="button" className="btn btn-secondary" onClick={closeModal}>
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                          {editingItem ? 'Update' : 'Save'}
                        </button>
                      </>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show" onClick={closeModal}></div>
        </>
      )}
    </div>
  );
};

export default Settings;

