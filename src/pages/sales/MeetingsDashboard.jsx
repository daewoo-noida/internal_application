import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, CheckCircle, XCircle, Clock as ClockIcon } from 'lucide-react';
import { meetingAPI } from '../../utils/api';

export default function MeetingsDashboard() {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, upcoming, past

    useEffect(() => {
        fetchMeetings();
    }, []);

    const fetchMeetings = async () => {
        try {
            const response = await meetingAPI.getUserMeetings();
            setMeetings(response.data.meetings);
        } catch (error) {
            console.error('Error fetching meetings:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateResponse = async (meetingId, status) => {
        try {
            await meetingAPI.updateResponse(meetingId, { status });
            fetchMeetings(); // Refresh list
            alert(`Meeting ${status} successfully`);
        } catch (error) {
            console.error('Error updating response:', error);
            alert('Failed to update response');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'accepted': return 'bg-green-100 text-green-800';
            case 'declined': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'accepted': return <CheckCircle size={16} />;
            case 'declined': return <XCircle size={16} />;
            default: return <ClockIcon size={16} />;
        }
    };

    const filteredMeetings = meetings.filter(meeting => {
        const now = new Date();
        const meetingDate = new Date(meeting.date);

        if (filter === 'upcoming') return meetingDate >= now;
        if (filter === 'past') return meetingDate < now;
        return true;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">My Meetings</h1>
                            <p className="text-gray-600 mt-1">View and manage your meeting invitations</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                            >
                                All Meetings
                            </button>
                            <button
                                onClick={() => setFilter('upcoming')}
                                className={`px-4 py-2 rounded-lg ${filter === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                            >
                                Upcoming
                            </button>
                            <button
                                onClick={() => setFilter('past')}
                                className={`px-4 py-2 rounded-lg ${filter === 'past' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                            >
                                Past
                            </button>
                        </div>
                    </div>
                </div>

                {filteredMeetings.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                        <Calendar className="mx-auto text-gray-400" size={64} />
                        <h3 className="mt-4 text-xl font-medium text-gray-600">No meetings found</h3>
                        <p className="text-gray-500 mt-2">You don't have any meetings in this category</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredMeetings.map((meeting) => {
                            const userResponse = meeting.invitedUsers.find(
                                user => user.userId === localStorage.getItem('userId')
                            );

                            return (
                                <div key={meeting._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                                                {meeting.title}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(userResponse?.status || 'pending')}`}>
                                                {getStatusIcon(userResponse?.status || 'pending')}
                                                {userResponse?.status || 'Pending'}
                                            </span>
                                        </div>

                                        <div className="space-y-3 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} className="text-blue-500" />
                                                <span>{formatDate(meeting.date)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-blue-500" />
                                                <span>{meeting.time} • {meeting.duration} mins</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin size={16} className="text-blue-500" />
                                                <span className="line-clamp-1">{meeting.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Users size={16} className="text-blue-500" />
                                                <span>By: {meeting.createdBy?.name}</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t">
                                            <p className="text-sm text-gray-700 font-medium mb-2">Agenda:</p>
                                            <p className="text-sm text-gray-600 line-clamp-2">{meeting.agenda}</p>
                                        </div>

                                        {userResponse?.status === 'pending' && new Date(meeting.date) >= new Date() && (
                                            <div className="mt-6 flex gap-3">
                                                <button
                                                    onClick={() => updateResponse(meeting._id, 'accepted')}
                                                    className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => updateResponse(meeting._id, 'declined')}
                                                    className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                                                >
                                                    Decline
                                                </button>
                                            </div>
                                        )}

                                        <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                                            Invited: {meeting.invitedUsers.length} person{meeting.invitedUsers.length !== 1 ? 's' : ''}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}