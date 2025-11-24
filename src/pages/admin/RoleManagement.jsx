import React, { useState, useEffect } from 'react';

const RoleManagement = () => {
  const [roles, setRoles] = useState([
    { id: 1, name: 'Admin', description: 'Full system access', permissions: 'All', status: 'Active' },
    { id: 2, name: 'Manager', description: 'Management access', permissions: 'Limited', status: 'Active' },
    { id: 3, name: 'User', description: 'Basic user access', permissions: 'Basic', status: 'Active' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: '',
    status: 'Active'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingRole) {
      setRoles(roles.map(role => role.id === editingRole.id ? { ...formData, id: editingRole.id } : role));
    } else {
      const newId = roles.length > 0 ? Math.max(...roles.map(r => r.id)) + 1 : 1;
      setRoles([...roles, { ...formData, id: newId }]);
    }
    setShowModal(false);
    setFormData({ name: '', description: '', permissions: '', status: 'Active' });
    setEditingRole(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ name: '', description: '', permissions: '', status: 'Active' });
    setEditingRole(null);
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

  const handleEdit = (role) => {
    setEditingRole(role);
    setFormData(role);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      setRoles(roles.filter(role => role.id !== id));
    }
  };

  return (
    <div className="fade-in-up">
      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h1 className="page-title">Role Management</h1>
          <p className="page-subtitle">Manage user roles and permissions</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowModal(true); setEditingRole(null); setFormData({ name: '', description: '', permissions: '', status: 'Active' }); }}>
          <i className="bi bi-plus-circle me-2"></i>Add New Role
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Role Name</th>
                  <th>Description</th>
                  <th>Permissions</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.id}>
                    <td>{role.id}</td>
                    <td>{role.name}</td>
                    <td>{role.description}</td>
                    <td><span className="badge badge-info">{role.permissions}</span></td>
                    <td><span className={`badge ${role.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>{role.status}</span></td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-sm btn-warning" onClick={() => handleEdit(role)} title="Edit">
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(role.id)} title="Delete">
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
                <h5 className="modal-title">{editingRole ? 'Edit Role' : 'Add New Role'}</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Role Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="3"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Permissions</label>
                    <select
                      className="form-select"
                      value={formData.permissions}
                      onChange={(e) => setFormData({ ...formData, permissions: e.target.value })}
                      required
                    >
                      <option value="">Select Permissions</option>
                      <option value="All">All</option>
                      <option value="Limited">Limited</option>
                      <option value="Basic">Basic</option>
                    </select>
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

export default RoleManagement;
