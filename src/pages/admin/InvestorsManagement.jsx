import React, { useState, useEffect } from 'react';

const InvestorsManagement = () => {
  const [investors, setInvestors] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1234567890', totalInvested: 150000, activeInvestments: 3, status: 'Active', joinDate: '2023-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1234567891', totalInvested: 250000, activeInvestments: 5, status: 'Active', joinDate: '2023-03-20' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '+1234567892', totalInvested: 75000, activeInvestments: 2, status: 'Inactive', joinDate: '2023-06-10' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingInvestor, setEditingInvestor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Active'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingInvestor) {
      setInvestors(investors.map(inv => inv.id === editingInvestor.id ? { ...formData, id: editingInvestor.id, totalInvested: editingInvestor.totalInvested, activeInvestments: editingInvestor.activeInvestments, joinDate: editingInvestor.joinDate } : inv));
    } else {
      const newId = investors.length > 0 ? Math.max(...investors.map(i => i.id)) + 1 : 1;
      setInvestors([...investors, { ...formData, id: newId, totalInvested: 0, activeInvestments: 0, joinDate: new Date().toISOString().split('T')[0] }]);
    }
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ name: '', email: '', phone: '', status: 'Active' });
    setEditingInvestor(null);
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

  const handleEdit = (investor) => {
    setEditingInvestor(investor);
    setFormData({ name: investor.name, email: investor.email, phone: investor.phone, status: investor.status });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this investor?')) {
      setInvestors(investors.filter(inv => inv.id !== id));
    }
  };

  const filteredInvestors = investors.filter(investor =>
    investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    investor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fade-in-up">
      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h1 className="page-title">Investors Management</h1>
          <p className="page-subtitle">Manage investor profiles and investments</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowModal(true); setEditingInvestor(null); setFormData({ name: '', email: '', phone: '', status: 'Active' }); }}>
          <i className="bi bi-plus-circle me-2"></i>Add New Investor
        </button>
      </div>

      <div className="search-filter-bar">
        <input
          type="text"
          className="form-control"
          placeholder="Search investors by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Total Invested</th>
                  <th>Active Investments</th>
                  <th>Status</th>
                  <th>Join Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvestors.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center">
                      <div className="empty-state">
                        <i className="bi bi-person-x"></i>
                        <h4>No investors found</h4>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredInvestors.map((investor) => (
                    <tr key={investor.id}>
                      <td>{investor.id}</td>
                      <td>{investor.name}</td>
                      <td>{investor.email}</td>
                      <td>{investor.phone}</td>
                      <td>${investor.totalInvested.toLocaleString()}</td>
                      <td><span className="badge badge-info">{investor.activeInvestments}</span></td>
                      <td><span className={`badge ${investor.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>{investor.status}</span></td>
                      <td>{investor.joinDate}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn btn-sm btn-warning" onClick={() => handleEdit(investor)} title="Edit">
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(investor.id)} title="Delete">
                            <i className="bi bi-trash"></i>
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

      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingInvestor ? 'Edit Investor' : 'Add New Investor'}</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {showModal && <div className="modal-backdrop show" onClick={closeModal}></div>}
    </div>
  );
};

export default InvestorsManagement;
