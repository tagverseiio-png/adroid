import React, { useEffect } from 'react';
import { ArrowLeft, Calendar, User, Share2, Tag } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { normalizeAssetUrl } from '../services/api';

const BlogPost = ({ post, onBack }) => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!post) return null;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-stone-200 pt-24 md:pt-32 pb-16 md:pb-24 px-6 md:px-24">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-4xl mx-auto"
            >
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-white/40 hover:text-[#C5A059] transition-colors text-[10px] md:text-xs uppercase tracking-widest mb-8 md:mb-12"
                >
                    <ArrowLeft size={14} /> Back to Journal
                </button>

                {/* Header */}
                <header className="mb-10 md:mb-12">
                    <span className="text-[#C5A059] text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold block mb-3 md:mb-4">
                        {post.category}
                    </span>
                    <h1 className="text-3xl md:text-6xl font-serif text-white mb-6 md:mb-8 leading-tight">
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap gap-8 text-xs uppercase tracking-wider text-white/40 font-sans border-b border-white/10 pb-8">
                        <span className="flex items-center gap-2"><Calendar size={14} /> {new Date(post.created_at).toLocaleDateString()}</span>
                        <span className="flex items-center gap-2"><User size={14} /> {post.author}</span>
                        <span className="flex items-center gap-2 ml-auto hover:text-white cursor-pointer"><Share2 size={14} /> Share</span>
                    </div>
                </header>

                {/* Featured Image */}
                <div className="aspect-video w-full overflow-hidden mb-16 grayscale hover:grayscale-0 transition-all duration-1000">
                    <img src={normalizeAssetUrl(post.featured_image || post.image)} alt={post.title} className="w-full h-full object-cover" />
                </div>

                {/* Content */}
                <article className="prose prose-invert prose-lg max-w-none text-white/70 font-light leading-relaxed">
                    {/* Mock Rich Content */}
                    <p className="text-xl text-white font-serif italic mb-8 border-l-2 border-[#C5A059] pl-6">
                        {post.excerpt}
                    </p>
                    <p className="mb-6">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    </p>
                    <h3 className="text-2xl font-serif text-white mt-12 mb-6">Designing for the Future</h3>
                    <p className="mb-6">
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.
                    </p>
                    <div className="grid md:grid-cols-2 gap-8 my-12 not-prose">
                        <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200" className="w-full h-64 object-cover grayscale" alt="Detail 1" />
                        <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1200" className="w-full h-64 object-cover grayscale" alt="Detail 2" />
                    </div>
                    <p>
                        Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.
                    </p>
                </article>

                {/* Footer Tags */}
                <div className="mt-16 pt-8 border-t border-white/10 flex gap-4">
                    {['Architecture', 'Design', 'Trends'].map(tag => (
                        <span key={tag} className="flex items-center gap-2 bg-white/5 px-4 py-2 text-xs text-white/60 rounded-full hover:bg-white/10 transition-colors cursor-pointer">
                            <Tag size={12} /> {tag}
                        </span>
                    ))}
                </div>

            </motion.div>
        </div>
    );
};

export default BlogPost;
