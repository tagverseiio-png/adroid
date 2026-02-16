import React from 'react';
import { LayoutDashboard, FolderOpen, PenTool, MessageSquare, LogOut } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const AdminLayout = ({ children, currentPage, onNavigate, onLogout }) => {
    const MENU_ITEMS = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'projects', label: 'Projects', icon: FolderOpen },
        { id: 'blog', label: 'Blog Posts', icon: PenTool },
        { id: 'inquiries', label: 'Enquiries', icon: MessageSquare },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex text-stone-200 font-sans">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 fixed h-full bg-[#050505] z-20 hidden md:block">
                <div className="p-8 border-b border-white/10">
                    <h1 className="font-logo text-xl tracking-[0.2em] text-white">ADROIT <span className="text-[#C5A059]">ADMIN</span></h1>
                </div>
                <nav className="p-4 space-y-2 mt-4">
                    {MENU_ITEMS.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`flex items-center gap-4 p-4 cursor-pointer rounded-lg transition-all ${currentPage === item.id
                                ? 'bg-[#C5A059] text-black font-medium'
                                : 'text-white/50 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon size={18} />
                            <span className="text-sm tracking-wide uppercase">{item.label}</span>
                        </div>
                    ))}
                </nav>
                <div className="absolute bottom-0 w-full p-4 border-t border-white/10">
                    <div
                        onClick={onLogout}
                        className="flex items-center gap-4 p-4 cursor-pointer text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        <LogOut size={18} />
                        <span className="text-sm tracking-wide uppercase">Logout</span>
                    </div>
                </div>
            </aside>

            {/* Mobile Header (visible only on small screens) */}
            <div className="fixed top-0 w-full md:hidden bg-[#050505] border-b border-white/10 p-4 z-50 flex justify-between items-center">
                <h1 className="font-logo text-sm text-white">ADMIN</h1>
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-6 md:p-10 pt-20 md:pt-10 min-h-screen">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    key={currentPage}
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
};

export default AdminLayout;
