import React, { useState, useEffect } from 'react';
import { Search, X, Check, FolderOpen } from 'lucide-react';

export default function ProjectPickerModal({ isOpen, onClose, onSelect }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!isOpen) return;
        const fetchProjects = async () => {
            try {
                const apiUrl = (import.meta.env.VITE_API_URL || 'https://api.adroitdesigns.in').replace(/\/api\/?$/, '');
                const res = await fetch(`${apiUrl}/api/projects`);
                if (res.ok) {
                    const data = await res.json();
                    setProjects(data.data || []);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, [isOpen]);

    if (!isOpen) return null;

    const filtered = projects.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || (p.category && p.category.toLowerCase().includes(search.toLowerCase())));

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#111] border border-white/10 rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
                
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-white/10">
                    <h3 className="text-white font-bold tracking-wider flex items-center gap-2"><FolderOpen size={18} className="text-[#C5A059]"/> Select Project</h3>
                    <button onClick={onClose} className="text-white/50 hover:text-white p-1"><X size={20}/></button>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-white/5">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                        <input 
                            type="text" 
                            placeholder="Search by title or category..." 
                            className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-lg pl-10 pr-4 py-2 outline-none focus:border-[#C5A059]"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* List */}
                <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
                    {loading ? (
                        <div className="text-center text-white/40 py-8">Loading projects...</div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center text-white/40 py-8">No projects found.</div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {filtered.map(p => (
                                <div key={p.id} onClick={() => onSelect(p)} className="flex items-center gap-4 p-2 rounded-lg hover:bg-white/5 cursor-pointer border border-transparent hover:border-white/10 transition-colors">
                                    <div className="w-16 h-12 bg-black rounded overflow-hidden flex-shrink-0 border border-white/10">
                                        {p.images && p.images[0] ? (
                                            <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover opacity-80" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">No Img</div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-white text-sm font-bold">{p.title}</div>
                                        <div className="text-white/50 text-xs">{p.category}</div>
                                    </div>
                                    <div className="pr-4 text-[#C5A059] opacity-0 hover:opacity-100"><Check size={18} /></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
