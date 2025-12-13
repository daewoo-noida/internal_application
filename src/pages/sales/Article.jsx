import React, { useState, useEffect } from 'react';
import { articleAPI } from '../../utils/api';
import { FiCopy, FiCheck, FiFilter, FiLink, FiTrash2 } from 'react-icons/fi';
import { MdSelectAll, MdDeselect } from 'react-icons/md';

const UserArticles = () => {
    const [articles, setArticles] = useState([]);
    const [filteredArticles, setFilteredArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedArticles, setSelectedArticles] = useState(new Set());
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showAll, setShowAll] = useState(false);
    const [pagination, setPagination] = useState(null);
    const [copyFormat, setCopyFormat] = useState('numbered'); // New state for copy format

    const fetchArticles = async () => {
        try {
            let response;

            if (showAll) {
                // Fetch all articles without pagination
                response = await articleAPI.getAllPublishedArticles();
            } else {
                // Fetch with pagination
                response = await articleAPI.getPublishedArticles({
                    page: 1,
                    limit: 50 // Increase limit to show more articles
                });
            }

            // console.log("Fetched articles:", response.data.data);
            // console.log("Total articles fetched:", response.data.data.length);
            // console.log("Pagination info:", response.data.pagination);

            if (response.data.pagination) {
                setPagination(response.data.pagination);
                console.log(`Showing ${response.data.data.length} of ${response.data.pagination.totalItems} articles`);
            }

            // Process articles
            const processedArticles = response.data.data.map(article => ({
                ...article,
                displayDate: article.createdAt || article.createdAt || article.updatedAt
            }));

            setArticles(processedArticles);
            setFilteredArticles(processedArticles);
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, [showAll]);

    // Filter articles based on criteria
    useEffect(() => {
        let filtered = [...articles];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(article =>
                article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply date filter
        if (filter !== 'all') {
            const now = new Date();
            filtered = filtered.filter(article => {
                const articleDate = new Date(article.createdAt);
                const diffTime = now - articleDate;
                const diffDays = diffTime / (1000 * 60 * 60 * 24);

                switch (filter) {
                    case 'today':
                        return diffDays < 1;
                    case 'week':
                        return diffDays < 7;
                    case 'month':
                        return diffDays < 30;
                    default:
                        return true;
                }
            });
        }

        setFilteredArticles(filtered);
    }, [articles, filter, searchTerm]);

    // Toggle select mode
    const toggleSelectMode = () => {
        setIsSelectMode(!isSelectMode);
        if (!isSelectMode) {
            setSelectedArticles(new Set());
        }
    };

    // Toggle article selection
    const toggleArticleSelection = (articleId) => {
        const newSelected = new Set(selectedArticles);
        if (newSelected.has(articleId)) {
            newSelected.delete(articleId);
        } else {
            newSelected.add(articleId);
        }
        setSelectedArticles(newSelected);
    };

    // Select all visible articles
    const selectAll = () => {
        const allIds = new Set(filteredArticles.map(article => article._id));
        setSelectedArticles(allIds);
    };

    // Deselect all
    const deselectAll = () => {
        setSelectedArticles(new Set());
    };

    // Copy selected article links with proper formatting
    const copySelectedLinks = () => {
        const selected = filteredArticles.filter(article =>
            selectedArticles.has(article._id)
        );

        if (selected.length === 0) {
            alert('Please select articles first');
            return;
        }

        let formattedText;

        switch (copyFormat) {
            case 'numbered':

                formattedText = selected.map((article, index) =>
                    `${index + 1}. ${article.articleLink}`
                ).join('\n');
                break;

            case 'titles':

                formattedText = selected.map((article, index) =>
                    `${index + 1}. ${article.title}\n${article.articleLink}`
                ).join('\n\n');
                break;

            case 'linksOnly':

                formattedText = selected.map(article => article.articleLink).join('\n');
                break;

            default:
                formattedText = selected.map((article, index) =>
                    `${index + 1}. ${article.articleLink}`
                ).join('\n');
        }

        navigator.clipboard.writeText(formattedText)
            .then(() => {
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 3000);

                // Show notification
                alert(`✅ Copied ${selected.length} article link${selected.length > 1 ? 's' : ''} to clipboard!\n\nLinks are formatted with ${copyFormat === 'numbered' ? 'numbers' : copyFormat === 'titles' ? 'titles and links' : 'links only'}.`);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                alert('Failed to copy links');
            });
    };

    // Copy single article link
    const copySingleLink = (link, title = '') => {
        let textToCopy = link;
        if (title) {
            textToCopy = `${title}\n${link}`;
        }

        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                alert('Link copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                alert('Failed to copy link');
            });
    };

    // Get selected count
    const selectedCount = selectedArticles.size;

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="p-6 mt-16 max-w-7xl mx-auto">

            <div className=" mb-8 text-center ">
                <img src="/images/articles.png" alt="" className="mx-auto " />
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-end items-start md:items-center mb-6 gap-4">
                {/* <div>
                    <h2 className="text-2xl font-bold text-gray-800">Latest Articles</h2>
                    <p className="text-gray-600 mt-1">Stay updated with our latest news and updates</p>
                </div> */}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 py-8 md:py-0 justify-end w-full md:w-auto">
                    {/* Search Input */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Filter Dropdown */}
                    <div className="relative">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                        </select>
                        <FiFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Select Mode Toggle */}
                    <button
                        onClick={toggleSelectMode}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${isSelectMode
                            ? 'bg-[#0070b9] text-white hover:bg-blue-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {isSelectMode ? 'Cancel Selection' : 'Select Articles'}
                    </button>
                </div>
            </div>

            {/* Selection Actions Bar */}
            {isSelectMode && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <span className="font-medium text-blue-800">
                                {selectedCount} article{selectedCount !== 1 ? 's' : ''} selected
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={selectAll}
                                    className="px-3 py-1 text-sm bg-white border border-blue-300 text-blue-600 rounded hover:bg-blue-50 flex items-center gap-1"
                                >
                                    <MdSelectAll /> Select All
                                </button>
                                <button
                                    onClick={deselectAll}
                                    className="px-3 py-1 text-sm bg-white border border-gray-300 text-gray-600 rounded hover:bg-gray-50 flex items-center gap-1"
                                >
                                    <MdDeselect /> Deselect All
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Copy Format Selector */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Format:</span>
                                <select
                                    value={copyFormat}
                                    onChange={(e) => setCopyFormat(e.target.value)}
                                    className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                                >
                                    <option value="numbered">Numbered Links</option>
                                    <option value="titles">With Titles</option>
                                    <option value="linksOnly">Links Only</option>
                                </select>
                            </div>

                            {/* Copy Button */}
                            <button
                                onClick={copySelectedLinks}
                                disabled={selectedCount === 0}
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${selectedCount > 0
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {copySuccess ? (
                                    <>
                                        <FiCheck /> Copied!
                                    </>
                                ) : (
                                    <>
                                        <FiCopy /> Copy ({selectedCount})
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Preview of what will be copied */}
                    {selectedCount > 0 && (
                        <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                            <div className="text-xs text-gray-500 mb-1">Preview of first 2 links:</div>
                            <div className="text-sm text-gray-700 font-mono max-h-16 overflow-y-auto">
                                {filteredArticles
                                    .filter(article => selectedArticles.has(article._id))
                                    .slice(0, 2)
                                    .map((article, index) => (
                                        <div key={article._id} className="mb-1">
                                            {copyFormat === 'numbered' && `${index + 1}. `}
                                            {copyFormat === 'titles' && `${index + 1}. ${article.title}\n`}
                                            <span className="text-blue-600 break-all">{article.articleLink}</span>
                                        </div>
                                    ))}
                                {selectedCount > 2 && (
                                    <div className="text-gray-400 mt-1 text-xs">
                                        ... and {selectedCount - 2} more link{selectedCount - 2 > 1 ? 's' : ''}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map(article => (
                    <div
                        key={article._id}
                        className={`bg-white rounded-lg shadow-md overflow-hidden border-2 transition-all duration-200 ${isSelectMode && selectedArticles.has(article._id)
                            ? 'border-blue-500 ring-2 ring-blue-200'
                            : 'border-transparent hover:border-gray-200'
                            }`}
                        onClick={() => {
                            if (isSelectMode) {
                                toggleArticleSelection(article._id);
                            }
                        }}
                    >
                        {/* Selection Checkbox (only in select mode) */}
                        {isSelectMode && (
                            <div className="absolute top-4 left-4 z-10">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedArticles.has(article._id)
                                    ? 'bg-blue-500 border-blue-500'
                                    : 'bg-white border-gray-300'
                                    }`}>
                                    {selectedArticles.has(article._id) && (
                                        <FiCheck className="text-white text-sm" />
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="p-6 relative">
                            {/* Article Title */}
                            <h3 className="text-xl font-semibold mb-3 pr-8 text-gray-800">
                                {article.title}
                            </h3>

                            {/* Article Description */}
                            <p className="text-gray-600 mb-4 line-clamp-3">
                                {article.description}
                            </p>

                            {/* Article Footer */}
                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                                {/* Date and Actions */}
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-gray-500">
                                            {new Date(article.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </span>

                                        {/* Copy Single Link Button */}
                                        {!isSelectMode && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    copySingleLink(article.articleLink, article.title);
                                                }}
                                                className="text-gray-500 hover:text-blue-600 transition-colors"
                                                title="Copy link"
                                            >
                                                <FiLink />
                                            </button>
                                        )}
                                    </div>

                                    {/* Read More Button */}
                                    {!isSelectMode && (
                                        <a
                                            href={article.articleLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="bg-[#0070b9] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                        >
                                            Read More
                                            <span className="text-lg">→</span>
                                        </a>
                                    )}

                                    {/* Selection Indicator */}
                                    {isSelectMode && (
                                        <span className={`text-sm px-3 py-1 rounded-full ${selectedArticles.has(article._id)
                                            ? 'bg-blue-100 text-blue-600'
                                            : 'text-gray-400'
                                            }`}>
                                            {selectedArticles.has(article._id) ? 'Selected' : 'Click to select'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredArticles.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📰</div>
                    <p className="text-gray-500 text-lg mb-2">No articles found</p>
                    <p className="text-gray-400">
                        {searchTerm
                            ? `No articles match "${searchTerm}"`
                            : filter !== 'all'
                                ? `No articles from the selected time period`
                                : 'No articles available at the moment'
                        }
                    </p>
                    {(searchTerm || filter !== 'all') && (
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setFilter('all');
                            }}
                            className="mt-4 text-blue-600 hover:text-blue-700 underline"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            )}

            {/* Stats Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap justify-between items-center text-sm text-gray-500">
                    <div>
                        Showing {filteredArticles.length} of {articles.length} article{articles.length !== 1 ? 's' : ''}
                    </div>
                    <div className="flex gap-4">
                        {isSelectMode && (
                            <span className="text-blue-600">
                                Selection mode active • {selectedCount} selected
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserArticles;