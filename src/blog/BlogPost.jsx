import React, { useEffect } from 'react';
import { ArrowLeft, Calendar, User, Share2, Tag, MessageSquare, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { blogAPI, normalizeAssetUrl } from '../services/api';
import BackButton from '../components/BackButton';

const BlogPost = ({ post, onBack }) => {

    const [comments, setComments] = React.useState([]);
    const [commentForm, setCommentForm] = React.useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [msg, setMsg] = React.useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchComments();
    }, [post.slug]);

    const fetchComments = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/blog/${post.slug}/comments`).then(r => r.json());
            if (response.success) setComments(response.data);
        } catch (e) { console.error('Comments fetch error:', e); }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/blog/${post.slug}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(commentForm)
            }).then(r => r.json());
            if (res.success) {
                setMsg('Comment submitted for review!');
                setCommentForm({ name: '', email: '', message: '' });
                setTimeout(() => setMsg(''), 3000);
            }
        } catch (e) { alert('Failed to post comment.'); }
        finally { setIsSubmitting(false); }
    };

    if (!post) return null;

    // Parse specialized content
    let richContent = { text: post.content };
    try {
        if (post.content.startsWith('{')) {
            richContent = JSON.parse(post.content);
        }
    } catch (e) { /* fallback to plain text */ }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-stone-200 pt-24 md:pt-32 pb-16 md:pb-24 px-6 md:px-24">
            <BackButton onBack={onBack} />
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
                    {post.sub_category && (
                        <span className="text-white/60 text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold block mb-3 md:mb-4">
                            {post.sub_category}
                        </span>
                    )}
                    <h1 className="text-3xl md:text-5xl font-logo uppercase tracking-widest text-white mb-6 md:mb-8 leading-tight">
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap gap-8 text-xs uppercase tracking-wider text-white/40 font-sans border-b border-white/10 pb-8">
                        <span className="flex items-center gap-2">
                            <Calendar size={14} /> 
                            {richContent.event_date ? (
                                <span className="text-[#C5A059] font-bold">Event Date: {new Date(richContent.event_date).toLocaleDateString()}</span>
                            ) : (
                                new Date(post.created_at).toLocaleDateString()
                            )}
                        </span>
                        <span className="flex items-center gap-2"><User size={14} /> {post.author}</span>
                        <span className="flex items-center gap-2 ml-auto hover:text-white cursor-pointer"><Share2 size={14} /> Share</span>
                    </div>
                </header>

                {/* Media Section */}
                {richContent.video_url ? (
                    <div className="aspect-video w-full mb-16 border border-white/10 rounded-lg overflow-hidden bg-black">
                        <iframe
                            src={richContent.video_url.replace('watch?v=', 'embed/')}
                            title={post.title}
                            className="w-full h-full"
                            allowFullScreen
                        ></iframe>
                    </div>
                ) : (
                    <div
                        className="aspect-video w-full overflow-hidden mb-16 grayscale hover:grayscale-0 transition-all duration-1000"
                    >
                        <img src={normalizeAssetUrl(post.featured_image || post.image)} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                )}

                {/* Content */}
                <article className="prose prose-invert prose-lg max-w-none text-white/70 font-light leading-relaxed">
                    <p className="text-xl text-white font-sans font-medium mb-8 border-l-2 border-[#C5A059] pl-6 uppercase tracking-wider">
                        {post.excerpt}
                    </p>
                    <div className="whitespace-pre-line">
                        {richContent.text || post.content}
                    </div>
                </article>

                {/* Footer Tags */}
                <div className="mt-16 pt-8 border-t border-white/10 mb-20 flex gap-4">
                    {['Architecture', 'Design', 'Trends'].map(tag => (
                        <span key={tag} className="flex items-center gap-2 bg-white/5 px-4 py-2 text-xs text-white/60 rounded-full hover:bg-white/10 transition-colors cursor-pointer">
                            <Tag size={12} /> {tag}
                        </span>
                    ))}
                </div>

                {/* Comments Section */}
                <div className="mt-20 border-t border-white/5 pt-16">
                    <h3 className="text-2xl font-logo uppercase tracking-wider text-white mb-10 flex items-center gap-4">
                        <MessageSquare size={24} className="text-[#C5A059]" /> Discussion
                    </h3>

                    {/* Comment Form */}
                    <div className="bg-white/5 border border-white/10 p-8 rounded-xl mb-16">
                        <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-6">Leave a Comment</h4>
                        <form onSubmit={handleCommentSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input
                                    placeholder="Name"
                                    required
                                    className="bg-black/20 border border-white/10 p-4 text-white rounded focus:border-[#C5A059] outline-none text-sm"
                                    value={commentForm.name}
                                    onChange={e => setCommentForm({ ...commentForm, name: e.target.value })}
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    required
                                    className="bg-black/20 border border-white/10 p-4 text-white rounded focus:border-[#C5A059] outline-none text-sm"
                                    value={commentForm.email}
                                    onChange={e => setCommentForm({ ...commentForm, email: e.target.value })}
                                />
                            </div>
                            <textarea
                                placeholder="Share your thoughts..."
                                required
                                rows={4}
                                className="w-full bg-black/20 border border-white/10 p-4 text-white rounded focus:border-[#C5A059] outline-none text-sm"
                                value={commentForm.message}
                                onChange={e => setCommentForm({ ...commentForm, message: e.target.value })}
                            />
                            <div className="flex items-center justify-between">
                                <button
                                    disabled={isSubmitting}
                                    className="bg-[#C5A059] text-black px-8 py-3 rounded text-xs font-bold uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Posting...' : <><Send size={14} /> Post Comment</>}
                                </button>
                                <AnimatePresence>
                                    {msg && (
                                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-500 text-xs font-bold uppercase tracking-wider">{msg}</motion.span>
                                    )}
                                </AnimatePresence>
                            </div>
                        </form>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-8">
                        {comments.length === 0 ? (
                            <p className="text-white/30 text-center italic">No comments yet. Be the first to start the conversation!</p>
                        ) : (
                            comments.map(comment => (
                                <div key={comment.id} className="border-l-2 border-[#C5A059]/30 pl-8 py-2">
                                    <div className="flex items-center gap-4 mb-2">
                                        <span className="text-white font-bold text-sm uppercase tracking-wider">{comment.name}</span>
                                        <span className="text-white/30 text-[10px] uppercase font-sans tracking-wide">{new Date(comment.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-white/60 text-sm leading-relaxed font-light">{comment.message}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </motion.div>
        </div>
    );
};

export default BlogPost;
