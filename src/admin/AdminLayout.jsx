import React, { useState } from 'react';
import { LayoutDashboard, FolderOpen, PenTool, MessageSquare, LogOut, Menu, X, ShoppingBag, Package, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MENU_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'blog', label: 'Blog', icon: PenTool },
    { id: 'inquiries', label: 'Enquiries', icon: MessageSquare },
    { id: 'divider-shop', label: null, icon: null }, // visual divider
    { id: 'shop-products', label: 'Products', icon: ShoppingBag },
    { id: 'shop-orders', label: 'Orders', icon: Package },
];

const AdminLayout = ({ children, currentPage, onNavigate, onLogout }) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleNav = (id) => {
        onNavigate(id);
        setMobileOpen(false);
    };

    return (
        <div className="min-h-screen bg-[#0c0c0c] text-stone-200 font-sans">

            {/* ── Top Bar ── */}
            <header className="fixed top-0 inset-x-0 z-50 bg-[#080808]/95 backdrop-blur-md border-b border-white/8">
                <div className="max-w-screen-2xl mx-auto flex items-center justify-between px-6 h-16">

                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-[#C5A059] rounded-sm flex items-center justify-center">
                            <span className="text-black font-bold text-xs">A</span>
                        </div>
                        <span className="font-logo tracking-[0.2em] text-white text-sm hidden sm:block">
                            ADROIT
                        </span>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {MENU_ITEMS.map((item) => {
                            if (!item.label) return <div key={item.id} className="w-px h-5 bg-white/10 mx-1" />;
                            const active = currentPage === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleNav(item.id)}
                                    className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-200 ${active
                                        ? 'text-black bg-[#C5A059]'
                                        : 'text-white/50 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <item.icon size={14} />
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Right Side */}
                    <div className="flex items-center gap-3">
                        {/* Admin badge */}
                        <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                            <span className="text-white/60 text-xs">Admin</span>
                        </div>

                        {/* Logout */}
                        <button
                            onClick={onLogout}
                            className="hidden md:flex items-center gap-2 text-white/40 hover:text-red-400 transition-colors text-xs uppercase tracking-wider font-bold px-3 py-2 rounded-lg hover:bg-red-500/10"
                        >
                            <LogOut size={14} /> Logout
                        </button>

                        {/* Mobile Hamburger */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                        >
                            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="md:hidden border-t border-white/8 bg-[#080808] px-4 pb-4 pt-3 space-y-1"
                        >
                            {MENU_ITEMS.map((item) => {
                                if (!item.label) return <div key={item.id} className="border-t border-white/8 my-1" />;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => handleNav(item.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${currentPage === item.id
                                            ? 'bg-[#C5A059] text-black'
                                            : 'text-white/50 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <item.icon size={16} />
                                        {item.label}
                                    </button>
                                );
                            })}
                            <div className="border-t border-white/8 pt-3 mt-1">
                                <button
                                    onClick={onLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/10 transition-colors"
                                >
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* ── Content ── */}
            <main className="pt-20 min-h-screen">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
                    <motion.div
                        key={currentPage}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                    >
                        {children}
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
