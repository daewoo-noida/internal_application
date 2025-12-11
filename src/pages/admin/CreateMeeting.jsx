import React, { useState, useEffect, useRef } from 'react';
import { X, Search, User, Mail, Calendar, Clock, MapPin, FileText, Send } from 'lucide-react';
import { meetingAPI } from '../../utils/api';

export default function CreateMeeting() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        duration: 60,
        location: '',
        agenda: ''
    });

    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([
        'Weekly Sales Review',
        'Monthly Planning Meeting',
        'Quarterly Performance Review',
        'Product Training Session',
        'Client Strategy Discussion'
    ]);

    const searchRef = useRef(null);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Search salespersons
    useEffect(() => {
        const searchSalesPersons = async () => {
            if (searchQuery.trim().length > 1) {
                try {
                    const response = await meetingAPI.getSalesPersons(searchQuery);
                    setSearchResults(response.data.users);
                    setShowDropdown(true);
                } catch (error) {
                    console.error('Error searching users:', error);
                }
            } else {
                setSearchResults([]);
                setShowDropdown(false);
            }
        };

        const delayDebounce = setTimeout(() => {
            searchSalesPersons();
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    const handleSelectUser = (user) => {
        if (!selectedUsers.some(u => u.userId === user._id)) {
            setSelectedUsers([
                ...selectedUsers,
                {
                    userId: user._id,
                    email: user.email,
                    name: user.name,
                    designation: user.designation,
                    profileImage: user.profileImage
                }
            ]);
        }
        setSearchQuery('');
        setShowDropdown(false);
    };

    const removeUser = (userId) => {
        setSelectedUsers(selectedUsers.filter(user => user.userId !== userId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const meetingData = {
                ...formData,
                invitedUsers: selectedUsers
            };

            await meetingAPI.createMeeting(meetingData);

            alert('Meeting created and invitations sent successfully!');

            // Reset form
            setFormData({
                title: '',
                description: '',
                date: '',
                time: '',
                duration: 60,
                location: '',
                agenda: ''
            });
            setSelectedUsers([]);
        } catch (error) {
            console.error('Error creating meeting:', error);
            alert('Failed to create meeting. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const insertSuggestion = (suggestion) => {
        setFormData({ ...formData, title: suggestion });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-[#0070b9] p-6 text-white">
                        <h1 className="text-2xl font-bold flex items-center gap-3">
                            <Calendar size={24} />
                            Schedule New Meeting
                        </h1>
                        <p className="text-blue-100 mt-1">
                            Invite salespersons to discuss important matters
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Meeting Title with Suggestions */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meeting Title *
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., Weekly Sales Review"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                {formData.title.length === 0 && (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500 mb-2">Quick suggestions:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {suggestions.map((suggestion, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => insertSuggestion(suggestion)}
                                                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-colors"
                                                >
                                                    {suggestion}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Date, Time, Duration, Location Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Calendar size={16} className="inline mr-2" />
                                    Date *
                                </label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Clock size={16} className="inline mr-2" />
                                    Time *
                                </label>
                                <input
                                    type="time"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Duration (minutes) *
                                </label>
                                <select
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="30">30 minutes</option>
                                    <option value="60">1 hour</option>
                                    <option value="90">1.5 hours</option>
                                    <option value="120">2 hours</option>
                                    <option value="180">3 hours</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <MapPin size={16} className="inline mr-2" />
                                    Location *
                                </label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="e.g., Conference Room A, Zoom Meeting"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        {/* Agenda */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <FileText size={16} className="inline mr-2" />
                                Agenda *
                            </label>
                            <textarea
                                value={formData.agenda}
                                onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
                                placeholder="List the main topics to be discussed..."
                                rows="3"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meeting Description *
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Provide detailed description of the meeting..."
                                rows="4"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Invite Salespersons - Google-like Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Invite Salespersons *
                            </label>

                            <div className="relative" ref={searchRef}>
                                <div className="flex items-center border border-gray-300 rounded-lg p-2">
                                    <Search className="text-gray-400 ml-2" size={20} />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => searchQuery.length > 1 && setShowDropdown(true)}
                                        placeholder="Search by name or email..."
                                        className="flex-1 px-3 py-2 outline-none"
                                    />
                                </div>

                                {/* Dropdown Results */}
                                {showDropdown && searchResults.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                                        {searchResults.map((user) => (
                                            <div
                                                key={user._id}
                                                onClick={() => handleSelectUser(user)}
                                                className="flex items-center p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                            >
                                                <div className="flex-shrink-0">
                                                    {user.profileImage ? (
                                                        <img
                                                            src={user.profileImage}
                                                            alt={user.name}
                                                            className="w-10 h-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-3 flex-1">
                                                    <div className="font-medium text-gray-900">{user.name}</div>
                                                    <div className="text-sm text-gray-500 flex items-center">
                                                        <Mail size={12} className="mr-1" />
                                                        {user.email}
                                                    </div>
                                                    <div className="text-xs text-gray-400">{user.designation} • {user.officeBranch}</div>
                                                </div>
                                                <User className="text-gray-400" size={16} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Selected Users */}
                            {selectedUsers.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-600 mb-2">
                                        Selected ({selectedUsers.length}):
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedUsers.map((user) => (
                                            <div
                                                key={user.userId}
                                                className="flex items-center bg-blue-50 border border-blue-200 rounded-full pl-3 pr-2 py-1"
                                            >
                                                <div className="flex items-center">
                                                    {user.profileImage ? (
                                                        <img
                                                            src={user.profileImage}
                                                            alt={user.name}
                                                            className="w-6 h-6 rounded-full mr-2"
                                                        />
                                                    ) : (
                                                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-semibold mr-2">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <span className="text-sm">{user.name}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeUser(user.userId)}
                                                    className="ml-2 text-gray-500 hover:text-red-500"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 border-t">
                            <button
                                type="submit"
                                disabled={loading || selectedUsers.length === 0}
                                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-[#0070b9] text-white font-medium rounded-lg hover:from-blue-700 hover:to-[#0060a0] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Send size={18} />
                                {loading ? 'Creating Meeting...' : 'Schedule Meeting & Send Invites'}
                            </button>

                            <p className="text-sm text-gray-500 mt-2">
                                {selectedUsers.length} salesperson{selectedUsers.length !== 1 ? 's' : ''} will receive email invitations
                            </p>
                        </div>
                    </form>
                </div>

                {/* Email Preview Section */}
                <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Email Preview
                    </h3>
                    <div className="border rounded-lg p-4 bg-gray-50">
                        <div className="border-l-4 border-blue-500 pl-4">
                            <h4 className="font-semibold text-gray-800">Subject: Meeting Invitation: {formData.title || '[Meeting Title]'}</h4>
                            <div className="mt-3 text-sm text-gray-600">
                                <p><strong>Date:</strong> {formData.date || '[Date]'} at {formData.time || '[Time]'}</p>
                                <p><strong>Duration:</strong> {formData.duration} minutes</p>
                                <p><strong>Location:</strong> {formData.location || '[Location]'}</p>
                                <p><strong>Agenda:</strong> {formData.agenda || '[Agenda]'}</p>
                                <p className="mt-2">{formData.description || '[Description]'}</p>
                            </div>
                            <div className="mt-4 flex gap-3">
                                <button className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                                    Accept
                                </button>
                                <button className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                                    Decline
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}