import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    Users,
    Mail,
    Phone,
    CheckCircle,
    XCircle,
    Clock as ClockIcon,
    Download,
    Printer,
    Edit,
    Trash2
} from 'lucide-react';
import { meetingAPI } from '../../utils/api';
import { format } from 'date-fns';

export default function AdminMeetingDetail() {
    const { meetingId } = useParams();
    const navigate = useNavigate();
    const [meeting, setMeeting] = useState(null);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        fetchMeetingDetails();
    }, [meetingId]);

    const fetchMeetingDetails = async () => {
        try {
            setLoading(true);
            const response = await meetingAPI.getAdminMeetings();
            const foundMeeting = response.data.meetings.find(m => m._id === meetingId);
            setMeeting(foundMeeting);
        } catch (error) {
            console.error('Error fetching meeting:', error);
            alert('Failed to load meeting details');
        } finally {
            setLoading(false);
        }
    };

    const exportAttendeesList = async () => {
        if (!meeting) return;

        setExporting(true);
        try {
            const attendees = meeting.invitedUsers.map(user => ({
                Name: user.name,
                Email: user.email,
                Status: user.status,
                'Response Time': user.respondedAt ? format(new Date(user.respondedAt), 'yyyy-MM-dd HH:mm') : 'Not responded'
            }));

            const csvHeaders = Object.keys(attendees[0]).join(',');
            const csvRows = attendees.map(row => Object.values(row).map(value =>
                `"${value}"`).join(',')).join('\n');

            const csvContent = `${csvHeaders}\n${csvRows}`;
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `attendees_${meeting.title.replace(/[^a-z0-9]/gi, '_')}.csv`;
            a.click();
        } catch (error) {
            console.error('Error exporting:', error);
            alert('Failed to export list');
        } finally {
            setExporting(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this meeting?')) {
            return;
        }

        try {
            await meetingAPI.deleteMeeting(meetingId);
            alert('Meeting deleted successfully');
            navigate('/admin/meetings');
        } catch (error) {
            console.error('Error deleting meeting:', error);
            alert('Failed to delete meeting');
        }
    };

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'EEEE, MMMM dd, yyyy');
        } catch {
            return dateString;
        }
    };

    const formatTime = (timeString) => {
        try {
            const [hours, minutes] = timeString.split(':');
            const hour = parseInt(hours);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const formattedHour = hour % 12 || 12;
            return `${formattedHour}:${minutes} ${ampm}`;
        } catch {
            return timeString;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading meeting details...</p>
                </div>
            </div>
        );
    }

    if (!meeting) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-800">Meeting not found</h2>
                    <button
                        onClick={() => navigate('/admin/meetings')}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Meetings
                    </button>
                </div>
            </div>
        );
    }

    const statusCounts = {
        accepted: meeting.invitedUsers.filter(u => u.status === 'accepted').length,
        declined: meeting.invitedUsers.filter(u => u.status === 'declined').length,
        pending: meeting.invitedUsers.filter(u => !u.status || u.status === 'pending').length
    };

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/admin/meetings')}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">{meeting.title}</h1>
                                <p className="text-gray-600 mt-1">Meeting ID: {meeting._id}</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={exportAttendeesList}
                                disabled={exporting}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                            >
                                <Download size={18} />
                                {exporting ? 'Exporting...' : 'Export List'}
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                            >
                                <Printer size={18} />
                                Print
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                                <Trash2 size={18} />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Meeting Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Meeting Info Card */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Meeting Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Calendar className="text-blue-600" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Date</p>
                                        <p className="font-medium text-gray-800">{formatDate(meeting.date)}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Clock className="text-blue-600" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Time</p>
                                        <p className="font-medium text-gray-800">{formatTime(meeting.time)} ({meeting.duration} mins)</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <MapPin className="text-blue-600" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Location</p>
                                        <p className="font-medium text-gray-800">{meeting.location}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Users className="text-blue-600" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Total Invited</p>
                                        <p className="font-medium text-gray-800">{meeting.invitedUsers.length} people</p>
                                    </div>
                                </div>
                            </div>

                            {/* Agenda and Description */}
                            <div className="mt-6 space-y-4">
                                <div>
                                    <h3 className="font-medium text-gray-700 mb-2">Agenda</h3>
                                    <p className="text-gray-600 whitespace-pre-line">{meeting.agenda}</p>
                                </div>

                                {meeting.description && (
                                    <div>
                                        <h3 className="font-medium text-gray-700 mb-2">Description</h3>
                                        <p className="text-gray-600 whitespace-pre-line">{meeting.description}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Attendees List */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-800">Attendees</h2>
                                <span className="text-sm text-gray-500">{meeting.invitedUsers.length} people</span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Name</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Contact</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Response Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {meeting.invitedUsers.map((user, index) => (
                                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 px-4">
                                                    <div className="font-medium text-gray-800">{user.name}</div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Mail size={14} />
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                        user.status === 'declined' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {user.status || 'pending'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-600">
                                                    {user.respondedAt ? format(new Date(user.respondedAt), 'MMM dd, hh:mm a') : 'Not responded'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Stats & Actions */}
                    <div className="space-y-6">
                        {/* Response Stats */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Response Statistics</h2>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm text-gray-600 flex items-center gap-2">
                                            <CheckCircle className="text-green-500" size={16} />
                                            Accepted
                                        </span>
                                        <span className="font-medium">{statusCounts.accepted}</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-green-500"
                                            style={{ width: `${(statusCounts.accepted / meeting.invitedUsers.length) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm text-gray-600 flex items-center gap-2">
                                            <XCircle className="text-red-500" size={16} />
                                            Declined
                                        </span>
                                        <span className="font-medium">{statusCounts.declined}</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-red-500"
                                            style={{ width: `${(statusCounts.declined / meeting.invitedUsers.length) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm text-gray-600 flex items-center gap-2">
                                            <ClockIcon className="text-yellow-500" size={16} />
                                            Pending
                                        </span>
                                        <span className="font-medium">{statusCounts.pending}</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-yellow-500"
                                            style={{ width: `${(statusCounts.pending / meeting.invitedUsers.length) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-gray-800">
                                        {meeting.invitedUsers.length > 0
                                            ? `${Math.round(((statusCounts.accepted + statusCounts.declined) / meeting.invitedUsers.length) * 100)}%`
                                            : '0%'}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">Overall Response Rate</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
                            <div className="space-y-3">
                                <button
                                    onClick={() => window.location.href = `/admin/create-meeting?copy=${meeting._id}`}
                                    className="w-full py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Edit size={18} />
                                    Duplicate Meeting
                                </button>
                                <button
                                    onClick={() => navigator.clipboard.writeText(`${window.location.origin}/meeting-response?meetingId=${meeting._id}`)}
                                    className="w-full py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Mail size={18} />
                                    Copy Invite Link
                                </button>
                                <button
                                    onClick={() => window.location.href = 'mailto:' + meeting.invitedUsers.map(u => u.email).join(',')}
                                    className="w-full py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Mail size={18} />
                                    Email All Attendees
                                </button>
                            </div>
                        </div>

                        {/* Meeting Status */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Meeting Status</h2>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Created On</span>
                                    <span className="font-medium">
                                        {format(new Date(meeting.createdAt), 'MMM dd, yyyy')}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Status</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${new Date(meeting.date) >= new Date()
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {new Date(meeting.date) >= new Date() ? 'Active' : 'Completed'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Days Remaining</span>
                                    <span className="font-medium">
                                        {Math.max(0, Math.ceil((new Date(meeting.date) - new Date()) / (1000 * 60 * 60 * 24)))}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}