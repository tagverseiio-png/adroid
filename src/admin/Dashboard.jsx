import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { ArrowUpRight, Users, Eye, Folder, FileText } from 'lucide-react';
import { projectsAPI, blogAPI, inquiriesAPI } from '../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        projects: 0,
        blogPosts: 0,
        inquiries: 0,
    });
    const [recentProjects, setRecentProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [projectsRes, blogRes, inquiriesRes] = await Promise.all([
                projectsAPI.getAll(),
                blogAPI.getAll(),
                inquiriesAPI.getAll(),
            ]);

            setStats({
                projects: projectsRes.data?.length || 0,
                blogPosts: blogRes.data?.length || 0,
                inquiries: inquiriesRes.data?.length || 0,
            });

            setRecentProjects(projectsRes.data?.slice(0, 5) || []);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const statsDisplay = [
        { label: 'Total Projects', value: stats.projects, icon: Folder, change: '+2 this month' },
        { label: 'Blog Posts', value: stats.blogPosts, icon: FileText, change: '+1 this week' },
        { label: 'Total Views', value: '12.5k', icon: Eye, change: '+15% vs last month' },
        { label: 'Active Inquiries', value: stats.inquiries, icon: Users, change: '3 new today' },
    ];

    return (
        <div>
            <h2 className="text-3xl font-serif text-white mb-2">Dashboard Overview</h2>
            <p className="text-white/40 mb-10 text-sm">Welcome back, Admin. Here's what's happening today.</p>

            {isLoading ? (
                <div className="text-center text-white/40 py-12">Loading dashboard...</div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {statsDisplay.map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-sm"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-white/5 rounded-lg text-[#C5A059]">
                                        <stat.icon size={20} />
                                    </div>
                                    <span className="text-[10px] text-green-400 bg-green-400/10 px-2 py-1 rounded-full flex items-center gap-1">
                                        {stat.change} <ArrowUpRight size={10} />
                                    </span>
                                </div>
                                <div className="mt-4">
                                    <p className="text-white/40 text-sm mb-2">{stat.label}</p>
                                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Projects Table */}
                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden p-6">
                    <h3 className="text-lg font-serif text-white mb-6">Recent Projects</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-white/60">
                            <thead className="text-xs uppercase text-white/30 border-b border-white/10">
                                <tr>
                                    <th className="pb-4 font-medium tracking-wider">Project Name</th>
                                    <th className="pb-4 font-medium tracking-wider">Category</th>
                                    <th className="pb-4 font-medium tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {recentProjects.map(project => (
                                    <tr key={project.id} className="group">
                                        <td className="py-4 text-white group-hover:text-[#C5A059] transition-colors">{project.title}</td>
                                        <td className="py-4">{project.category}</td>
                                        <td className="py-4"><span className="bg-green-500/10 text-green-400 px-2 py-1 rounded text-[10px] uppercase">Active</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions / Recent Activity */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-serif text-white mb-6">System Status</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/5">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <div>
                                <p className="text-white text-sm">System Operational</p>
                                <p className="text-white/30 text-xs">Last check: Just now</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/5">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <div>
                                <p className="text-white text-sm">Database Connected</p>
                                <p className="text-white/30 text-xs">Local Storage Sync Active</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </>
            )}
        </div>
    );
};

export default Dashboard;
