import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Users, Eye, Folder, FileText, Plus, PenTool, MessageSquare, TrendingUp } from 'lucide-react';
import { projectsAPI, blogAPI, inquiriesAPI, normalizeAssetUrl } from '../services/api';

const StatCard = ({ stat, idx }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.08 }}
        className="relative overflow-hidden bg-white/4 border border-white/8 rounded-2xl p-6 group hover:border-[#C5A059]/30 transition-all duration-300"
    >
        {/* Background glow */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#C5A059]/5 blur-2xl group-hover:bg-[#C5A059]/10 transition-all duration-500" />
        <div className="relative">
            <div className="flex justify-between items-start mb-5">
                <div className="p-2.5 bg-[#C5A059]/10 rounded-xl">
                    <stat.icon size={18} className="text-[#C5A059]" />
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${stat.positive ? 'text-emerald-400 bg-emerald-400/10' : 'text-sky-400 bg-sky-400/10'}`}>
                    <TrendingUp size={9} /> {stat.change}
                </span>
            </div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-4xl font-bold text-white">{stat.value}</p>
        </div>
    </motion.div>
);

const Dashboard = ({ onNavigate }) => {
    const [stats, setStats] = useState({ projects: 0, blogPosts: 0, inquiries: 0 });
    const [recentProjects, setRecentProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => { fetchDashboardData(); }, []);

    const fetchDashboardData = async () => {
        try {
            const [projectsResult, blogResult, inquiriesResult] = await Promise.allSettled([
                projectsAPI.getAll(),
                blogAPI.getAll(),
                inquiriesAPI.getAll(),
            ]);

            const projectsRes = projectsResult.status === 'fulfilled' ? projectsResult.value : { data: [] };
            const blogRes = blogResult.status === 'fulfilled' ? blogResult.value : { data: [] };
            const inquiriesRes = inquiriesResult.status === 'fulfilled' ? inquiriesResult.value : { data: { inquiries: [] } };

            const inquiryList = Array.isArray(inquiriesRes.data)
                ? inquiriesRes.data
                : (inquiriesRes.data?.inquiries || []);

            setStats({
                projects: projectsRes.data?.length || 0,
                blogPosts: blogRes.data?.length || 0,
                inquiries: inquiryList.length,
            });
            setRecentProjects(projectsRes.data?.slice(0, 6) || []);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const statsDisplay = [
        { label: 'Total Projects', value: stats.projects, icon: Folder, change: 'This month', positive: true },
        { label: 'Blog Posts', value: stats.blogPosts, icon: FileText, change: 'Published', positive: true },
        { label: 'Total Views', value: '12.5k', icon: Eye, change: '+15%', positive: true },
        { label: 'Active Enquiries', value: stats.inquiries, icon: Users, change: 'Pending', positive: false },
    ];

    const quickActions = [
        { label: 'Add Project', icon: Plus, page: 'projects', color: 'bg-[#C5A059] text-black hover:bg-amber-400' },
        { label: 'New Blog Post', icon: PenTool, page: 'blog', color: 'bg-white/8 text-white hover:bg-white/15 border border-white/10' },
        { label: 'View Enquiries', icon: MessageSquare, page: 'inquiries', color: 'bg-white/8 text-white hover:bg-white/15 border border-white/10' },
    ];

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
                    <p className="text-white/40 text-sm">Welcome back — here's an overview of your studio.</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    {quickActions.map((a) => (
                        <button
                            key={a.label}
                            onClick={() => onNavigate?.(a.page)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-200 ${a.color}`}
                        >
                            <a.icon size={13} /> {a.label}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-24">
                    <div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <>
                    {/* Stat Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                        {statsDisplay.map((stat, idx) => <StatCard key={idx} stat={stat} idx={idx} />)}
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Recent Projects */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-base font-bold text-white uppercase tracking-widest">Recent Projects</h2>
                                <button
                                    onClick={() => onNavigate?.('projects')}
                                    className="text-[#C5A059] text-xs flex items-center gap-1 hover:underline"
                                >
                                    View All <ArrowUpRight size={12} />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {recentProjects.map((project, idx) => (
                                    <motion.div
                                        key={project.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3 + idx * 0.07 }}
                                        className="group relative aspect-square rounded-xl overflow-hidden bg-white/5 cursor-pointer"
                                        onClick={() => onNavigate?.('projects')}
                                    >
                                        <img
                                            src={normalizeAssetUrl(project.cover_image) || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400'}
                                            alt={project.title}
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400'; }}
                                            onClick={(e) => {
                                                if (window.innerWidth < 1024 && e.currentTarget.classList.contains('grayscale')) {
                                                    e.currentTarget.classList.remove('grayscale');
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                }
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 flex flex-col justify-end">
                                            <p className="text-white text-xs font-bold leading-tight truncate">{project.title}</p>
                                            <p className="text-[#C5A059] text-[9px] uppercase tracking-wider truncate mt-0.5">{project.category}</p>
                                        </div>
                                        {project.published && (
                                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400" title="Published" />
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* System Status + Activity */}
                        <div className="space-y-4">
                            <h2 className="text-base font-bold text-white uppercase tracking-widest mb-5">System</h2>

                            {[
                                { label: 'API Status', note: 'Operational', color: 'bg-emerald-400' },
                                { label: 'Database', note: 'Connected', color: 'bg-sky-400' },
                                { label: 'File Storage', note: 'Active', color: 'bg-violet-400' },
                                { label: 'Auth Service', note: 'Running', color: 'bg-amber-400' },
                            ].map((s) => (
                                <div key={s.label} className="flex items-center gap-3 bg-white/4 border border-white/8 rounded-xl px-4 py-3">
                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.color}`} />
                                    <div className="min-w-0">
                                        <p className="text-white text-sm font-medium">{s.label}</p>
                                        <p className="text-white/30 text-xs">{s.note}</p>
                                    </div>
                                </div>
                            ))}

                            <div className="bg-[#C5A059]/8 border border-[#C5A059]/20 rounded-xl p-4 mt-2">
                                <p className="text-[#C5A059] text-xs font-bold uppercase tracking-wider mb-1">Tip</p>
                                <p className="text-white/50 text-xs">Star ⭐ projects to feature them on the Home page's "Selected Works" section.</p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
