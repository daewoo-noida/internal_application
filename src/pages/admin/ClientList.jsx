import React, { useEffect, useState, useMemo } from "react";
import { clientAPI } from "../../utils/api";
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Delete, Eye, LucideDelete } from "lucide-react";

// Simple icon components (using text/emoji as fallback)
const SearchIcon = () => <span className="text-gray-400">🔍</span>;
const ChevronLeftIcon = () => <span className="text-gray-500">‹</span>;
const ChevronRightIcon = () => <span className="text-gray-500">›</span>;
const DownloadIcon = () => <span className="text-white">📥</span>;
const FilterIcon = () => <span className="text-gray-600">⚙️</span>;
const CloseIcon = () => <span className="text-gray-400">✕</span>;
const EyeIcon = () => <span className="text-green-600"><Eye /></span>;
const EyeOffIcon = () => <span className="text-gray-400">🚫</span>;
const ExcelIcon = () => <span className="text-white">📊</span>;
const CSVIcon = () => <span className="text-white">📄</span>;

const DeleteIcon = () => <span className="text-red-600"><LucideDelete /></span>;

export default function ClientsList() {
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [showColumnSelector, setShowColumnSelector] = useState(false);
    const [exporting, setExporting] = useState(false);

    // Define all columns from database
    const [tableColumns, setTableColumns] = useState([
        { key: 'clientId', label: 'Client ID', visible: true, category: 'basic' },
        { key: 'franchiseType', label: 'Franchise Type', visible: true, category: 'basic' },
        { key: 'name', label: 'Client Name', visible: true, category: 'basic' },
        { key: 'territory', label: 'Territory', visible: true, category: 'basic' },
        { key: 'officeBranch', label: 'Branch', visible: true, category: 'basic' },
        { key: 'createdBy.name', label: 'Created By', visible: true, category: 'basic' },
        { key: 'delete', label: 'Delete', visible: true, category: 'basic' },
        { key: 'dealAmount', label: 'Deal Amount', visible: false, category: 'financial' },
        { key: 'tokenReceivedAmount', label: 'Token Received', visible: false, category: 'financial' },
        { key: 'balanceAmount', label: 'Balance Amount', visible: false, category: 'financial' },
        { key: 'receivedPercent', label: 'Received %', visible: false, category: 'financial' },
        { key: 'remainPercent', label: 'Remaining %', visible: false, category: 'financial' },

        { key: 'email', label: 'Email', visible: false, category: 'contact' },
        { key: 'phone', label: 'Phone', visible: false, category: 'contact' },
        { key: 'altPhone', label: 'Alt Phone', visible: false, category: 'contact' },

        { key: 'personalStreetAddress', label: 'Personal Address', visible: false, category: 'address' },
        { key: 'personalCity', label: 'Personal City', visible: false, category: 'address' },
        { key: 'personalDistrict', label: 'Personal District', visible: false, category: 'address' },
        { key: 'personalState', label: 'Personal State', visible: false, category: 'address' },
        { key: 'personalPin', label: 'Personal PIN', visible: false, category: 'address' },

        { key: 'franchiseState', label: 'Franchise State', visible: false, category: 'address' },
        { key: 'franchiseCity', label: 'Franchise City', visible: false, category: 'address' },
        { key: 'franchiseDistrict', label: 'Franchise District', visible: false, category: 'address' },
        { key: 'franchisePin', label: 'Franchise PIN', visible: false, category: 'address' },

        { key: 'tokenDate', label: 'Token Date', visible: false, category: 'dates' },
        { key: 'createdAt', label: 'Created At', visible: false, category: 'dates' },
        { key: 'leadSource', label: 'Lead Source', visible: false, category: 'info' },
        { key: 'modeOfPayment', label: 'Payment Mode', visible: false, category: 'info' },
        { key: 'remark', label: 'Remark', visible: false, category: 'info' },

        { key: 'bde', label: 'BDE', visible: false, category: 'team' },
        { key: 'bda', label: 'BDA', visible: false, category: 'team' },
        { key: 'bdm', label: 'BDM', visible: false, category: 'team' },
        { key: 'bhead', label: 'Business Head', visible: false, category: 'team' },
    ]);

    const [columnFilters, setColumnFilters] = useState({});

    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {
        try {
            const { data } = await clientAPI.getAll();
            const clientsData = data.clients || [];
            setClients(clientsData);
            setFilteredClients(clientsData);
        } catch (err) {
            console.error("Error loading clients", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const results = clients.filter(client => {
            return Object.keys(client).some(key => {
                const value = client[key];

                if (key === 'createdBy' && value && typeof value === 'object') {
                    return value.name?.toLowerCase().includes(searchTerm.toLowerCase());
                }

                if (value && typeof value === 'string') {
                    return value.toLowerCase().includes(searchTerm.toLowerCase());
                }
                if (value && typeof value === 'number') {
                    return value.toString().includes(searchTerm);
                }
                return false;
            });
        });
        setFilteredClients(results);
        setCurrentPage(1);
    }, [searchTerm, clients]);

    // Get filtered data
    const filteredData = useMemo(() => {
        let result = clients;

        if (searchTerm) {
            result = result.filter(client => {
                return Object.keys(client).some(key => {
                    const value = client[key];
                    if (value && typeof value === 'string') {
                        return value.toLowerCase().includes(searchTerm.toLowerCase());
                    }
                    if (value && typeof value === 'number') {
                        return value.toString().includes(searchTerm);
                    }
                    if (key === 'createdBy' && value && typeof value === 'object') {
                        return value.name?.toLowerCase().includes(searchTerm.toLowerCase());
                    }
                    return false;
                });
            });
        }

        // Apply column filters
        result = result.filter(client => {
            return Object.keys(columnFilters).every(key => {
                if (!columnFilters[key]) return true;
                const filterValue = columnFilters[key].toLowerCase();

                if (key.includes('.')) {
                    const keys = key.split('.');
                    let value = client;
                    for (const k of keys) {
                        value = value?.[k];
                        if (value === undefined) break;
                    }
                    return value?.toString().toLowerCase().includes(filterValue);
                }

                const value = client[key];
                if (value === null || value === undefined) return false;

                if (typeof value === 'string') {
                    return value.toLowerCase().includes(filterValue);
                }
                if (typeof value === 'number') {
                    return value.toString().includes(filterValue);
                }
                return false;
            });
        });

        return result;
    }, [clients, searchTerm, columnFilters]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentClients = filteredData.slice(startIndex, endIndex);

    // Helper function to get nested property value
    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((current, key) => {
            return current ? current[key] : undefined;
        }, obj);
    };

    // Format value for export
    const formatValueForExport = (value, columnKey) => {
        if (value === null || value === undefined) {
            return '';
        }

        if (typeof value === 'object' && !(value instanceof Date)) {
            if (value.name) return value.name;
            if (value.filename) return value.filename;
            if (Array.isArray(value)) return value.length > 0 ? '[Array]' : '';
            return '[Object]';
        }

        switch (columnKey) {
            case 'dealAmount':
            case 'tokenReceivedAmount':
            case 'balanceAmount':
                return Number(value);

            case 'receivedPercent':
            case 'remainPercent':
                return Number(value);

            case 'createdAt':
            case 'tokenDate':
                return new Date(value).toLocaleDateString('en-IN');

            default:
                return String(value);
        }
    };

    // Export to Excel using exceljs
    const handleExportExcel = async () => {
        if (!clients.length) {
            alert('No data to export');
            return;
        }

        setExporting(true);
        try {
            // Create a new workbook
            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'Client Management System';
            workbook.created = new Date();

            // Add a worksheet
            const worksheet = workbook.addWorksheet('Clients');

            // Define columns with proper headers
            const columns = tableColumns.map(col => ({
                header: col.label,
                key: col.key,
                width: 20
            }));

            worksheet.columns = columns;

            // Style the header row
            const headerRow = worksheet.getRow(1);
            headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            headerRow.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF4F81BD' }
            };
            headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

            // Add data rows
            clients.forEach((client, index) => {
                const rowData = {};
                tableColumns.forEach(col => {
                    const value = getNestedValue(client, col.key);
                    rowData[col.key] = formatValueForExport(value, col.key);
                });

                const row = worksheet.addRow(rowData);

                // Alternate row colors for better readability
                if (index % 2 === 0) {
                    row.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFF2F2F2' }
                    };
                }

                // Format currency cells
                if (rowData.dealAmount || rowData.tokenReceivedAmount || rowData.balanceAmount) {
                    ['dealAmount', 'tokenReceivedAmount', 'balanceAmount'].forEach(key => {
                        if (rowData[key]) {
                            const cell = row.getCell(key);
                            cell.numFmt = '"₹"#,##0.00';
                        }
                    });
                }

                // Format percentage cells
                if (rowData.receivedPercent || rowData.remainPercent) {
                    ['receivedPercent', 'remainPercent'].forEach(key => {
                        if (rowData[key]) {
                            const cell = row.getCell(key);
                            cell.numFmt = '0.00"%";-0.00"%";0.00"%';
                        }
                    });
                }
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

            // Generate Excel file
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });

            // Download file
            const date = new Date().toISOString().split('T')[0];
            const fileName = `clients_export_${date}.xlsx`;

            if (typeof saveAs === 'function') {
                saveAs(blob, fileName);
            } else {
                // Fallback to native download
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }

        } catch (error) {
            console.error('Error exporting to Excel:', error);
            alert('Error exporting to Excel. Please try again.');
        } finally {
            setExporting(false);
        }
    };

    // Export to CSV
    const handleExportCSV = () => {
        if (!clients.length) {
            alert('No data to export');
            return;
        }

        setExporting(true);
        try {
            // Prepare data for export with ALL columns
            const exportData = clients.map(client => {
                const row = {};
                tableColumns.forEach(col => {
                    const value = getNestedValue(client, col.key);
                    row[col.label] = formatValueForExport(value, col.key);
                });
                return row;
            });

            // Create CSV string
            const headers = tableColumns.map(col => col.label);
            const csvRows = [
                headers.join(','),
                ...exportData.map(row =>
                    headers.map(header => {
                        const value = row[header];
                        // Escape quotes and wrap in quotes if contains comma
                        if (typeof value === 'string' &&
                            (value.includes(',') || value.includes('"') || value.includes('\n'))) {
                            return `"${value.replace(/"/g, '""')}"`;
                        }
                        return value;
                    }).join(',')
                )
            ];

            const csvContent = '\uFEFF' + csvRows.join('\n');

            // Create blob and download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const date = new Date().toISOString().split('T')[0];
            a.download = `clients_export_${date}.csv`;
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

    // Toggle column visibility
    const toggleColumnVisibility = (columnKey) => {
        setTableColumns(prev =>
            prev.map(col =>
                col.key === columnKey ? { ...col, visible: !col.visible } : col
            )
        );
    };

    const showAllColumns = () => {
        setTableColumns(prev => prev.map(col => ({ ...col, visible: true })));
    };

    const showBasicColumns = () => {
        setTableColumns(prev => prev.map(col => ({
            ...col,
            visible: col.category === 'basic'
        })));
    };

    // Handle column filter change
    const handleColumnFilter = (columnKey, value) => {
        setColumnFilters(prev => ({
            ...prev,
            [columnKey]: value
        }));
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm("");
        setColumnFilters({});
    };

    // Get visible columns
    const visibleColumns = tableColumns.filter(col => col.visible);


    const handleDeleteClient = async (clientId) => {
        if (!window.confirm("Are you sure you want to delete this client? This action cannot be undone.")) {
            return;
        }

        console.log("Attempting to delete client with ID:", clientId);
        console.log("Full client object:", clients.find(c => c._id === clientId));

        try {
            // Try with different ID formats if needed
            const response = await clientAPI.deleteClient(clientId);

            if (response.data && response.data.success) {
                alert("Client deleted successfully");
                loadClients(); // Refresh the client list
            } else {
                alert(response.data?.message || "Failed to delete client");
            }
        } catch (err) {
            console.error("Error deleting client", err);
            console.error("Error response:", err.response?.data);

            // Check if it's a 404 error
            if (err.response?.status === 404) {
                alert("Client not found. It may have already been deleted.");
            } else {
                alert("Failed to delete client. Please try again.");
            }
        }
    };

    // Get cell value for display
    // Get cell value for display
    const getCellValue = (client, columnKey) => {
        // Handle delete column - render delete button
        if (columnKey === 'delete') {
            return (
                <button
                    onClick={() => handleDeleteClient(client._id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete client"
                >
                    <DeleteIcon />
                </button>
            );
        }

        if (columnKey.includes('.')) {
            const keys = columnKey.split('.');
            let value = client;
            for (const k of keys) {
                value = value?.[k];
                if (value === undefined) break;
            }
            return value || "-";
        }

        let value = client[columnKey];

        if (value === null || value === undefined) {
            return "-";
        }

        switch (columnKey) {
            case 'dealAmount':
            case 'tokenReceivedAmount':
            case 'balanceAmount':
                return `₹${value.toLocaleString()}`;

            case 'receivedPercent':
            case 'remainPercent':
                return `${value}%`;

            case 'createdAt':
            case 'tokenDate':
                return new Date(value).toLocaleDateString('en-IN');

            case 'createdBy':
                return value.name || "Unknown";

            default:
                return value.toString();
        }
    };
    // Pagination component
    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const pageNumbers = [];
        const maxPageButtons = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

        if (endPage - startPage + 1 < maxPageButtons) {
            startPage = Math.max(1, endPage - maxPageButtons + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4">
                    <div>
                        <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                            <span className="font-medium">
                                {Math.min(endIndex, filteredData.length)}
                            </span> of{" "}
                            <span className="font-medium">{filteredData.length}</span> results
                        </p>
                    </div>

                    <div className="flex items-center justify-center sm:justify-end space-x-2">
                        <nav className="flex items-center space-x-2">
                            <button
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                                className="inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="First Page"
                            >
                                <ChevronLeftIcon />
                                <ChevronLeftIcon />
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeftIcon />
                                Previous
                            </button>

                            <div className="hidden sm:flex space-x-1">
                                {pageNumbers.map(number => (
                                    <button
                                        key={number}
                                        onClick={() => setCurrentPage(number)}
                                        className={`px-3 py-1 text-sm font-medium rounded-md min-w-[40px] ${currentPage === number
                                            ? "bg-blue-600 text-white"
                                            : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                                            }`}
                                    >
                                        {number}
                                    </button>
                                ))}
                            </div>
                            <span className="sm:hidden text-sm text-gray-700">
                                Page {currentPage} of {totalPages}
                            </span>

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                                <ChevronRightIcon />
                            </button>
                            <button
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
                                className="inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Last Page"
                            >
                                <ChevronRightIcon />
                                <ChevronRightIcon />
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">All Clients</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        {filteredData.length} clients found
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px]">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                            <SearchIcon />
                        </div>
                        <input
                            type="text"
                            placeholder="Search clients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <CloseIcon />
                            </button>
                        )}
                    </div>

                    {/* Column Selector */}
                    <button
                        onClick={() => setShowColumnSelector(!showColumnSelector)}
                        className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        <EyeIcon />
                        <span className="ml-2">Columns</span>
                    </button>

                    {/* Export Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={handleExportCSV}
                            disabled={exporting || clients.length === 0}
                            className={`inline-flex items-center px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${exporting || clients.length === 0
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                                } text-white`}
                        >
                            <CSVIcon />
                            <span className="ml-2">
                                {exporting ? 'Exporting...' : 'CSV'}
                            </span>
                        </button>
                        <button
                            onClick={handleExportExcel}
                            disabled={exporting || clients.length === 0}
                            className={`inline-flex items-center px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${exporting || clients.length === 0
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                                } text-white`}
                        >
                            <ExcelIcon />
                            <span className="ml-2">
                                {exporting ? 'Exporting...' : 'Excel'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Column Selector Modal */}
            {showColumnSelector && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Select Columns to Display
                                </h3>
                                <button
                                    onClick={() => setShowColumnSelector(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <CloseIcon />
                                </button>
                            </div>

                            <div className="mb-4 flex gap-2">
                                <button
                                    onClick={showBasicColumns}
                                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                >
                                    Show Basic Only
                                </button>
                                <button
                                    onClick={showAllColumns}
                                    className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                                >
                                    Show All Columns
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto">
                                {tableColumns.map(column => (
                                    <div key={column.key} className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                                        <button
                                            onClick={() => toggleColumnVisibility(column.key)}
                                            className="flex items-center justify-between w-full"
                                        >
                                            <div className="flex items-center">
                                                {column.visible ? (
                                                    <EyeIcon />
                                                ) : (
                                                    <EyeOffIcon />
                                                )}
                                                <div className="ml-3">
                                                    <span className="font-medium text-gray-900">
                                                        {column.label}
                                                    </span>
                                                    <span className="block text-xs text-gray-500">
                                                        {column.key}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 text-xs rounded-full ${column.category === 'basic' ? 'bg-blue-100 text-blue-800' :
                                                column.category === 'financial' ? 'bg-green-100 text-green-800' :
                                                    column.category === 'contact' ? 'bg-purple-100 text-purple-800' :
                                                        column.category === 'address' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-gray-100 text-gray-800'
                                                }`}>
                                                {column.category}
                                            </span>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setShowColumnSelector(false)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Apply Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow mb-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-700 flex items-center">
                        {/* <FilterIcon /> */}
                        <span className="ml-2">Column Filters</span>
                    </h3>
                    <button
                        onClick={clearFilters}
                        className="text-sm text-blue-600 hover:text-blue-800"
                    >
                        Clear all
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {visibleColumns.map(column => (
                        <div key={column.key}>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                {column.label}
                            </label>
                            <input
                                type="text"
                                placeholder={`Filter ${column.label.toLowerCase()}...`}
                                value={columnFilters[column.key] || ''}
                                onChange={(e) => handleColumnFilter(column.key, e.target.value)}
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {visibleColumns.map(column => (
                                    <th
                                        key={column.key}
                                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                                    >
                                        {column.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={visibleColumns.length} className="text-center p-8">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3"></div>
                                            <span className="text-gray-600">Loading clients...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : currentClients.length === 0 ? (
                                <tr>
                                    <td colSpan={visibleColumns.length} className="text-center p-8 text-gray-600">
                                        <div className="flex flex-col items-center justify-center">
                                            <SearchIcon />
                                            <p className="text-lg font-medium mb-1 mt-2">No clients found</p>
                                            <p className="text-sm text-gray-500">
                                                Try adjusting your search or filters
                                            </p>
                                            <button
                                                onClick={clearFilters}
                                                className="mt-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-800"
                                            >
                                                Clear all filters
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                currentClients.map((client) => (
                                    <tr key={client._id} className="hover:bg-gray-50">
                                        {visibleColumns.map(column => (
                                            <td
                                                key={`${client._id}-${column.key}`}
                                                className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap"
                                            >
                                                {getCellValue(client, column.key)}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {renderPagination()}
            </div>
        </div>
    );
}