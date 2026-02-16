import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { blogAPI, uploadAPI, getApiOrigin } from '../services/api';

const BlogManager = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ title: '', category: '', author: '', excerpt: '', content: '', published: true });
    const [isUploading, setIsUploading] = useState(false);

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert('Image size must be less than 10MB');
            return;
        }

        setIsUploading(true);
        try {
            const response = await uploadAPI.uploadImage(file, 'blog');
            if (response.success) {
                const apiOrigin = getApiOrigin() || window.location.origin;
                const imageUrl = `${apiOrigin}${response.data.path}`;
                setFormData({ ...formData, featured_image: imageUrl });
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await blogAPI.getAll();
            if (response.success) {
                setPosts(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this post?')) {
            try {
                await blogAPI.delete(id);
                setPosts(posts.filter(p => p.id !== id));
            } catch (error) {
                console.error('Failed to delete post:', error);
                alert('Failed to delete post');
            }
        }
    };

    const handleCreate = async () => {
        try {
            if (editingId) {
                // Update existing post
                const response = await blogAPI.update(editingId, formData);
                if (response.success) {
                    setPosts(posts.map(p => p.id === editingId ? response.data : p));
                    setEditingId(null);
                    setIsCreating(false);
                    setFormData({ title: '', category: '', author: '', excerpt: '', content: '', published: true });
                }
            } else {
                // Create new post
                const response = await blogAPI.create(formData);
                if (response.success) {
                    setPosts([response.data, ...posts]);
                    setIsCreating(false);
                    setFormData({ title: '', category: '', author: '', excerpt: '', content: '', published: true });
                }
            }
        } catch (error) {
            console.error('Failed to save post:', error);
            alert('Failed to save post');
        }
    };

    const handleEdit = (post) => {
        setFormData({
            title: post.title,
            category: post.category,
            author: post.author,
            excerpt: post.excerpt,
            content: post.content,
            featured_image: post.featured_image,
            published: post.published
        });
        setEditingId(post.id);
        setIsCreating(true);
    };

    const handleCancel = () => {
        setIsCreating(false);
        setEditingId(null);
        setFormData({ title: '', category: '', author: '', excerpt: '', content: '', published: true });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-serif text-white mb-2">Manage Blog</h2>
                    <p className="text-white/40 text-sm">Create and edit articles.</p>
                </div>
                {!isCreating && (
                    <button onClick={() => setIsCreating(true)} className="bg-[#C5A059] text-black px-6 py-3 rounded text-sm font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2">
                        <Plus size={16} /> New Article
                    </button>
                )}
            </div>

            {isCreating && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-white/5 border border-white/10 p-8 rounded-xl mb-8"
                >
                    <h3 className="text-xl text-white mb-6">{editingId ? 'Edit Post' : 'Create New Post'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <input
                            placeholder="Article Title"
                            className="bg-black/20 border border-white/10 p-4 text-white rounded focus:border-[#C5A059] outline-none"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                        <input
                            placeholder="Category"
                            className="bg-black/20 border border-white/10 p-4 text-white rounded focus:border-[#C5A059] outline-none"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        />
                        <input
                            placeholder="Author"
                            className="bg-black/20 border border-white/10 p-4 text-white rounded focus:border-[#C5A059] outline-none"
                            value={formData.author}
                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        />
                        <input
                            placeholder="Excerpt (Short Summary)"
                            className="bg-black/20 border border-white/10 p-4 text-white rounded focus:border-[#C5A059] outline-none"
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        />
                    </div>
                    
                    {/* Image Upload Section */}
                    <div className="mb-6 border border-white/10 rounded-lg p-6 bg-black/20">
                        <h4 className="text-white text-sm font-bold mb-4 uppercase tracking-wider">Featured Image</h4>
                        
                        <div className="flex gap-4 mb-4">
                            <label className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="blog-image-upload"
                                    disabled={isUploading}
                                />
                                <div className="bg-[#C5A059] text-black px-6 py-3 rounded text-sm font-bold uppercase tracking-widest hover:bg-white transition-colors cursor-pointer flex items-center justify-center gap-2">
                                    {isUploading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                            <span>Uploading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={16} />
                                            <span>Upload Image</span>
                                        </>
                                    )}
                                </div>
                            </label>
                        </div>

                        {formData.featured_image && (
                            <div className="w-full h-32 bg-white/10 rounded overflow-hidden relative group">
                                <img 
                                    src={formData.featured_image} 
                                    alt="Featured preview" 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <ImageIcon className="text-white" size={32} />
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <textarea
                        placeholder="Article Content..."
                        rows={6}
                        className="w-full bg-black/20 border border-white/10 p-4 text-white rounded focus:border-[#C5A059] outline-none mb-6"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    />
                    
                    {/* Published Toggle */}
                    <div className="flex items-center gap-3 mb-6 p-4 bg-black/20 border border-white/10 rounded">
                        <label className="flex items-center gap-3 cursor-pointer flex-1">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={formData.published}
                                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                                    className="sr-only"
                                />
                                <div className={`w-14 h-8 rounded-full transition-colors ${
                                    formData.published ? 'bg-green-500' : 'bg-white/20'
                                }`}>
                                    <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                                        formData.published ? 'translate-x-6' : 'translate-x-0'
                                    }`} />
                                </div>
                            </div>
                            <div>
                                <span className="text-white font-bold text-sm uppercase tracking-wider">Publish Immediately</span>
                                <p className="text-white/40 text-xs mt-1">
                                    {formData.published ? 'Blog will be visible on the website' : 'Save as draft (not visible to public)'}
                                </p>
                            </div>
                        </label>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={handleCreate} className="bg-green-500 text-white px-6 py-2 rounded font-bold uppercase text-xs">{editingId ? 'Update' : 'Publish'}</button>
                        <button onClick={handleCancel} className="bg-white/10 text-white px-6 py-2 rounded font-bold uppercase text-xs hover:bg-white/20">Cancel</button>
                    </div>
                </motion.div>
            )}

            {isLoading ? (
                <div className="text-center text-white/40 py-12">Loading blog posts...</div>
            ) : posts.length === 0 ? (
                <div className="text-center text-white/40 py-12">No blog posts yet.</div>
            ) : (
                <div className="grid gap-4">
                {posts.map(post => (
                    <div key={post.id} className="bg-white/5 border border-white/10 p-6 rounded-xl flex items-center justify-between group hover:border-white/20 transition-all">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-white/10 rounded overflow-hidden">
                                <img src={post.featured_image || post.image} alt={post.title} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="text-white font-serif text-lg">{post.title}</h4>
                                <div className="flex gap-4 text-xs text-white/40 mt-1 uppercase tracking-wide">
                                    <span>{post.category}</span>
                                    <span>•</span>
                                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span>{post.author}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 opacity-50 group-hover:opacity-100 transition-opacity">
                            {/* In a real app these would work, for now just UI placeholders */}
                            <button onClick={() => handleEdit(post)} className="p-2 bg-white/5 rounded text-white hover:text-[#C5A059]"><Edit2 size={18} /></button>
                            <button onClick={() => handleDelete(post.id)} className="p-2 bg-white/5 rounded text-white hover:text-red-400"><Trash2 size={18} /></button>
                        </div>
                    </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BlogManager;
