import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import { notificationAPI } from '../utils/api';

export default function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const [notifRes, countRes] = await Promise.all([
                notificationAPI.getAll(),
                notificationAPI.getUnreadCount()
            ]);
            setNotifications(notifRes.data.notifications || []);
            setUnreadCount(countRes.data.count || 0);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await notificationAPI.markAsRead(id);
            fetchNotifications();
        } catch (err) {
            console.error('Error marking as read:', err);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationAPI.markAllRead();
            fetchNotifications();
        } catch (err) {
            console.error('Error marking all as read:', err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await notificationAPI.deleteNotification(id);
            fetchNotifications();
        } catch (err) {
            console.error('Error deleting notification:', err);
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'payment': return 'text-green-600 bg-green-50 border-green-200';
            case 'client': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'reimbursement': return 'text-purple-600 bg-purple-50 border-purple-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    return (
        <div className="relative">
            {/* Bell Icon */}
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 rounded-full hover:bg-gray-100"
            >
                <Bell size={24} className="text-gray-700" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {showDropdown && (
                <div className="absolute right-0 mt-2 w-96 bg-white shadow-2xl rounded-lg border z-50">
                    {/* Header */}
                    <div className="p-4 border-b flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                        <div className="flex gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                >
                                    <Check size={14} />
                                    Mark all read
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                No notifications
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif._id}
                                    className={`p-4 border-b hover:bg-gray-50 ${!notif.isRead ? 'bg-blue-50' : ''
                                        }`}
                                >
                                    <div className="flex justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-xs px-2 py-1 rounded-full ${getNotificationColor(notif.type)}`}>
                                                    {notif.type}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <h4 className="font-medium text-gray-900">{notif.title}</h4>
                                            <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                                        </div>
                                        <div className="flex flex-col gap-1 ml-2">
                                            {!notif.isRead && (
                                                <button
                                                    onClick={() => handleMarkAsRead(notif._id)}
                                                    className="p-1 text-green-600 hover:text-green-800"
                                                    title="Mark as read"
                                                >
                                                    <Check size={16} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(notif._id)}
                                                className="p-1 text-red-500 hover:text-red-700"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 border-t text-center">
                        <button
                            onClick={() => {
                                // You can create a full notifications page later
                                setShowDropdown(false);
                            }}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            View all notifications
                        </button>
                    </div>
                </div>
            )}

            {/* Click outside to close */}
            {showDropdown && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDropdown(false)}
                />
            )}
        </div>
    );
}