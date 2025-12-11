import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Calendar, Clock } from 'lucide-react';
import { meetingAPI } from '../../utils/api';

export default function MeetingResponse() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [meeting, setMeeting] = useState(null);

    const meetingId = searchParams.get('meetingId');
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    useEffect(() => {
        const handleResponse = async () => {
            if (!meetingId || !userId || !status) {
                setLoading(false);
                return;
            }

            try {
                // If user is logged in, use the authenticated API
                const token = localStorage.getItem('authToken');
                if (token) {
                    await meetingAPI.updateResponse(meetingId, { status });
                } else {
                    // If not logged in, use the public endpoint
                    await fetch(`${process.env.VITE_API_URL}/meetings/email-response?meetingId=${meetingId}&userId=${userId}&status=${status}`);
                }

                // Fetch meeting details for display
                const response = await fetch(`${process.env.VITE_API_URL}/meetings/${meetingId}`);
                if (response.ok) {
                    const data = await response.json();
                    setMeeting(data.meeting);
                }

                setSuccess(true);
            } catch (error) {
                console.error('Error handling response:', error);
            } finally {
                setLoading(false);
            }
        };

        handleResponse();
    }, [meetingId, userId, status]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Processing your response...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className={`p-8 text-center ${status === 'accepted' ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-lg mb-6">
                        {status === 'accepted' ? (
                            <CheckCircle className="text-green-500" size={48} />
                        ) : (
                            <XCircle className="text-red-500" size={48} />
                        )}
                    </div>

                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        {status === 'accepted' ? 'Meeting Accepted!' : 'Meeting Declined'}
                    </h1>

                    <p className="text-gray-600 mb-6">
                        Your response has been recorded successfully.
                    </p>

                    {meeting && (
                        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                            <h3 className="font-semibold text-gray-800 text-lg mb-4">
                                {meeting.title}
                            </h3>

                            <div className="space-y-3 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-blue-500" />
                                    <span>{new Date(meeting.date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-blue-500" />
                                    <span>{meeting.time} • {meeting.duration} minutes</span>
                                </div>
                                <div className="text-left">
                                    <span className="font-medium text-gray-700">Location: </span>
                                    <span>{meeting.location}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Go to Dashboard
                        </button>

                        <button
                            onClick={() => window.close()}
                            className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            Close Window
                        </button>
                    </div>

                    <p className="text-xs text-gray-500 mt-6">
                        A confirmation email has been sent to your registered email address.
                    </p>
                </div>
            </div>
        </div>
    );
}