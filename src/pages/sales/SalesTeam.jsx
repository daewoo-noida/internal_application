import React, { useEffect, useState } from "react";
import { adminAPI } from "../../utils/api";
import { Link } from "react-router-dom";
import * as ExcelJS from 'exceljs';

import {
    FiMoreVertical,
    FiCheck,
    FiX,
    FiEye,
    FiTrash2,
    FiMail,
    FiUser,
    FiShield,
    FiCheckCircle,
    FiXCircle,
    FiSearch,
    FiFilter,
    FiDownload
} from "react-icons/fi";

import { FaFileCsv, FaFileExcel } from "react-icons/fa";


export default function SalesTeam() {
    const [salesmen, setSalesmen] = useState([]);
    const [filteredSalesmen, setFilteredSalesmen] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [openMenu, setOpenMenu] = useState(null);
    const [statusFilter, setStatusFilter] = useState("all");
    const [exporting, setExporting] = useState(false);

    const [showExportDropdown, setShowExportDropdown] = useState(false);

    useEffect(() => {
        loadTeam();
    }, []);

    useEffect(() => {
        let results = salesmen;

        if (searchTerm) {
            results = results.filter(s =>
                s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter === "verified") {
            results = results.filter(s => s.isVerified);
        } else if (statusFilter === "pending") {
            results = results.filter(s => !s.isVerified);
        }

        setFilteredSalesmen(results);
    }, [searchTerm, statusFilter, salesmen]);

    const loadTeam = async () => {
        try {
            setLoading(true);
            const res = await adminAPI.salesmen();
            setSalesmen(res.data.salesmen || []);
            setFilteredSalesmen(res.data.salesmen || []);
        } catch (err) {
            console.error("Sales Team Load Error", err);
        } finally {
            setLoading(false);
        }
    };

    const toggleVerify = async (id) => {
        try {
            const res = await adminAPI.verify(id);
            alert(res.data.message);
            loadTeam();
            setOpenMenu(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        await adminAPI.deleteSalesman(id);
        loadTeam();
        setOpenMenu(null);
    };

    const getInitials = (name) => {
        if (!name) return "U";
        const parts = name.split(" ");
        return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
    };

    const getRandomColor = (name) => {
        const colors = [
            'bg-blue-500', 'bg-purple-500', 'bg-pink-500',
            'bg-green-500', 'bg-yellow-500', 'bg-indigo-500',
            'bg-red-500', 'bg-teal-500'
        ];
        const index = name?.length % colors.length || 0;
        return colors[index];
    };

    // Export to Excel
    const handleExportExcel = async () => {
        if (!filteredSalesmen.length) {
            alert('No users to export');
            return;
        }

        setExporting(true);
        try {
            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'User Management System';
            workbook.created = new Date();

            const worksheet = workbook.addWorksheet('Users');

            // Define all columns
            const columns = [
                { header: 'Name', key: 'name', width: 25 },
                { header: 'Email', key: 'email', width: 30 },
                { header: 'Phone', key: 'phone', width: 15 },
                { header: 'Designation', key: 'designation', width: 20 },
                { header: 'Status', key: 'status', width: 15 },
                { header: 'Verified', key: 'isVerified', width: 12 },
                { header: 'Created At', key: 'createdAt', width: 20 },
                { header: 'Last Login', key: 'lastLogin', width: 20 },
                { header: 'User ID', key: '_id', width: 25 }
            ];

            worksheet.columns = columns;

            // Style header row
            const headerRow = worksheet.getRow(1);
            headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            headerRow.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF4F81BD' }
            };
            headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

            // Add data rows
            filteredSalesmen.forEach((user, index) => {
                const rowData = {
                    name: user.name || 'N/A',
                    email: user.email || 'N/A',
                    phone: user.phone || 'N/A',
                    designation: user.designation || 'N/A',
                    status: user.isVerified ? 'Verified' : 'Pending',
                    isVerified: user.isVerified ? 'Yes' : 'No',
                    createdAt: user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A',
                    lastLogin: user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A',
                    _id: user._id || 'N/A'
                };

                const row = worksheet.addRow(rowData);

                // Alternate row colors
                if (index % 2 === 0) {
                    row.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFF2F2F2' }
                    };
                }

                // Style status cells
                const statusCell = row.getCell('status');
                statusCell.font = {
                    color: { argb: user.isVerified ? 'FF28A745' : 'FFDC3545' },
                    bold: true
                };
            });

            // Auto-fit columns
            worksheet.columns.forEach(column => {
                let maxLength = 0;
                column.eachCell({ includeEmpty: true }, cell => {
                    const cellLength = cell.value ? cell.value.toString().length : 10;
                    if (cellLength > maxLength) {
                        maxLength = cellLength;
                    }
                });
                column.width = Math.min(Math.max(maxLength + 2, 10), 50);
            });

            // Generate and download
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });

            const date = new Date().toISOString().split('T')[0];
            const fileName = `users_export_${date}.xlsx`;

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Error exporting to Excel:', error);
            alert('Error exporting to Excel. Please try again.');
        } finally {
            setExporting(false);
        }
    };

    // Export to CSV
    const handleExportCSV = () => {
        if (!filteredSalesmen.length) {
            alert('No users to export');
            return;
        }

        setExporting(true);
        try {
            // Define columns
            const columns = [
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'phone', label: 'Phone' },
                { key: 'designation', label: 'Designation' },
                { key: 'status', label: 'Status' },
                { key: 'isVerified', label: 'Verified' },
                { key: 'createdAt', label: 'Created At' },
                { key: 'lastLogin', label: 'Last Login' },
                { key: '_id', label: 'User ID' }
            ];

            // Create CSV content
            const headers = columns.map(col => col.label);

            const rows = filteredSalesmen.map(user => {
                return columns.map(col => {
                    let value;
                    switch (col.key) {
                        case 'status':
                            value = user.isVerified ? 'Verified' : 'Pending';
                            break;
                        case 'isVerified':
                            value = user.isVerified ? 'Yes' : 'No';
                            break;
                        case 'createdAt':
                            value = user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A';
                            break;
                        case 'lastLogin':
                            value = user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A';
                            break;
                        default:
                            value = user[col.key] || 'N/A';
                    }

                    // Escape CSV special characters
                    if (typeof value === 'string' &&
                        (value.includes(',') || value.includes('"') || value.includes('\n'))) {
                        return `"${value.replace(/"/g, '""')}"`;
                    }
                    return value;
                }).join(',');
            });

            const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');

            // Download CSV
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const date = new Date().toISOString().split('T')[0];
            a.download = `users_export_${date}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Error exporting to CSV:', error);
            alert('Error exporting to CSV. Please try again.');
        } finally {
            setExporting(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showExportDropdown && !event.target.closest('.relative')) {
                setShowExportDropdown(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showExportDropdown]);

    // Simple icon components
    const MoreVertical = () => <FiMoreVertical className="text-gray-500" />;
    const UserCheck = () => <FiCheck className="text-gray-500" />;
    const UserX = () => <FiX className="text-gray-500" />;

    const EyeIcon = () => <FiEye className="text-gray-500" />;
    const TrashIcon = () => <FiTrash2 className="text-red-500" />;

    const MailIcon = () => <FiMail className="text-gray-500" />;
    const UserIcon = () => <FiUser className="text-gray-500" />;
    const ShieldIcon = () => <FiShield className="text-gray-500" />;

    const CheckCircleIcon = () => <FiCheckCircle className="text-green-600" />;
    const XCircleIcon = () => <FiXCircle className="text-yellow-600" />;

    const SearchIcon = () => <FiSearch className="text-gray-400" />;
    const FilterIcon = () => <FiFilter className="text-gray-400" />;

    const DownloadIcon = () => <FiDownload className="text-white" />;

    const ExcelIcon = () => <FaFileExcel className="text-white" />;
    const CSVIcon = () => <FaFileCsv className="text-white" />;


    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Users</h1>
                        <p className="text-gray-600 mt-1">Manage your team members</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search Bar */}
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                <SearchIcon />
                            </div>
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                <FilterIcon />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none"
                            >
                                <option value="all">All Users</option>
                                <option value="verified">Verified Only</option>
                                <option value="pending">Pending Only</option>
                            </select>
                        </div>

                        {/* Export Dropdown */}
                        <div className="relative">
                            <button
                                disabled={exporting || filteredSalesmen.length === 0}
                                onClick={() => setShowExportDropdown(!showExportDropdown)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${exporting || filteredSalesmen.length === 0
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                                    } text-white`}
                            >
                                <DownloadIcon />
                                <span>{exporting ? 'Exporting...' : 'Export'}</span>
                            </button>

                            {showExportDropdown && !exporting && filteredSalesmen.length > 0 && (
                                <div
                                    className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-lg border py-2 z-50"
                                    style={{ animation: 'fadeIn 0.2s ease-out' }}
                                >
                                    <button
                                        onClick={() => {
                                            handleExportCSV();
                                            setShowExportDropdown(false);
                                        }}
                                        className="w-full flex items-center px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                                    >
                                        <CSVIcon />
                                        <span className="ml-3">Export CSV</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            handleExportExcel();
                                            setShowExportDropdown(false);
                                        }}
                                        className="w-full flex items-center px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                                    >
                                        <ExcelIcon />
                                        <span className="ml-3">Export Excel</span>
                                    </button>

                                    <div className="px-4 py-2 text-xs text-gray-500 border-t mt-2 pt-2">
                                        {filteredSalesmen.length} users
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-white p-4 rounded-xl shadow-sm border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Users</p>
                                <p className="text-2xl font-bold text-gray-800">{salesmen.length}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <UserIcon />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Verified</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {salesmen.filter(s => s.isVerified).length}
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <ShieldIcon />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {salesmen.filter(s => !s.isVerified).length}
                                </p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <UserX />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Showing</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {filteredSalesmen.length}
                                </p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <span className="text-purple-600">👥</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : filteredSalesmen.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
                    <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Users Found</h3>
                    <p className="text-gray-500">
                        {searchTerm || statusFilter !== "all"
                            ? "Try adjusting your search or filters"
                            : "No users have been added yet"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredSalesmen.map((s) => (
                        <div
                            key={s._id}
                            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border hover:border-blue-200 overflow-hidden group"
                        >
                            {/* Card Header */}
                            <div className="p-3 pb-3">
                                <div className="flex items-start justify-between">
                                    {/* Avatar */}
                                    <div className={`${getRandomColor(s.name)} w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg`}>
                                        {getInitials(s.name)}
                                    </div>

                                    {/* Dropdown Menu */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setOpenMenu(openMenu === s._id ? null : s._id)}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            <MoreVertical />
                                        </button>

                                        {openMenu === s._id && (
                                            <div
                                                className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border py-2 z-50"
                                                style={{ animation: 'fadeIn 0.2s ease-out' }}
                                            >
                                                <button
                                                    onClick={() => toggleVerify(s._id)}
                                                    className="w-full flex items-center px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                                                >
                                                    {s.isVerified ? (
                                                        <>
                                                            <UserX />
                                                            <span className="ml-3">Unverify User</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <UserCheck />
                                                            <span className="ml-3">Verify User</span>
                                                        </>
                                                    )}
                                                </button>

                                                <Link
                                                    to={`/admin/salesman/${s._id}`}
                                                    className="flex items-center px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                                                >
                                                    <EyeIcon />
                                                    <span className="ml-3">View Details</span>
                                                </Link>

                                                <button
                                                    onClick={() => handleDelete(s._id)}
                                                    className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <TrashIcon />
                                                    <span className="ml-3">Delete User</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="px-3 py-3">
                                <h3 className="text-lg font-semibold text-gray-800 truncate text-capitalize">
                                    {s.name || "No Name"}
                                </h3>

                                <div className="flex items-center mt-2 text-gray-600">
                                    {/* <MailIcon /> */}
                                    <span className="text-sm truncate">{s.email || "No Email"}</span>
                                </div>

                                {s.phone && (
                                    <div className="flex items-center mt-2 text-gray-600">
                                        {/* <span className="text-sm">📱</span> */}
                                        <span className="text-sm truncate">{s.phone}</span>
                                    </div>
                                )}

                                {s.designation && (
                                    <div className="mt-3">
                                        <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                            {s.designation}
                                        </span>
                                    </div>
                                )}

                                <div className="mt-4">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${s.isVerified
                                        ? "bg-green-50 text-green-700 border border-green-200"
                                        : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                                        }`}>
                                        {s.isVerified ? (
                                            <>
                                                <CheckCircleIcon />
                                                <span className="ml-1.5">Verified</span>
                                            </>
                                        ) : (
                                            <>
                                                <XCircleIcon />
                                                <span className="ml-1.5">Pending</span>
                                            </>
                                        )}
                                    </span>
                                </div>
                            </div>

                            {/* Card Footer */}
                            <div className="px-3 py-3 border-t border-gray-100 bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs text-gray-500">
                                        {s.createdAt && (
                                            <div>Joined: {new Date(s.createdAt).toLocaleDateString()}</div>
                                        )}
                                    </div>

                                    <Link
                                        to={`/admin/salesman/${s._id}`}
                                        className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center"
                                    >
                                        View
                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Export Success Toast */}
            {exporting && (
                <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Exporting users...
                </div>
            )}

            {/* Add CSS animation */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}