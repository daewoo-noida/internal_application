import { useState, useEffect } from 'react';
import { franchiseAPI } from '../../utils/api';

const FranchiseManager = ({ type = 'master' }) => {
    const [franchises, setFranchises] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        status: 'Available',
        image: '',
        description: '',
        // region: '',
        type: type
    });
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        fetchFranchises();
    }, [type]);

    const fetchFranchises = async () => {
        try {
            const response = await franchiseAPI.getAll(type);
            setFranchises(response.data);
        } catch (error) {
            console.error('Error fetching franchises:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingId) {
                await franchiseAPI.update(editingId, formData);
            } else {
                await franchiseAPI.create(formData);
            }

            resetForm();
            fetchFranchises();
        } catch (error) {
            console.error('Error saving franchise:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (franchise) => {
        setFormData(franchise);
        setEditingId(franchise._id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this franchise?')) {
            try {
                await franchiseAPI.delete(id);
                fetchFranchises();
            } catch (error) {
                console.error('Error deleting franchise:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            status: 'Available',
            image: '',
            description: '',
            region: '',
            type: type
        });
        setEditingId(null);
    };

    const filteredFranchises = franchises.filter(franchise => {
        const matchesSearch = franchise.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || franchise.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                    Manage {type === 'master' ? 'Master Franchises' : type === 'ddp' ? 'DDP Franchises' : 'Signature Stores'}
                </h2>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                    <input
                        type="text"
                        placeholder="Search franchises..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                    >
                        <option value="All">All Status</option>
                        <option value="Available">Available</option>
                        <option value="Booked">Booked</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {/* Form Section */}
                <div>
                    <div className="bg-gray-50 p-4 md:p-6 rounded-lg border border-gray-200">
                        <h3 className="text-base md:text-lg font-semibold mb-4">
                            {editingId ? 'Edit Franchise' : 'Add New Franchise'}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                                    placeholder="Enter franchise title"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status *
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                                    >
                                        <option value="Available">Available</option>
                                        <option value="Booked">Booked</option>
                                    </select>
                                </div>

                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Region
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.region}
                                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                                        placeholder="Enter region"
                                    />
                                </div> */}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Image URL *
                                </label>
                                <input
                                    type="url"
                                    required
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                                    placeholder="https://example.com/image.jpg"
                                />
                                {formData.image && (
                                    <div className="mt-2">
                                        <img
                                            src={formData.image}
                                            alt="Preview"
                                            className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-md border"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/100?text=Invalid+URL';
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                                    placeholder="Optional description"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 text-sm md:text-base"
                                >
                                    {loading ? 'Saving...' : editingId ? 'Update' : 'Add'} Franchise
                                </button>

                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm md:text-base"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="text-base md:text-lg font-semibold mb-4">
                            Franchises ({filteredFranchises.length})
                        </h3>

                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                            {filteredFranchises.map((franchise) => (
                                <div
                                    key={franchise._id}
                                    className="bg-white border border-gray-200 rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-3 flex-1 min-w-0">
                                            <img
                                                src={franchise.image}
                                                alt={franchise.title}
                                                className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-md flex-shrink-0"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/64?text=No+Image';
                                                }}
                                            />
                                            <div className="min-w-0 flex-1">
                                                <h4 className="font-semibold text-gray-800 text-sm md:text-base truncate">{franchise.title}</h4>
                                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${franchise.status === 'Available'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {franchise.status}
                                                    </span>
                                                    {franchise.region && (
                                                        <span className="text-xs md:text-sm text-gray-500 truncate">{franchise.region}</span>
                                                    )}
                                                </div>
                                                {franchise.description && (
                                                    <p className="text-xs md:text-sm text-gray-600 mt-2 line-clamp-2">
                                                        {franchise.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-1 md:gap-2 flex-shrink-0 ml-2">
                                            <button
                                                onClick={() => handleEdit(franchise)}
                                                className="text-blue-600 hover:text-blue-800 p-1"
                                                title="Edit"
                                            >
                                                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(franchise._id)}
                                                className="text-red-600 hover:text-red-800 p-1"
                                                title="Delete"
                                            >
                                                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {filteredFranchises.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <svg className="w-10 h-10 md:w-12 md:h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="mt-2 text-sm md:text-base">No franchises found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FranchiseManager;