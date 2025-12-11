import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Users,
    CheckCircle,
    XCircle,
    Clock,
    Trash2,
    Eye,
    Search,
    Filter,
    Download,
    Mail,
    BarChart3,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { meetingAPI } from '../../utils/api';
import { format } from 'date-fns';

export default function AdminMeetingsList() {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [expandedMeeting, setExpandedMeeting] = useState(null);
    const [selectedMeetings, setSelectedMeetings] = useState([]);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        fetchMeetings();
        fetchStats();
    }, []);

    const fetchMeetings = async () => {
        try {
            setLoading(true);
            const response = await meetingAPI.getAdminMeetings();
            setMeetings(response.data.meetings || []);
        } catch (error) {
            console.error('Error fetching meetings:', error);
            alert('Failed to load meetings');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await meetingAPI.getMeetingStats();
            setStats(response.data.stats);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleDeleteMeeting = async (meetingId) => {
        if (!window.confirm('Are you sure you want to delete this meeting? This action cannot be undone.')) {
            return;
        }

        try {
            await meetingAPI.deleteMeeting(meetingId);
            alert('Meeting deleted successfully');
            fetchMeetings();
            fetchStats();
        } catch (error) {
            console.error('Error deleting meeting:', error);
            alert('Failed to delete meeting');
        }
    };

    const handleSelectMeeting = (meetingId) => {
        if (selectedMeetings.includes(meetingId)) {
            setSelectedMeetings(selectedMeetings.filter(id => id !== meetingId));
        } else {
            setSelectedMeetings([...selectedMeetings, meetingId]);
        }
    };

    const handleSelectAll = () => {
        if (selectedMeetings.length === filteredMeetings.length) {
            setSelectedMeetings([]);
        } else {
            setSelectedMeetings(filteredMeetings.map(m => m._id));
        }
    };

    const handleBulkDelete = async () => {
        if (selectedMeetings.length === 0) {
            alert('Please select meetings to delete');
            return;
        }

        if (!window.confirm(`Are you sure you want to delete ${selectedMeetings.length} meeting(s)?`)) {
            return;
        }

        try {
            const deletePromises = selectedMeetings.map(id => meetingAPI.deleteMeeting(id));
            await Promise.all(deletePromises);
            alert(`${selectedMeetings.length} meeting(s) deleted successfully`);
            setSelectedMeetings([]);
            fetchMeetings();
            fetchStats();
        } catch (error) {
            console.error('Error bulk deleting:', error);
            alert('Failed to delete some meetings');
        }
    };

    const exportToCSV = () => {
        const csvData = filteredMeetings.map(meeting => ({
            Title: meeting.title,
            Date: format(new Date(meeting.date), 'yyyy-MM-dd'),
            Time: meeting.time,
            Location: meeting.location,
            'Total Invited': meeting.stats?.invited || 0,
            'Accepted': meeting.stats?.accepted || 0,
            'Declined': meeting.stats?.declined || 0,
            'Pending': meeting.stats?.pending || 0,
            'Response Rate': meeting.stats?.invited ?
                `${Math.round(((meeting.stats.accepted + meeting.stats.declined) / meeting.stats.invited) * 100)}%` : '0%'
        }));

        const csvHeaders = Object.keys(csvData[0] || {}).join(',');
        const csvRows = csvData.map(row => Object.values(row).map(value =>
            `"${value}"`).join(',')).join('\n');

        const csvContent = `${csvHeaders}\n${csvRows}`;
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `meetings_export_${format(new Date(), 'yyyy-MM-dd')}.csv`;
        a.click();
    };

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
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

    const filteredMeetings = meetings.filter(meeting => {
        const matchesSearch = searchTerm === '' ||
            meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            meeting.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            meeting.agenda.toLowerCase().includes(searchTerm.toLowerCase());

        if (filterStatus === 'all') return matchesSearch;
        if (filterStatus === 'upcoming') {
            const meetingDate = new Date(meeting.date);
            const now = new Date();
            return matchesSearch && meetingDate >= now;
        }
        if (filterStatus === 'past') {
            const meetingDate = new Date(meeting.date);
            const now = new Date();
            return matchesSearch && meetingDate < now;
        }

        return matchesSearch;
    });

    const getResponseRate = (meeting) => {
        const total = meeting.stats?.invited || 0;
        const responded = (meeting.stats?.accepted || 0) + (meeting.stats?.declined || 0);
        return total > 0 ? Math.round((responded / total) * 100) : 0;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading meetings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Meeting Management</h1>
                            <p className="text-gray-600 mt-1">View and manage all scheduled meetings</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={exportToCSV}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                            >
                                <Download size={18} />
                                Export CSV
                            </button>
                            <button
                                onClick={() => window.location.href = '/admin/create-meeting'}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <Calendar size={18} />
                                Schedule New Meeting
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-xl shadow-sm p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Total Meetings</p>
                                    <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalMeetings}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Calendar className="text-blue-600" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Upcoming Meetings</p>
                                    <p className="text-2xl font-bold text-gray-800 mt-1">{stats.upcomingMeetings}</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <Clock className="text-green-600" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Total Invites Sent</p>
                                    <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalInvites}</p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <Mail className="text-purple-600" size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Response Rate</p>
                                    <p className="text-2xl font-bold text-gray-800 mt-1">
                                        {stats.totalInvites > 0
                                            ? `${Math.round(((stats.acceptedInvites + stats.declinedInvites) / stats.totalInvites) * 100)}%`
                                            : '0%'}
                                    </p>
                                </div>
                                <div className="p-3 bg-orange-100 rounded-lg">
                                    <BarChart3 className="text-orange-600" size={24} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters and Bulk Actions */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1">
                            {/* Search */}
                            <div className="relative flex-1 md:max-w-xs">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search meetings..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Filter */}
                            <div className="flex items-center gap-2">
                                <Filter size={18} className="text-gray-500" />
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Meetings</option>
                                    <option value="upcoming">Upcoming</option>
                                    <option value="past">Past</option>
                                </select>
                            </div>
                        </div>

                        {/* Bulk Actions */}
                        {selectedMeetings.length > 0 && (
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600">
                                    {selectedMeetings.length} selected
                                </span>
                                <button
                                    onClick={handleBulkDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                                >
                                    <Trash2 size={18} />
                                    Delete Selected
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Meetings List */}
                {filteredMeetings.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <Calendar className="mx-auto text-gray-400" size={64} />
                        <h3 className="mt-4 text-xl font-medium text-gray-600">No meetings found</h3>
                        <p className="text-gray-500 mt-2">
                            {searchTerm || filterStatus !== 'all'
                                ? 'Try adjusting your search or filter'
                                : 'Schedule your first meeting to get started'}
                        </p>
                        <button
                            onClick={() => window.location.href = '/admin/create-meeting'}
                            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                        >
                            <Calendar size={18} />
                            Schedule Meeting
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Select All */}
                        <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                            <input
                                type="checkbox"
                                checked={selectedMeetings.length === filteredMeetings.length && filteredMeetings.length > 0}
                                onChange={handleSelectAll}
                                className="rounded text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-600">
                                Select all {filteredMeetings.length} meetings
                            </span>
                        </div>

                        {/* Meetings Table */}
                        {filteredMeetings.map((meeting) => (
                            <div key={meeting._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-5">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-start gap-3 flex-1">
                                            <input
                                                type="checkbox"
                                                checked={selectedMeetings.includes(meeting._id)}
                                                onChange={() => handleSelectMeeting(meeting._id)}
                                                className="mt-1 rounded text-blue-600 focus:ring-blue-500"
                                            />

                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-lg font-semibold text-gray-800">{meeting.title}</h3>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${new Date(meeting.date) >= new Date()
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {new Date(meeting.date) >= new Date() ? 'Upcoming' : 'Past'}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={14} />
                                                        <span>{formatDate(meeting.date)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock size={14} />
                                                        <span>{formatTime(meeting.time)} • {meeting.duration} mins</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Users size={14} />
                                                        <span>{meeting.stats?.invited || 0} invited</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setExpandedMeeting(expandedMeeting === meeting._id ? null : meeting._id)}
                                                className="p-2 text-gray-500 hover:text-gray-700"
                                            >
                                                {expandedMeeting === meeting._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteMeeting(meeting._id)}
                                                className="p-2 text-red-500 hover:text-red-700"
                                                title="Delete meeting"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Response Stats */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        <div className="bg-green-50 p-3 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="text-green-600" size={16} />
                                                <span className="text-sm text-gray-600">Accepted</span>
                                            </div>
                                            <p className="text-xl font-bold text-gray-800 mt-1">
                                                {meeting.stats?.accepted || 0}
                                            </p>
                                        </div>

                                        <div className="bg-red-50 p-3 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <XCircle className="text-red-600" size={16} />
                                                <span className="text-sm text-gray-600">Declined</span>
                                            </div>
                                            <p className="text-xl font-bold text-gray-800 mt-1">
                                                {meeting.stats?.declined || 0}
                                            </p>
                                        </div>

                                        <div className="bg-yellow-50 p-3 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <Clock className="text-yellow-600" size={16} />
                                                <span className="text-sm text-gray-600">Pending</span>
                                            </div>
                                            <p className="text-xl font-bold text-gray-800 mt-1">
                                                {meeting.stats?.pending || 0}
                                            </p>
                                        </div>

                                        <div className="bg-blue-50 p-3 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <BarChart3 className="text-blue-600" size={16} />
                                                <span className="text-sm text-gray-600">Response Rate</span>
                                            </div>
                                            <p className="text-xl font-bold text-gray-800 mt-1">
                                                {getResponseRate(meeting)}%
                                            </p>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {expandedMeeting === meeting._id && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <h4 className="font-medium text-gray-700 mb-2">Meeting Details</h4>
                                                    <div className="space-y-2 text-sm text-gray-600">
                                                        <p><span className="font-medium">Location:</span> {meeting.location}</p>
                                                        <p><span className="font-medium">Agenda:</span> {meeting.agenda}</p>
                                                        {meeting.description && (
                                                            <p><span className="font-medium">Description:</span> {meeting.description}</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="font-medium text-gray-700 mb-2">Invited Users</h4>
                                                    <div className="max-h-40 overflow-y-auto space-y-2">
                                                        {meeting.invitedUsers?.map((user, index) => (
                                                            <div key={index} className="flex items-center justify-between text-sm">
                                                                <span className="text-gray-700">{user.name}</span>
                                                                <span className={`px-2 py-1 rounded text-xs ${user.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                                    user.status === 'declined' ? 'bg-red-100 text-red-800' :
                                                                        'bg-yellow-100 text-yellow-800'
                                                                    }`}>
                                                                    {user.status || 'pending'}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer Stats */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    Showing {filteredMeetings.length} of {meetings.length} meetings
                    {searchTerm && ` • Filtered by: "${searchTerm}"`}
                </div>
            </div>
        </div>
    );
}