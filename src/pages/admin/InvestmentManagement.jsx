import React, { useState, useEffect } from 'react';

const InvestmentManagement = () => {
  const [investments, setInvestments] = useState([
    { id: 1, investorName: 'John Doe', amount: 50000, investmentDate: '2024-01-15', status: 'Ongoing' },
    { id: 2, investorName: 'Jane Smith', amount: 75000, investmentDate: '2024-01-20', status: 'Ongoing' },
    { id: 3, investorName: 'Bob Johnson', amount: 30000, investmentDate: '2024-02-01', status: 'Completed' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState(null);
  const [formData, setFormData] = useState({
    investmentOpportunity: '',
    amount: '',
    investor: '',
    payoutMode: '',
    paymentMethod: '',
    contractStart: '',
    contractEnd: '',
    coolOffPeriod: '',
    status: 'Ongoing',
    agreementSigned: false
  });

  // Investment opportunity options - Only Master Franchise and Signature Store
  const opportunityOptions = [
    'Master Franchise Opportunities',
    'Signature Store Opportunities'
  ];

  // Investor options (you can fetch from InvestorsManagement or hardcode)
  const investorOptions = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Williams'];

  // Payout mode options
  const payoutModeOptions = ['Monthly', 'Quarterly', 'Yearly', 'One-time'];

  const getInitialFormData = () => ({
    investmentOpportunity: '',
    amount: '',
    investor: '',
    payoutMode: '',
    paymentMethod: '',
    contractStart: '',
    contractEnd: '',
    coolOffPeriod: '',
    status: 'Ongoing',
    agreementSigned: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingInvestment) {
      setInvestments(investments.map(inv => 
        inv.id === editingInvestment.id 
          ? { 
              ...inv,
              investorName: formData.investor,
              amount: parseFloat(formData.amount),
              investmentDate: formData.contractStart,
              status: formData.status
            }
          : inv
      ));
    } else {
      const newId = investments.length > 0 ? Math.max(...investments.map(i => i.id)) + 1 : 1;
      setInvestments([...investments, {
        id: newId,
        investorName: formData.investor,
        amount: parseFloat(formData.amount),
        investmentDate: formData.contractStart,
        status: formData.status
      }]);
    }
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData(getInitialFormData());
    setEditingInvestment(null);
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

  const handleEdit = (investment) => {
    setEditingInvestment(investment);
    setFormData({
      investmentOpportunity: '',
      amount: investment.amount.toString(),
      investor: investment.investorName,
      payoutMode: '',
      paymentMethod: '',
      contractStart: investment.investmentDate,
      contractEnd: '',
      coolOffPeriod: '',
      status: investment.status,
      agreementSigned: false
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this investment?')) {
      setInvestments(investments.filter(inv => inv.id !== id));
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Format date for input (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    return dateString;
  };

  // Filter investments
  const filteredInvestments = investments.filter(investment => {
    const matchesSearch = 
      investment.investorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.amount.toString().includes(searchTerm);
    return matchesSearch;
  });

  return (
    <div className="fade-in-up">
      <div className="page-header">
        <h1 className="page-title">Investment Management</h1>
      </div>

      {/* Search and Add Button */}
      <div className="search-filter-bar">
        <input
          type="text"
          className="form-control"
          placeholder="Search name or amount..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button 
          className="btn btn-primary" 
          onClick={() => { 
            setShowModal(true); 
            setEditingInvestment(null); 
            setFormData(getInitialFormData()); 
          }}
        >
          Add Investment
        </button>
      </div>

      {/* Investments Table */}
      <div className="card">
        <div className="card-body p-0">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Investor Name</th>
                  <th>Amount</th>
                  <th>Investment Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvestments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      <div className="empty-state">
                        <i className="bi bi-inbox"></i>
                        <h4>No investments found</h4>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredInvestments.map((investment) => (
                    <tr key={investment.id}>
                      <td>{investment.investorName}</td>
                      <td>${investment.amount.toLocaleString()}</td>
                      <td>{formatDate(investment.investmentDate)}</td>
                      <td>
                        <span className={`badge ${
                          investment.status === 'Ongoing' 
                            ? 'badge-success' 
                            : investment.status === 'Completed' 
                            ? 'badge-info' 
                            : 'badge-warning'
                        }`}>
                          {investment.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn btn-sm btn-warning" 
                            onClick={() => handleEdit(investment)} 
                            title="Edit"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-danger" 
                            onClick={() => handleDelete(investment.id)} 
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

      {/* Add/Edit Investment Modal */}
      {showModal && (
        <>
          <div className="modal-backdrop show" onClick={closeModal}></div>
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editingInvestment ? 'Edit Investment' : 'Add Investment'}</h5>
                  <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="row">
                      {/* Investment Opportunity */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Investment Opportunity</label>
                        <select
                          className="form-select"
                          value={formData.investmentOpportunity}
                          onChange={(e) => setFormData({ ...formData, investmentOpportunity: e.target.value })}
                          required
                        >
                          <option value="">Select Opportunity</option>
                          {opportunityOptions.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>

                      {/* Amount */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Amount</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Amount"
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="row">
                      {/* Investor */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Investor</label>
                        <select
                          className="form-select"
                          value={formData.investor}
                          onChange={(e) => setFormData({ ...formData, investor: e.target.value })}
                          required
                        >
                          <option value="">Select Investor</option>
                          {investorOptions.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>

                      {/* Payout Mode */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Payout Mode</label>
                        <select
                          className="form-select"
                          value={formData.payoutMode}
                          onChange={(e) => setFormData({ ...formData, payoutMode: e.target.value })}
                          required
                        >
                          <option value="">Select Mode</option>
                          {payoutModeOptions.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="row">
                      {/* Payment Method */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Payment Method</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g., Bank Transfer"
                          value={formData.paymentMethod}
                          onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                          required
                        />
                      </div>

                      {/* Contract Start */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Contract Start</label>
                        <div className="input-wrapper">
                          <input
                            type="date"
                            className="form-control"
                            value={formatDateForInput(formData.contractStart)}
                            onChange={(e) => setFormData({ ...formData, contractStart: e.target.value })}
                            required
                          />
                          <i className="bi bi-calendar input-icon-right"></i>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      {/* Contract End */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Contract End</label>
                        <div className="input-wrapper">
                          <input
                            type="date"
                            className="form-control"
                            value={formatDateForInput(formData.contractEnd)}
                            onChange={(e) => setFormData({ ...formData, contractEnd: e.target.value })}
                            required
                          />
                          <i className="bi bi-calendar input-icon-right"></i>
                        </div>
                      </div>

                      {/* CoolOff Period */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">CoolOff Period</label>
                        <div className="input-wrapper">
                          <input
                            type="date"
                            className="form-control"
                            value={formatDateForInput(formData.coolOffPeriod)}
                            onChange={(e) => setFormData({ ...formData, coolOffPeriod: e.target.value })}
                            required
                          />
                          <i className="bi bi-calendar input-icon-right"></i>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      {/* Status */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Status</label>
                        <select
                          className="form-select"
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          required
                        >
                          <option value="Ongoing">Ongoing</option>
                          <option value="Completed">Completed</option>
                          <option value="Canceled">Canceled</option>
                        </select>
                      </div>

                      {/* Agreement Signed */}
                      <div className="col-md-6 mb-3 d-flex align-items-end">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="agreementSigned"
                            checked={formData.agreementSigned}
                            onChange={(e) => setFormData({ ...formData, agreementSigned: e.target.checked })}
                          />
                          <label className="form-check-label" htmlFor="agreementSigned">
                            Agreement Signed
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                    <button type="submit" className="btn btn-primary">
                      {editingInvestment ? 'Update Investment' : 'Add Investment'}
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

export default InvestmentManagement;
