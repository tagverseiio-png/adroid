import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Copy, Eye, ExternalLink } from 'lucide-react';

export default function LandingPagesManager({ onNavigate }) {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPages = async () => {
        try {
            const token = localStorage.getItem('token');
            const apiUrl = (import.meta.env.VITE_API_URL || 'https://api.adroitdesigns.in').replace(/\/api\/?$/, '');
            const res = await fetch(`${apiUrl}/api/landing-pages`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setPages(data.data);
            }
        } catch (error) {
            console.error('Error fetching landing pages', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPages();
    }, []);

    const handleCreate = async () => {
        const name = prompt("Enter campaign name:");
        if (!name) return;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        
        try {
            const token = localStorage.getItem('token');
            const apiUrl = (import.meta.env.VITE_API_URL || 'https://api.adroitdesigns.in').replace(/\/api\/?$/, '');
            const res = await fetch(`${apiUrl}/api/landing-pages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ name, slug })
            });
            if (res.ok) {
                fetchPages();
            } else {
                const err = await res.json();
                alert(err.message || 'Error creating page');
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this page?")) return;
        try {
            const token = localStorage.getItem('token');
            const apiUrl = (import.meta.env.VITE_API_URL || 'https://api.adroitdesigns.in').replace(/\/api\/?$/, '');
            await fetch(`${apiUrl}/api/landing-pages/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchPages();
        } catch (e) {
            console.error(e);
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'published' ? 'draft' : 'published';
        try {
            const token = localStorage.getItem('token');
            const apiUrl = (import.meta.env.VITE_API_URL || 'https://api.adroitdesigns.in').replace(/\/api\/?$/, '');
            await fetch(`${apiUrl}/api/landing-pages/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status: newStatus })
            });
            fetchPages();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto pt-24">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2 font-logo tracking-wider">LANDING PAGES</h1>
                    <p className="text-white/60">Manage your standalone Google Ads campaigns</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-[#C5A059] text-black px-4 py-2 rounded-lg font-bold hover:bg-[#d4b472] transition-colors"
                >
                    <Plus size={18} /> New Campaign
                </button>
            </div>

            {loading ? (
                <div className="text-white/50 text-center py-10">Loading...</div>
            ) : (
                <div className="bg-[#080808] border border-white/10 rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="p-4 text-xs font-bold text-white/40 uppercase">Name</th>
                                <th className="p-4 text-xs font-bold text-white/40 uppercase">URL Slug</th>
                                <th className="p-4 text-xs font-bold text-white/40 uppercase">Status</th>
                                <th className="p-4 text-xs font-bold text-white/40 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {pages.map(p => (
                                <tr key={p.id} className="hover:bg-white/5">
                                    <td className="p-4 font-bold text-white">{p.name}</td>
                                    <td className="p-4 text-white/60 text-sm">/p/{p.slug}</td>
                                    <td className="p-4">
                                        <button 
                                            onClick={() => handleToggleStatus(p.id, p.status)}
                                            className={`text-xs px-2 py-1 rounded font-bold uppercase ${p.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/50'}`}
                                        >
                                            {p.status}
                                        </button>
                                    </td>
                                    <td className="p-4 flex gap-3 justify-end">
                                        <a href={`/p/${p.slug}`} target="_blank" rel="noreferrer" className="text-white/40 hover:text-white" title="Preview">
                                            <ExternalLink size={18} />
                                        </a>
                                        <button onClick={() => onNavigate(`lp-editor-${p.id}`)} className="text-white/40 hover:text-[#C5A059]" title="Edit">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(p.id)} className="text-white/40 hover:text-red-400" title="Delete">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {pages.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-white/40">No landing pages found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
