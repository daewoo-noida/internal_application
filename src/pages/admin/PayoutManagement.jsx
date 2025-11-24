import React, { useState, useEffect } from 'react';

const PayoutManagement = () => {
  const [payouts, setPayouts] = useState([
    { id: 1, payoutId: 'PAY001', recipient: 'Alice Brown', type: 'Commission', amount: 1250, date: '2024-02-15', status: 'Paid', method: 'Bank Transfer' },
    { id: 2, payoutId: 'PAY002', recipient: 'Bob White', type: 'Commission', amount: 875, date: '2024-02-16', status: 'Pending', method: 'Bank Transfer' },
    { id: 3, payoutId: 'PAY003', recipient: 'John Doe', type: 'Investment Return', amount: 5000, date: '2024-02-17', status: 'Processing', method: 'Bank Transfer' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingPayout, setEditingPayout] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [formData, setFormData] = useState({
    recipient: '',
    type: 'Commission',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Pending',
    method: 'Bank Transfer'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPayout) {
      setPayouts(payouts.map(payout => payout.id === editingPayout.id ? { ...formData, id: editingPayout.id, payoutId: editingPayout.payoutId, amount: parseFloat(formData.amount) } : payout));
    } else {
      const newId = payouts.length > 0 ? Math.max(...payouts.map(p => p.id)) + 1 : 1;
      const payoutNum = String(newId).padStart(3, '0');
      setPayouts([...payouts, { ...formData, id: newId, payoutId: `PAY${payoutNum}`, amount: parseFloat(formData.amount) }]);
    }
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      recipient: '',
      type: 'Commission',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      method: 'Bank Transfer'
    });
    setEditingPayout(null);
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

  const handleEdit = (payout) => {
    setEditingPayout(payout);
    setFormData({ ...payout, amount: payout.amount.toString() });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this payout?')) {
      setPayouts(payouts.filter(payout => payout.id !== id));
    }
  };

  const handleProcessPayout = (id) => {
    setPayouts(payouts.map(payout => payout.id === id ? { ...payout, status: 'Paid' } : payout));
  };

  // Filter payouts
  const filteredPayouts = payouts.filter(payout => {
    const matchesSearch = payout.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.payoutId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || payout.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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

  const getInitialFormData = () => ({
    recipient: '',
    type: 'Commission',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Pending',
    method: 'Bank Transfer'
  });

  return (
    <div className="fade-in-up">
      <div className="page-header">
        <h1 className="page-title">Payout Management</h1>
      </div>

      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <input
          type="text"
          className="form-control"
          placeholder="Search by recipient name or payout ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="form-select"
          style={{ maxWidth: '200px' }}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Failed">Failed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Refunded">Refunded</option>
          <option value="On Hold">On Hold</option>
          <option value="Rejected">Rejected</option>
          <option value="Approved">Approved</option>
          <option value="Declined">Declined</option>
          <option value="Completed">Completed</option>
          <option value="Partially Paid">Partially Paid</option>
        </select>
        <button 
          className="btn btn-primary" 
          onClick={() => { 
            setShowModal(true); 
            setEditingPayout(null); 
            setFormData(getInitialFormData()); 
          }}
        >
          Add New Payout
        </button>
      </div>

      {/* Payouts Table */}
      <div className="card">
        <div className="card-body p-0">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Payout ID</th>
                  <th>Recipient</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayouts.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      <div className="empty-state">
                        <i className="bi bi-cash-coin"></i>
                        <h4>No payouts found</h4>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPayouts.map((payout) => (
                    <tr key={payout.id}>
                      <td>{payout.payoutId}</td>
                      <td>{payout.recipient}</td>
                      <td>
                        <span className="badge badge-info">{payout.type}</span>
                      </td>
                      <td>${payout.amount.toLocaleString()}</td>
                      <td>{payout.method}</td>
                      <td>{payout.date}</td>
                      <td>
                        <span className={`badge ${
                          payout.status === 'Paid' 
                            ? 'badge-success' 
                            : payout.status === 'Pending' 
                            ? 'badge-warning' 
                            : payout.status === 'Processing' 
                            ? 'badge-info' 
                            : 'badge-danger'
                        }`}>
                          {payout.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {payout.status !== 'Paid' && (
                            <button 
                              className="btn btn-sm btn-success process-btn" 
                              onClick={() => handleProcessPayout(payout.id)}
                              title="Process"
                            >
                              <i className="bi bi-check-circle me-1"></i>Process
                            </button>
                          )}
                          <button 
                            className="btn btn-sm btn-warning" 
                            onClick={() => handleEdit(payout)} 
                            title="Edit"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-danger" 
                            onClick={() => handleDelete(payout.id)} 
                            title="Delete"
                          >
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

      {/* Add/Edit Payout Modal */}
      {showModal && (
        <>
          <div className="modal-backdrop show" onClick={closeModal}></div>
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editingPayout ? 'Edit Payout' : 'Add New Payout'}</h5>
                  <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
                </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Recipient</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.recipient}
                      onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Type</label>
                    <select
                      className="form-select"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="Commission">Commission</option>
                      <option value="Investment Return">Investment Return</option>
                      <option value="Refund">Refund</option>
                      <option value="Bonus">Bonus</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Amount ($)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Payment Method</label>
                    <select
                      className="form-select"
                      value={formData.method}
                      onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                    >
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="PayPal">PayPal</option>
                      <option value="Check">Check</option>
                      <option value="Wire Transfer">Wire Transfer</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Debit Card">Debit Card</option>
                      <option value="UPI">UPI</option>
                      <option value="Net Banking">Net Banking</option>
                      <option value="Mobile Payment">Mobile Payment</option>
                      <option value="Cryptocurrency">Cryptocurrency</option>
                      <option value="Cash">Cash</option>
                      <option value="Money Order">Money Order</option>
                      <option value="Digital Wallet">Digital Wallet</option>
                    </select>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Paid">Paid</option>
                        <option value="Failed">Failed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Refunded">Refunded</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Approved">Approved</option>
                        <option value="Declined">Declined</option>
                        <option value="Completed">Completed</option>
                        <option value="Partially Paid">Partially Paid</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn btn-primary">
                    {editingPayout ? 'Update Payout' : 'Add Payout'}
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

export default PayoutManagement;
