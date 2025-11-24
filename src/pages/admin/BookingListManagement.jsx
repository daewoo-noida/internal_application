import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingsAPI } from '../../utils/api';

const BookingListManagement = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Fetch bookings from API
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookingsAPI.getAll();
      setBookings(response.data.data || response.data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings. Please try again later.');
      // Fallback to empty array or show error message
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const badges = {
      'Confirmed': 'badge-success',
      'Pending': 'badge-warning',
      'Cancelled': 'badge-danger',
      'Completed': 'badge-info'
    };
    return badges[status] || 'badge-secondary';
  };

  const handleViewDetails = (booking) => {
    navigate(`/admin/booking-details-management/${booking.id}`);
  };

  const handleDelete = async (id, bookingId) => {
    if (window.confirm(`Are you sure you want to delete booking ${bookingId}?`)) {
      try {
        await bookingsAPI.delete(id);
        // Refresh bookings list
        fetchBookings();
      } catch (err) {
        console.error('Error deleting booking:', err);
        alert('Failed to delete booking. Please try again.');
      }
    }
  };

  return (
    <div className="fade-in-up">
      <div className="page-header">
        <h1 className="page-title">Booking List Management</h1>
        <p className="page-subtitle">View and manage all bookings</p>
      </div>

      <div className="search-filter-bar">
        <input
          type="text"
          className="form-control"
          placeholder="Search by customer name or booking ID..."
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
          <option value="Confirmed">Confirmed</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="card booking-list-table">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading bookings...</p>
            </div>
          ) : error ? (
            <div className="text-center py-5">
              <div className="alert alert-danger" role="alert">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
                <button className="btn btn-sm btn-outline-danger ms-3" onClick={fetchBookings}>
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Booking ID</th>
                    <th>Service/Opportunity</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center">
                        <div className="empty-state">
                          <i className="bi bi-calendar-x"></i>
                          <h4>No bookings found</h4>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>{booking.customer || booking.fullName || booking.leadName || 'N/A'}</td>
                        <td>{booking.bookingId || `BK${String(booking.id).padStart(3, '0')}`}</td>
                        <td>{booking.service || booking.opportunity || 'N/A'}</td>
                        <td>{booking.date || booking.submittedDate || 'N/A'}</td>
                        <td>{booking.time || 'N/A'}</td>
                        <td>{booking.amount ? `₹${booking.amount.toLocaleString('en-IN')}` : booking.dealAmount || 'N/A'}</td>
                        <td><span className={`badge ${getStatusBadge(booking.status || booking.paymentStatus || 'Pending')}`}>{booking.status || booking.paymentStatus || 'Pending'}</span></td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn btn-sm btn-primary me-2" onClick={() => handleViewDetails(booking)} title="View">
                              <i className="bi bi-eye"></i>
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(booking.id, booking.bookingId || `BK${String(booking.id).padStart(3, '0')}`)} title="Delete">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingListManagement;
