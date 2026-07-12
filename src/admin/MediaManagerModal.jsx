import React, { useState, useEffect } from 'react';
import { Upload, X, Check, Image as ImageIcon, Trash2 } from 'lucide-react';

export default function MediaManagerModal({ isOpen, onClose, onSelect }) {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const apiUrl = (import.meta.env.VITE_API_URL || 'https://api.adroitdesigns.in').replace(/\/api\/?$/, '');

    const fetchMedia = async () => {
        try {
            const token = localStorage.getItem('adroit_token');
            const res = await fetch(`${apiUrl}/api/lp-media`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setMedia(data.data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) fetchMedia();
    }, [isOpen]);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const token = localStorage.getItem('adroit_token');
            const apiUrl = (import.meta.env.VITE_API_URL || 'https://api.adroitdesigns.in').replace(/\/api\/?$/, '');
            const res = await fetch(`${apiUrl}/api/lp-media`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            if (res.ok) {
                fetchMedia();
            } else {
                alert("Upload failed.");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if(!window.confirm("Delete this image?")) return;
        try {
            const token = localStorage.getItem('adroit_token');
            await fetch(`${apiUrl}/api/lp-media/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchMedia();
        } catch (err) {
            console.error(err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#111] border border-white/10 rounded-xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl">
                
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-white/10">
                    <h3 className="text-white font-bold tracking-wider flex items-center gap-2"><ImageIcon size={18} className="text-[#C5A059]"/> Media Library</h3>
                    <div className="flex items-center gap-4">
                        <label className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded text-sm font-bold cursor-pointer flex items-center gap-2 transition-colors">
                            {uploading ? "Uploading..." : <><Upload size={14} /> Upload Image</>}
                            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
                        </label>
                        <button onClick={onClose} className="text-white/50 hover:text-white p-1"><X size={20}/></button>
                    </div>
                </div>

                {/* Grid */}
                <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
                    {loading ? (
                        <div className="text-center text-white/40 py-12">Loading media...</div>
                    ) : media.length === 0 ? (
                        <div className="text-center text-white/40 py-12 border-2 border-dashed border-white/10 rounded-lg">No images uploaded yet.</div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {media.map(m => (
                                <div key={m.id} className="group relative aspect-video bg-black rounded-lg overflow-hidden border border-white/10 hover:border-[#C5A059] cursor-pointer" onClick={() => onSelect(m.url.startsWith('http') ? m.url : `${apiUrl}${m.url}`)}>
                                    <img src={m.url.startsWith('http') ? m.url : `${apiUrl}${m.url}`} alt={m.filename} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                    
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="bg-[#C5A059] text-black px-3 py-1 rounded font-bold text-sm flex items-center gap-1">
                                            <Check size={14}/> Select
                                        </div>
                                    </div>
                                    <button onClick={(e) => handleDelete(e, m.id)} className="absolute top-2 right-2 bg-red-500/80 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500">
                                        <Trash2 size={14}/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
