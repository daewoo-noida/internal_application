
import React, { useState, useEffect } from 'react';
import { articleAPI } from '../../utils/api';

const AdminArticles = () => {
    const [articles, setArticles] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        articleLink: '',
        status: 'published'
    });

    const fetchArticles = async () => {
        try {
            const response = await articleAPI.getAllArticles();
            setArticles(response.data.data);
        } catch (error) {
            console.error('Error fetching articles:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await articleAPI.createArticle(formData);
            fetchArticles();
            setFormData({ title: '', description: '', articleLink: '', status: 'published' });
        } catch (error) {
            console.error('Error creating article:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this article?')) {
            try {
                await articleAPI.deleteArticle(id);
                fetchArticles();
            } catch (error) {
                console.error('Error deleting article:', error);
            }
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Manage Articles</h2>

            {/* Create Article Form */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-lg font-semibold mb-4">Create New Article</h3>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full p-2 border rounded"
                        rows="3"
                        required
                    />
                    <input
                        type="url"
                        placeholder="Article Link (https://...)"
                        value={formData.articleLink}
                        onChange={(e) => setFormData({ ...formData, articleLink: e.target.value })}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Create Article
                    </button>
                </div>
            </form>

            {/* Articles List */}
            <div className="bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-semibold p-4 border-b">All Articles</h3>
                <div className="p-4">
                    {articles.map(article => (
                        <div key={article._id} className="border-b py-4">
                            <h4 className="font-semibold">{article.title}</h4>
                            <p className="text-gray-600 text-sm mt-1">{article.description}</p>
                            <div className="flex items-center justify-between mt-2">
                                <a href={article.articleLink} target="_blank" rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-sm">
                                    {article.articleLink}
                                </a>
                                <button
                                    onClick={() => handleDelete(article._id)}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminArticles;