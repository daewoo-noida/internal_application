import React, { useState, useEffect } from 'react';

const SalesManagement = () => {
  const [sales, setSales] = useState([
    { id: 1, saleId: 'SALE001', customer: 'John Doe', product: 'Investment Plan A', amount: 5000, commission: 250, date: '2024-02-15', status: 'Completed', salesperson: 'Alice Brown' },
    { id: 2, saleId: 'SALE002', customer: 'Jane Smith', product: 'Investment Plan B', amount: 10000, commission: 500, date: '2024-02-16', status: 'Pending', salesperson: 'Bob White' },
    { id: 3, saleId: 'SALE003', customer: 'Bob Johnson', product: 'Investment Plan C', amount: 7500, commission: 375, date: '2024-02-17', status: 'Completed', salesperson: 'Alice Brown' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [formData, setFormData] = useState({
    customer: '',
    product: '',
    amount: '',
    commission: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Pending',
    salesperson: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingSale) {
      setSales(sales.map(sale => sale.id === editingSale.id ? { ...formData, id: editingSale.id, saleId: editingSale.saleId, amount: parseFloat(formData.amount), commission: parseFloat(formData.commission) } : sale));
    } else {
      const newId = sales.length > 0 ? Math.max(...sales.map(s => s.id)) + 1 : 1;
      const saleNum = String(newId).padStart(3, '0');
      setSales([...sales, { ...formData, id: newId, saleId: `SALE${saleNum}`, amount: parseFloat(formData.amount), commission: parseFloat(formData.commission) }]);
    }
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      customer: '',
      product: '',
      amount: '',
      commission: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      salesperson: ''
    });
    setEditingSale(null);
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

  const handleEdit = (sale) => {
    setEditingSale(sale);
    setFormData({ ...sale, amount: sale.amount.toString(), commission: sale.commission.toString() });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      setSales(sales.filter(sale => sale.id !== id));
    }
  };

  // Filter sales
  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.saleId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || sale.status === filterStatus;
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
    customer: '',
    product: '',
    amount: '',
    commission: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Pending',
    salesperson: ''
  });

  return (
    <div className="fade-in-up">
      <div className="page-header">
        <h1 className="page-title">Sales Management</h1>
      </div>

      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <input
          type="text"
          className="form-control"
          placeholder="Search by customer name or sale ID..."
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
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button 
          className="btn btn-primary" 
          onClick={() => { 
            setShowModal(true); 
            setEditingSale(null); 
            setFormData(getInitialFormData()); 
          }}
        >
          Add New Sale
        </button>
      </div>

      {/* Sales Table */}
      <div className="card">
        <div className="card-body p-0">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Sale ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Commission</th>
                  <th>Salesperson</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      <div className="empty-state">
                        <i className="bi bi-cart-x"></i>
                        <h4>No sales found</h4>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSales.map((sale) => (
                    <tr key={sale.id}>
                      <td>{sale.saleId}</td>
                      <td>{sale.customer}</td>
                      <td>{sale.product}</td>
                      <td>${sale.amount.toLocaleString()}</td>
                      <td>${sale.commission.toLocaleString()}</td>
                      <td>{sale.salesperson}</td>
                      <td>{sale.date}</td>
                      <td>
                        <span className={`badge ${
                          sale.status === 'Completed' 
                            ? 'badge-success' 
                            : sale.status === 'Pending' 
                            ? 'badge-warning' 
                            : 'badge-danger'
                        }`}>
                          {sale.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn btn-sm btn-warning" onClick={() => handleEdit(sale)} title="Edit">
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(sale.id)} title="Delete">
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

      {/* Add/Edit Sale Modal */}
      {showModal && (
        <>
          <div className="modal-backdrop show" onClick={closeModal}></div>
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editingSale ? 'Edit Sale' : 'Add New Sale'}</h5>
                  <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
                </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Customer Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.customer}
                      onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Product</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.product}
                      onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                      required
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Amount ($)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Commission ($)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.commission}
                        onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Salesperson</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.salesperson}
                      onChange={(e) => setFormData({ ...formData, salesperson: e.target.value })}
                      required
                    />
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
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn btn-primary">
                    {editingSale ? 'Update Sale' : 'Add Sale'}
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

export default SalesManagement;
