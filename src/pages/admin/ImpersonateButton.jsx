import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../utils/api';

const ImpersonateButton = ({ userId, userName }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleImpersonate = async () => {
        if (!window.confirm(`Login as ${userName}? You will be redirected to their dashboard.`)) {
            return;
        }

        setLoading(true);
        try {
            // Get impersonation token from backend
            const response = await authAPI.generateImpersonationToken(userId);
            const { token } = response.data;

            // Store the current admin session info
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('originalAdmin', JSON.stringify(currentUser));

            // Open new tab with impersonation token
            const impersonationUrl = `${window.location.origin}/impersonate-login?token=${token}`;
            window.open(impersonationUrl, '_blank');

        } catch (error) {
            console.error('Impersonation failed:', error);
            if (error.response?.status === 403) {
                alert('Access denied. Admin privileges required.');
            } else if (error.response?.status === 400) {
                alert('Cannot impersonate other admins.');
            } else {
                alert('Failed to login as user. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleImpersonate}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            title="Login as this user"
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {loading ? 'Generating Link...' : 'Login as User'}
        </button>
    );
};

export default ImpersonateButton;