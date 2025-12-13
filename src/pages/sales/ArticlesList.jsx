import React, { useState, useEffect } from 'react';
import { articleAPI } from '../../utils/api';
import { FiExternalLink, FiCalendar, FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ArticlesList = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const ARTICLES_TO_SHOW = 3;

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const response = await articleAPI.getPublishedArticles({
                page: 1,
                limit: ARTICLES_TO_SHOW
            });

            console.log("Homepage articles fetched:", response.data.data);
            setArticles(response.data.data || []);
        } catch (err) {
            console.error('Error fetching homepage articles:', err);
            setError('Failed to load articles');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'Recently';

        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Recently';

            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (error) {
            return 'Recently';
        }
    };


    const truncateText = (text, maxLength = 120) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const handleViewMore = () => {
        navigate('/sales/articles');
    };

    if (loading) {
        return (
            <div className="py-8">
                <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-8">
                <div className="text-center text-red-500">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (articles.length === 0) {
        return (
            <div className="py-8">
                <div className="text-center text-gray-500">
                    <p>No articles available at the moment.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8 px-4 md:px-6 bg-gray-50">

            <div className="max-w-7xl mx-auto">
                <div className=" flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Latest News & Updates</h2>
                        <p className="text-gray-600 mt-2">Stay informed with our latest articles and company updates</p>
                    </div>

                    {/* View More Button */}
                    <button
                        onClick={handleViewMore}
                        className="mt-4 md:mt-0 px-5 py-2.5 bg-[#0070b9] text-white rounded-lg transition-colors flex items-center gap-2 group"
                    >
                        View All Articles
                        <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article, index) => (
                        <div
                            key={article._id}
                            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100"
                        >
                            {/* Article Content */}
                            <div className="p-6">


                                {/* Article Title */}
                                <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                                    {article.title}
                                </h3>


                                <p className="text-gray-600 mb-4 line-clamp-3">
                                    {truncateText(article.description, 150)}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                                    <FiCalendar className="text-gray-400" />
                                    <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                    <a
                                        href={article.articleLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium group"
                                    >
                                        Read Full Article
                                        <FiExternalLink className="group-hover:translate-x-1 transition-transform" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View More Button for Mobile or additional placement */}
                <div className="mt-8 flex justify-center md:hidden">
                    <button
                        onClick={handleViewMore}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        View All Articles
                        <FiChevronRight />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ArticlesList;