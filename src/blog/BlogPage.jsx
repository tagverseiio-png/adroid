import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { blogAPI, normalizeAssetUrl } from '../services/api';

const BlogPage = ({ onReadMore }) => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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
            console.error('Failed to fetch blog posts:', error);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-stone-200 pt-32 md:pt-48 pb-16 md:pb-24 px-6 md:px-24">

            {/* Header */}
            <div className="max-w-7xl mx-auto mb-12 md:mb-20 text-center">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[#C5A059] text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold block mb-3 md:mb-4"
                >
                    Insights & Articles
                </motion.span>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl md:text-6xl font-serif text-white mb-4 md:mb-6 font-light"
                >
                    Design Stories
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-white/60 max-w-2xl mx-auto font-sans font-light text-sm leading-relaxed"
                >
                    Thoughts, trends, and insights from our team on architecture, interior design, and the built environment.
                </motion.p>
            </div>

            {/* Featured / Grid */}
            {isLoading ? (
                <div className="text-center text-white/40 py-20">Loading blog posts...</div>
            ) : posts.length === 0 ? (
                <div className="text-center text-white/40 py-20">No blog posts yet.</div>
            ) : (
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {posts.map((post, idx) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="group cursor-pointer"
                        onClick={() => onReadMore(post)}
                    >
                        {/* Image */}
                        <div className="aspect-[4/3] overflow-hidden mb-6 relative">
                            <img
                                src={normalizeAssetUrl(post.featured_image || post.image)}
                                alt={post.title}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                            />
                            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur text-white px-3 py-1 text-[10px] uppercase tracking-widest font-bold">
                                {post.category}
                            </div>
                        </div>

                        {/* Content */}
                        <div>
                            <div className="flex gap-4 text-[10px] uppercase tracking-wider text-white/40 mb-3 font-sans">
                                <span className="flex items-center gap-1"><Calendar size={10} /> {new Date(post.created_at).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1"><User size={10} /> {post.author}</span>
                            </div>
                            <h3 className="text-2xl font-serif text-white mb-3 group-hover:text-[#C5A059] transition-colors leading-tight">
                                {post.title}
                            </h3>
                            <p className="text-white/50 text-sm font-light leading-relaxed mb-6 line-clamp-3">
                                {post.excerpt}
                            </p>
                            <span className="text-[#C5A059] text-xs uppercase tracking-widest font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                                Read Article <ArrowRight size={12} />
                            </span>
                        </div>
                    </motion.div>
                ))}
                </div>
            )}
        </div>
    );
};

export default BlogPage;
