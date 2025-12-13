import { useState } from 'react';
import { authAPI } from '../utils/api';

const ImpersonationBanner = () => {
    const [exiting, setExiting] = useState(false);

    const isImpersonating = localStorage.getItem('isImpersonating') === 'true';
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const originalAdmin = JSON.parse(localStorage.getItem('originalAdmin') || 'null');

    const handleExitImpersonation = async () => {
        if (!window.confirm('Exit impersonation and return to admin dashboard?')) {
            return;
        }

        setExiting(true);
        try {
            await authAPI.exitImpersonation();

            // Clear current session
            localStorage.removeItem('authToken');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userData');
            localStorage.removeItem('user');
            localStorage.removeItem('isImpersonating');
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('salesProfileComplete');

            window.location.href = '/admin/dashboard';

        } catch (error) {
            console.error('Failed to exit impersonation:', error);
            alert('Failed to exit. Please try again.');
            setExiting(false);
        }
    };

    if (!isImpersonating) return null;

    return (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4" style={{ marginTop: "80px" }}>
            <div className="flex items-center justify-between" >
                <div className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">
                        You are viewing as: <span className="text-blue-600">{currentUser.name}</span> ({currentUser.email})
                    </span>
                </div>
                <button
                    onClick={handleExitImpersonation}
                    disabled={exiting}
                    className="px-4 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
                >
                    {exiting ? 'Exiting...' : 'Exit Impersonation'}
                </button>
            </div>
        </div>
    );
};

export default ImpersonationBanner;