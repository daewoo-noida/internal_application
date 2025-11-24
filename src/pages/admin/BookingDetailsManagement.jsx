import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BookingDetailsManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal-info');
  
  // Extended booking data with all required fields
  const bookingsData = {
    1: {
      id: 1,
      bookingId: 'BK001',
      customer: 'Jyoti Bansal',
      // Personal Info
      fullName: 'Jyoti Bansal',
      email: 'jyoti.bansal@example.com',
      phone: '9876543210',
      altPhone: '-',
      territory: 'Delhi FICO',
      state: 'Delhi',
      city: 'Delhi',
      district: 'Central Delhi',
      streetAddress: '123 Main Street',
      pincode: '110001',
      opportunity: 'signaturestore',
      paymentStatus: 'Pending',
      // Office Details
      officeBranch: 'Chandigarh',
      leadSuccessCoordinator: 'Vandana Singh',
      partnerRelationshipExecutive: 'Shivani Negi',
      salesOnboardingManager: 'Ruchi Kagra',
      leadSource: 'Madhu Leads',
      // Payment Details
      dealAmount: 12500000,
      tokenReceived: 1000000,
      tokenDate: 'Sun Nov 09 2025',
      balanceDue: '-',
      modeOfPayment: 'Cheque',
      remarks: '-',
      additionalCommitment: '-',
      tokenApproved: false,
      payment1Date: '-',
      payment1Amount: '-',
      payment1Status: 'Pending',
      financeTeamApproval: 'Pending',
      // Documents
      documents: {
        aadhaarFront: { uploaded: true, status: 'Pending', file: 'aadhaar_front.jpg' },
        aadhaarBack: { uploaded: true, status: 'Pending', file: 'aadhaar_back.jpg' },
        panCard: { uploaded: true, status: 'Pending', file: 'pan_card.jpg' },
        companyPAN: { uploaded: true, status: 'Pending', file: 'company_pan.jpg' },
        gstNumber: { uploaded: false, status: '', file: null },
        addressProof: { uploaded: false, status: 'Pending', file: null },
        attachedImage: { uploaded: false, status: 'Pending', file: null }
      }
    },
    2: {
      id: 2,
      bookingId: 'BK002',
      customer: 'Rajesh Kumar',
      fullName: 'Rajesh Kumar',
      email: 'rajesh.kumar@example.com',
      phone: '9876543211',
      altPhone: '-',
      territory: 'Mumbai FICO',
      state: 'Maharashtra',
      city: 'Mumbai',
      district: 'Mumbai Central',
      streetAddress: '456 Business Avenue',
      pincode: '400001',
      opportunity: 'signaturestore',
      paymentStatus: 'Pending',
      officeBranch: 'Mumbai',
      leadSuccessCoordinator: 'Priya Desai',
      partnerRelationshipExecutive: 'Amit Shah',
      salesOnboardingManager: 'Neha Patel',
      leadSource: 'Online Leads',
      dealAmount: 15000000,
      tokenReceived: 0,
      tokenDate: '-',
      balanceDue: '-',
      modeOfPayment: '-',
      remarks: '-',
      additionalCommitment: '-',
      tokenApproved: false,
      payment1Date: '-',
      payment1Amount: '-',
      payment1Status: 'Pending',
      financeTeamApproval: 'Pending',
      documents: {
        aadhaarFront: { uploaded: false, status: 'Pending', file: null },
        aadhaarBack: { uploaded: false, status: 'Pending', file: null },
        panCard: { uploaded: false, status: 'Pending', file: null },
        companyPAN: { uploaded: false, status: 'Pending', file: null },
        gstNumber: { uploaded: false, status: '', file: null },
        addressProof: { uploaded: false, status: 'Pending', file: null },
        attachedImage: { uploaded: false, status: 'Pending', file: null }
      }
    },
    3: {
      id: 3,
      bookingId: 'BK003',
      customer: 'Priya Sharma',
      fullName: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '9876543212',
      altPhone: '9876543213',
      territory: 'Bangalore FICO',
      state: 'Karnataka',
      city: 'Bangalore',
      district: 'Shimoga',
      streetAddress: '789 Tech Park',
      pincode: '577202',
      opportunity: 'signaturestore',
      paymentStatus: 'Paid',
      officeBranch: 'Bangalore',
      leadSuccessCoordinator: 'Sneha Reddy',
      partnerRelationshipExecutive: 'Vikram Singh',
      salesOnboardingManager: 'Ananya Gupta',
      leadSource: 'Referral',
      dealAmount: 10000000,
      tokenReceived: 5000000,
      tokenDate: 'Mon Oct 15 2025',
      balanceDue: '5000000',
      modeOfPayment: 'Bank Transfer',
      remarks: 'Initial payment received',
      additionalCommitment: '-',
      tokenApproved: true,
      payment1Date: 'Mon Oct 15 2025',
      payment1Amount: '5000000',
      payment1Status: 'Completed',
      financeTeamApproval: 'Approved',
      documents: {
        aadhaarFront: { uploaded: true, status: 'Approved', file: 'aadhaar_front.jpg' },
        aadhaarBack: { uploaded: true, status: 'Approved', file: 'aadhaar_back.jpg' },
        panCard: { uploaded: true, status: 'Approved', file: 'pan_card.jpg' },
        companyPAN: { uploaded: true, status: 'Approved', file: 'company_pan.jpg' },
        gstNumber: { uploaded: true, status: 'Approved', file: 'gst.jpg' },
        addressProof: { uploaded: true, status: 'Approved', file: 'address_proof.jpg' },
        attachedImage: { uploaded: false, status: 'Pending', file: null }
      }
    },
    4: {
      id: 4,
      bookingId: 'BK004',
      customer: 'Amit Patel',
      fullName: 'Amit Patel',
      email: 'amit.patel@example.com',
      phone: '9876543213',
      altPhone: '-',
      territory: 'Ahmedabad FICO',
      state: 'Gujarat',
      city: 'Ahmedabad',
      district: 'Ahmedabad Central',
      streetAddress: '321 Commerce Street',
      pincode: '380001',
      opportunity: 'signaturestore',
      paymentStatus: 'Pending',
      officeBranch: 'Ahmedabad',
      leadSuccessCoordinator: 'Ravi Patel',
      partnerRelationshipExecutive: 'Kavita Mehta',
      salesOnboardingManager: 'Raj Mehta',
      leadSource: 'Social Media',
      dealAmount: 8000000,
      tokenReceived: 0,
      tokenDate: '-',
      balanceDue: '-',
      modeOfPayment: '-',
      remarks: '-',
      additionalCommitment: '-',
      tokenApproved: false,
      payment1Date: '-',
      payment1Amount: '-',
      payment1Status: 'Pending',
      financeTeamApproval: 'Pending',
      documents: {
        aadhaarFront: { uploaded: false, status: 'Pending', file: null },
        aadhaarBack: { uploaded: false, status: 'Pending', file: null },
        panCard: { uploaded: false, status: 'Pending', file: null },
        companyPAN: { uploaded: false, status: 'Pending', file: null },
        gstNumber: { uploaded: false, status: '', file: null },
        addressProof: { uploaded: false, status: 'Pending', file: null },
        attachedImage: { uploaded: false, status: 'Pending', file: null }
      }
    },
    5: {
      id: 5,
      bookingId: 'BK005',
      customer: 'Sneha Reddy',
      fullName: 'Sneha Reddy',
      email: 'sneha.reddy@example.com',
      phone: '9876543214',
      altPhone: '-',
      territory: 'Hyderabad FICO',
      state: 'Telangana',
      city: 'Hyderabad',
      district: 'Hyderabad Central',
      streetAddress: '654 Finance Hub',
      pincode: '500001',
      opportunity: 'signaturestore',
      paymentStatus: 'Paid',
      officeBranch: 'Hyderabad',
      leadSuccessCoordinator: 'Anjali Rao',
      partnerRelationshipExecutive: 'Suresh Kumar',
      salesOnboardingManager: 'Lakshmi Reddy',
      leadSource: 'Website',
      dealAmount: 12000000,
      tokenReceived: 3000000,
      tokenDate: 'Wed Nov 01 2025',
      balanceDue: '9000000',
      modeOfPayment: 'UPI',
      remarks: 'Token payment completed',
      additionalCommitment: '-',
      tokenApproved: true,
      payment1Date: 'Wed Nov 01 2025',
      payment1Amount: '3000000',
      payment1Status: 'Completed',
      financeTeamApproval: 'Approved',
      documents: {
        aadhaarFront: { uploaded: true, status: 'Approved', file: 'aadhaar_front.jpg' },
        aadhaarBack: { uploaded: true, status: 'Approved', file: 'aadhaar_back.jpg' },
        panCard: { uploaded: true, status: 'Pending', file: 'pan_card.jpg' },
        companyPAN: { uploaded: true, status: 'Pending', file: 'company_pan.jpg' },
        gstNumber: { uploaded: false, status: '', file: null },
        addressProof: { uploaded: false, status: 'Pending', file: null },
        attachedImage: { uploaded: false, status: 'Pending', file: null }
      }
    },
    6: {
      id: 6,
      bookingId: 'BK006',
      customer: 'Vikram Singh',
      fullName: 'Vikram Singh',
      email: 'vikram.singh@example.com',
      phone: '9876543215',
      altPhone: '-',
      territory: 'Pune FICO',
      state: 'Maharashtra',
      city: 'Pune',
      district: 'Pune Central',
      streetAddress: '987 Corporate Tower',
      pincode: '411001',
      opportunity: 'signaturestore',
      paymentStatus: 'Pending',
      officeBranch: 'Pune',
      leadSuccessCoordinator: 'Meera Joshi',
      partnerRelationshipExecutive: 'Kiran Patil',
      salesOnboardingManager: 'Rahul Deshpande',
      leadSource: 'Partner Network',
      dealAmount: 9000000,
      tokenReceived: 0,
      tokenDate: '-',
      balanceDue: '-',
      modeOfPayment: '-',
      remarks: '-',
      additionalCommitment: '-',
      tokenApproved: false,
      payment1Date: '-',
      payment1Amount: '-',
      payment1Status: 'Pending',
      financeTeamApproval: 'Pending',
      documents: {
        aadhaarFront: { uploaded: false, status: 'Pending', file: null },
        aadhaarBack: { uploaded: false, status: 'Pending', file: null },
        panCard: { uploaded: false, status: 'Pending', file: null },
        companyPAN: { uploaded: false, status: 'Pending', file: null },
        gstNumber: { uploaded: false, status: '', file: null },
        addressProof: { uploaded: false, status: 'Pending', file: null },
        attachedImage: { uploaded: false, status: 'Pending', file: null }
      }
    },
    7: {
      id: 7,
      bookingId: 'BK007',
      customer: 'Ananya Gupta',
      fullName: 'Ananya Gupta',
      email: 'ananya.gupta@example.com',
      phone: '9876543216',
      altPhone: '-',
      territory: 'Kolkata FICO',
      state: 'West Bengal',
      city: 'Kolkata',
      district: 'Kolkata Central',
      streetAddress: '147 Business Plaza',
      pincode: '700001',
      opportunity: 'signaturestore',
      paymentStatus: 'Paid',
      officeBranch: 'Kolkata',
      leadSuccessCoordinator: 'Soumitra Das',
      partnerRelationshipExecutive: 'Ritika Banerjee',
      salesOnboardingManager: 'Arindam Sen',
      leadSource: 'Email Campaign',
      dealAmount: 11000000,
      tokenReceived: 2000000,
      tokenDate: 'Fri Oct 25 2025',
      balanceDue: '9000000',
      modeOfPayment: 'Cheque',
      remarks: 'Cheque cleared',
      additionalCommitment: '-',
      tokenApproved: true,
      payment1Date: 'Fri Oct 25 2025',
      payment1Amount: '2000000',
      payment1Status: 'Completed',
      financeTeamApproval: 'Approved',
      documents: {
        aadhaarFront: { uploaded: true, status: 'Approved', file: 'aadhaar_front.jpg' },
        aadhaarBack: { uploaded: true, status: 'Approved', file: 'aadhaar_back.jpg' },
        panCard: { uploaded: true, status: 'Approved', file: 'pan_card.jpg' },
        companyPAN: { uploaded: true, status: 'Approved', file: 'company_pan.jpg' },
        gstNumber: { uploaded: true, status: 'Approved', file: 'gst.jpg' },
        addressProof: { uploaded: true, status: 'Approved', file: 'address_proof.jpg' },
        attachedImage: { uploaded: true, status: 'Approved', file: 'attached_image.jpg' }
      }
    }
  };

  const bookingId = parseInt(id) || 1;
  const defaultBooking = bookingsData[bookingId] || bookingsData[1];
  const [booking, setBooking] = useState(defaultBooking);
  const [documentStatuses, setDocumentStatuses] = useState(booking.documents || {});

  useEffect(() => {
    const bookingIdNum = parseInt(id) || 1;
    const selectedBooking = bookingsData[bookingIdNum] || bookingsData[1];
    setBooking(selectedBooking);
    setDocumentStatuses(selectedBooking.documents || {});
  }, [id]);

  const handleDocumentApprove = (docType) => {
    setDocumentStatuses(prev => ({
      ...prev,
      [docType]: { ...prev[docType], status: 'Approved' }
    }));
    alert(`${docType} approved successfully!`);
  };

  const handleDocumentReplace = (docType) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setDocumentStatuses(prev => ({
          ...prev,
          [docType]: { ...prev[docType], uploaded: true, file: file.name, status: 'Pending' }
        }));
        alert(`${docType} replaced successfully!`);
      }
    };
    input.click();
  };

  const handleDocumentUpload = (docType) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setDocumentStatuses(prev => ({
          ...prev,
          [docType]: { ...prev[docType], uploaded: true, file: file.name, status: 'Pending' }
        }));
        alert(`${docType} uploaded successfully!`);
      }
    };
    input.click();
  };

  const handleConfirmToken = () => {
    setBooking(prev => ({ ...prev, tokenApproved: true }));
    alert('Token approved successfully!');
  };

  const handleMarkAsBooked = () => {
    if (window.confirm('Mark this booking as booked?')) {
      alert('Booking marked as booked!');
    }
  };

  const handleConvertToInvestment = () => {
    if (window.confirm('Convert this booking to investment?')) {
      alert('Booking converted to investment!');
    }
  };

  const handleViewPaymentProof = () => {
    alert('Opening payment proof document...');
  };

  const formatCurrency = (amount) => {
    if (!amount || amount === '-') return '-';
    return new Intl.NumberFormat('en-IN').format(amount);
  };

  const InfoField = ({ label, value }) => (
    <div className="mb-3">
      <div className="text-muted small mb-1">{label}</div>
      <div className="fw-bold">{value || '-'}</div>
    </div>
  );

  return (
    <div className="fade-in-up">
      <div className="page-header mb-4">
        <button className="btn btn-secondary mb-3" onClick={() => navigate('/admin/booking-list-management')}>
          <i className="bi bi-arrow-left me-2"></i>Back to List
        </button>
        <h1 className="page-title mb-2">Booking Details - {booking.fullName || booking.customer}</h1>
        
        {/* Tabs */}
        <div className="booking-details-tabs">
          <button
            className={`booking-tab ${activeTab === 'personal-info' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal-info')}
          >
            Personal Info
          </button>
          <button
            className={`booking-tab ${activeTab === 'office-details' ? 'active' : ''}`}
            onClick={() => setActiveTab('office-details')}
          >
            Office Details
          </button>
          <button
            className={`booking-tab ${activeTab === 'payment-details' ? 'active' : ''}`}
            onClick={() => setActiveTab('payment-details')}
          >
            Payment Details
          </button>
          <button
            className={`booking-tab ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            Documents
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="booking-tab-content">
        {/* Personal Info Tab */}
        {activeTab === 'personal-info' && (
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <InfoField label="Full Name" value={booking.fullName} />
                  <InfoField label="Phone" value={booking.phone} />
                  <InfoField label="Territory" value={booking.territory} />
                  <InfoField label="State" value={booking.state} />
                  <InfoField label="City" value={booking.city} />
                  <InfoField label="Pincode" value={booking.pincode} />
                </div>
                <div className="col-md-6">
                  <InfoField label="Email" value={booking.email} />
                  <InfoField label="Alt Phone" value={booking.altPhone} />
                  <InfoField label="Opportunity" value={booking.opportunity} />
                  <InfoField label="District" value={booking.district} />
                  <InfoField label="Street Address" value={booking.streetAddress} />
                  <div className="mb-3">
                    <div className="text-muted small mb-1">Payment Status</div>
                    <div className="fw-bold">
                      {booking.paymentStatus}
                      {booking.paymentStatus === 'Pending' && (
                        <i className="bi bi-x-circle text-danger ms-2"></i>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Office Details Tab */}
        {activeTab === 'office-details' && (
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <InfoField label="Office Branch" value={booking.officeBranch} />
                  <InfoField label="Lead Success Coordinator" value={booking.leadSuccessCoordinator} />
                  <InfoField label="Partner Relationship Executive" value={booking.partnerRelationshipExecutive} />
                </div>
                <div className="col-md-6">
                  <InfoField label="Sales Onboarding Manager" value={booking.salesOnboardingManager} />
                  <InfoField label="Lead Source" value={booking.leadSource} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Details Tab */}
        {activeTab === 'payment-details' && (
          <div>
            {/* Overall Payment Info */}
            <div className="card mb-3">
              <div className="card-body position-relative">
                <button 
                  className="btn btn-secondary position-absolute top-0 end-0 m-3"
                  onClick={handleMarkAsBooked}
                  style={{ top: '10px', right: '10px' }}
                >
                  Mark as Booked
                </button>
                <h5 className="mb-4">Overall Payment Info</h5>
                <div className="row">
                  <div className="col-md-6">
                    <InfoField label="Deal Amount" value={formatCurrency(booking.dealAmount)} />
                    <InfoField label="Token Received" value={formatCurrency(booking.tokenReceived)} />
                    <InfoField label="Token Date" value={booking.tokenDate} />
                    <InfoField label="Balance Due" value={booking.balanceDue} />
                  </div>
                  <div className="col-md-6">
                    <InfoField label="Mode of Payment" value={booking.modeOfPayment} />
                    <InfoField label="Remarks" value={booking.remarks} />
                    <InfoField label="Additional Commitment" value={booking.additionalCommitment} />
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="text-muted small mb-2">Token Approval</div>
                      {!booking.tokenApproved ? (
                        <button className="btn btn-secondary" onClick={handleConfirmToken}>
                          Confirm Token Received
                        </button>
                      ) : (
                        <span className="badge badge-success">Approved</span>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <div className="text-muted small mb-2">Payment Proof:</div>
                      <button className="btn btn-link p-0 text-primary text-decoration-underline" onClick={handleViewPaymentProof}>
                        View Payment Proof
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment 1 */}
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="mb-4">Payment 1</h5>
                <div className="row">
                  <div className="col-md-4">
                    <InfoField label="Date" value={booking.payment1Date} />
                  </div>
                  <div className="col-md-4">
                    <InfoField label="Amount" value={formatCurrency(booking.payment1Amount)} />
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <div className="text-muted small mb-1">Status</div>
                      <div className="fw-bold">
                        <span className={`badge ${booking.payment1Status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>
                          {booking.payment1Status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label text-muted small">Finance Team Approval</label>
                      <select className="form-select" value={booking.financeTeamApproval}>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Expected Payment Info */}
            <div className="card">
              <div className="card-body">
                <h5 className="mb-4">Expected Payment Info</h5>
                <button className="btn btn-secondary" onClick={handleConvertToInvestment}>
                  Convert to Investment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="row">
            {/* Left Column */}
            <div className="col-md-6">
              {/* Aadhaar Front */}
              <div className="card mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">Aadhaar Front</h6>
                    {documentStatuses.aadhaarFront?.status && (
                      <span className={`badge ${documentStatuses.aadhaarFront.status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>
                        {documentStatuses.aadhaarFront.status}
                      </span>
                    )}
                  </div>
                  {documentStatuses.aadhaarFront?.uploaded ? (
                    <div className="document-preview mb-3">
                      <div className="document-placeholder">
                        <i className="bi bi-file-image" style={{ fontSize: '3rem' }}></i>
                        <div>Aadhaar Front</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted mb-3">No file uploaded</div>
                  )}
                  <div className="d-flex gap-2">
                    {documentStatuses.aadhaarFront?.uploaded && (
                      <>
                        <button className="btn btn-success btn-sm" onClick={() => handleDocumentApprove('aadhaarFront')}>
                          Approve
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleDocumentReplace('aadhaarFront')}>
                          Replace
                        </button>
                      </>
                    )}
                    {!documentStatuses.aadhaarFront?.uploaded && (
                      <button className="btn btn-secondary btn-sm" onClick={() => handleDocumentUpload('aadhaarFront')}>
                        Upload
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* PAN Card */}
              <div className="card mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">PAN Card</h6>
                    {documentStatuses.panCard?.status && (
                      <span className={`badge ${documentStatuses.panCard.status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>
                        {documentStatuses.panCard.status}
                      </span>
                    )}
                  </div>
                  {documentStatuses.panCard?.uploaded ? (
                    <div className="document-preview mb-3">
                      <div className="document-placeholder">
                        <i className="bi bi-file-image" style={{ fontSize: '3rem' }}></i>
                        <div>PAN Card</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted mb-3">No file uploaded</div>
                  )}
                  <div className="d-flex gap-2">
                    {documentStatuses.panCard?.uploaded && (
                      <>
                        <button className="btn btn-success btn-sm" onClick={() => handleDocumentApprove('panCard')}>
                          Approve
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleDocumentReplace('panCard')}>
                          Replace
                        </button>
                      </>
                    )}
                    {!documentStatuses.panCard?.uploaded && (
                      <button className="btn btn-secondary btn-sm" onClick={() => handleDocumentUpload('panCard')}>
                        Upload
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* GST Number */}
              <div className="card mb-3">
                <div className="card-body">
                  <h6 className="mb-3">GST Number</h6>
                  <div className="text-muted mb-3">{booking.documents?.gstNumber?.value || '-'}</div>
                </div>
              </div>

              {/* Attached Image */}
              <div className="card mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">Attached Image</h6>
                    {documentStatuses.attachedImage?.status && (
                      <span className={`badge ${documentStatuses.attachedImage.status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>
                        {documentStatuses.attachedImage.status}
                      </span>
                    )}
                  </div>
                  {documentStatuses.attachedImage?.uploaded ? (
                    <div className="text-muted mb-3">File: {documentStatuses.attachedImage.file}</div>
                  ) : (
                    <div className="text-muted mb-3">No file uploaded.</div>
                  )}
                  <button className="btn btn-secondary btn-sm" onClick={() => handleDocumentUpload('attachedImage')}>
                    Upload
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-md-6">
              {/* Aadhaar Back */}
              <div className="card mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">Aadhaar Back</h6>
                    {documentStatuses.aadhaarBack?.status && (
                      <span className={`badge ${documentStatuses.aadhaarBack.status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>
                        {documentStatuses.aadhaarBack.status}
                      </span>
                    )}
                  </div>
                  {documentStatuses.aadhaarBack?.uploaded ? (
                    <div className="document-preview mb-3">
                      <div className="document-placeholder">
                        <i className="bi bi-file-image" style={{ fontSize: '3rem' }}></i>
                        <div>Aadhaar Back</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted mb-3">No file uploaded</div>
                  )}
                  <div className="d-flex gap-2">
                    {documentStatuses.aadhaarBack?.uploaded && (
                      <>
                        <button className="btn btn-success btn-sm" onClick={() => handleDocumentApprove('aadhaarBack')}>
                          Approve
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleDocumentReplace('aadhaarBack')}>
                          Replace
                        </button>
                      </>
                    )}
                    {!documentStatuses.aadhaarBack?.uploaded && (
                      <button className="btn btn-secondary btn-sm" onClick={() => handleDocumentUpload('aadhaarBack')}>
                        Upload
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Company PAN */}
              <div className="card mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">Company PAN</h6>
                    {documentStatuses.companyPAN?.status && (
                      <span className={`badge ${documentStatuses.companyPAN.status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>
                        {documentStatuses.companyPAN.status}
                      </span>
                    )}
                  </div>
                  {documentStatuses.companyPAN?.uploaded ? (
                    <div className="document-preview mb-3">
                      <div className="document-placeholder">
                        <i className="bi bi-file-image" style={{ fontSize: '3rem' }}></i>
                        <div>Company PAN</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted mb-3">No file uploaded</div>
                  )}
                  <div className="d-flex gap-2">
                    {documentStatuses.companyPAN?.uploaded && (
                      <>
                        <button className="btn btn-success btn-sm" onClick={() => handleDocumentApprove('companyPAN')}>
                          Approve
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleDocumentReplace('companyPAN')}>
                          Replace
                        </button>
                      </>
                    )}
                    {!documentStatuses.companyPAN?.uploaded && (
                      <button className="btn btn-secondary btn-sm" onClick={() => handleDocumentUpload('companyPAN')}>
                        Upload
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Proof */}
              <div className="card mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">Address Proof</h6>
                    {documentStatuses.addressProof?.status && (
                      <span className={`badge ${documentStatuses.addressProof.status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>
                        {documentStatuses.addressProof.status}
                      </span>
                    )}
                  </div>
                  {documentStatuses.addressProof?.uploaded ? (
                    <div className="text-muted mb-3">File: {documentStatuses.addressProof.file}</div>
                  ) : (
                    <div className="text-muted mb-3">No file uploaded.</div>
                  )}
                  <button className="btn btn-secondary btn-sm" onClick={() => handleDocumentUpload('addressProof')}>
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Close Button */}
      <div className="text-end mt-4">
        <button className="btn btn-secondary" onClick={() => navigate('/admin/booking-list-management')}>
          Close
        </button>
      </div>
    </div>
  );
}

export default BookingDetailsManagement;
