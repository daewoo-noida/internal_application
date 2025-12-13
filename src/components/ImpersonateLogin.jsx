import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../utils/api';

const ImpersonateLogin = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setError('Invalid impersonation link');
            setLoading(false);
            return;
        }

        const loginWithToken = async () => {
            try {
                // Use token to login as user
                const response = await authAPI.loginWithImpersonation(token);
                const { token: authToken, user, isImpersonating, originalUser } = response.data;

                // CRITICAL: Store user data in the format your app expects
                localStorage.setItem('authToken', authToken);
                localStorage.setItem('userRole', 'Sales');
                localStorage.setItem('userData', JSON.stringify(user));
                localStorage.setItem('isImpersonating', isImpersonating);
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('loginTime', Date.now().toString());

                // Store user info in the format your Header component expects
                localStorage.setItem('user', JSON.stringify({
                    name: user.name,
                    email: user.email,
                    designation: user.designation,
                    role: 'Sales'
                }));

                if (originalUser) {
                    localStorage.setItem('originalAdmin', JSON.stringify(originalUser));
                }

                // Redirect to user dashboard
                navigate('/sales/dashboard');

            } catch (err) {
                console.error('Impersonation login error:', err);
                setError(err.response?.data?.message || 'Impersonation failed or token expired');
            } finally {
                setLoading(false);
            }
        };

        loginWithToken();
    }, [searchParams, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Logging in as user...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
                    <div className="text-red-500 mb-4">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-center mb-4">Impersonation Failed</h2>
                    <p className="text-gray-600 text-center mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                    >
                        Return to Admin Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return null;
};

export default ImpersonateLogin;