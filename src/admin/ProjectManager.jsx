import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Save, X, Star, Upload, Image as ImageIcon, Camera, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { projectsAPI, uploadAPI, getApiOrigin, normalizeAssetUrl } from '../services/api';

const PROJECT_CATEGORIES = [
    'VILLAS', 'APARTMENTS', 'IT & ITES OFFICES', 'COMMERCIAL OFFICES',
    'COMMERCIAL BUILDINGS', 'FACTORY & WAREHOUSE BUILDINGS', 'INSTITUTIONAL BUILDINGS',
    'BANQUET & MARRIAGE HALLS', 'LAND USE PLANNING & LAYOUTS', 'BUILDING LIFTING PROJECTS',
    'HOSPITALS', 'BANKS & INSTITUTIONS', 'RESIDENTIAL INTERIORS', 'LAB & CLEAN ROOMS',
    'INDUSTRIAL KITCHENS', 'RESTAURANTS', 'HOTELS & LODGES', 'SPA & GYMNASIUMS',
    'FACTORY OFFICES', 'CLUBS & RESTOBARS', 'SHOWROOMS & RETAIL OUTLETS', 'SUPERMARKETS',
];

// ─── Input helpers ────────────────────────────────────────────────────────────
const Field = ({ label, children }) => (
    <div>
        {label && <label className="text-white/50 text-[10px] uppercase tracking-widest block mb-1.5">{label}</label>}
        {children}
    </div>
);
const inp = "w-full bg-black/30 border border-white/10 p-3 text-white rounded-lg focus:border-[#C5A059] outline-none text-sm placeholder:text-white/20 transition-colors";

// ─── Image uploader ───────────────────────────────────────────────────────────
const ImageUploader = ({ onUpload, multiple = false, label = 'Upload' }) => {
    const [busy, setBusy] = useState(false);
    const ref = useRef();
    const handle = async (files) => {
        if (!files?.length) return;
        const origin = getApiOrigin() || window.location.origin;
        setBusy(true);
        try {
            if (multiple && files.length > 1) {
                const res = await uploadAPI.uploadMultiple(Array.from(files), 'projects');
                if (res.success) onUpload(res.data.map(i => `${origin}${i.path}`));
            } else {
                const f = files[0];
                if (!f.type.startsWith('image/')) { alert('Image files only'); return; }
                if (f.size > 12 * 1024 * 1024) { alert('Max 12 MB'); return; }
                const res = await uploadAPI.uploadImage(f, 'projects');
                if (res.success) onUpload([`${origin}${res.data.path}`]);
            }
        } catch { alert('Upload failed'); }
        finally { setBusy(false); }
    };
    return (
        <>
            <input ref={ref} type="file" accept="image/*" multiple={multiple} className="hidden" onChange={e => handle(e.target.files)} disabled={busy} />
            <button type="button" onClick={() => ref.current?.click()}
                className="flex items-center gap-1.5 bg-[#C5A059] text-black px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-amber-400 transition-colors disabled:opacity-60"
                disabled={busy}
            >
                {busy ? <><div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />Uploading…</> : <><Upload size={12} />{label}</>}
            </button>
        </>
    );
};

// ─── Image Gallery Manager ────────────────────────────────────────────────────
const ImageGallery = ({ images = [], onChange }) => {
    const list = Array.isArray(images) ? images : (images ? [images] : []);
    const remove = async (idx) => {
        const url = list[idx];
        // Try server delete (non-blocking)
        try {
            const path = url.replace(/^.*\/uploads\//, '/uploads/');
            if (path.startsWith('/uploads/')) await uploadAPI.deleteImage(path);
        } catch { /* ignore */ }
        onChange(list.filter((_, i) => i !== idx));
    };
    const moveUp = (idx) => {
        if (idx === 0) return;
        const a = [...list];
        [a[idx - 1], a[idx]] = [a[idx], a[idx - 1]];
        onChange(a);
    };
    return (
        <div>
            <div className="flex gap-2 mb-3 flex-wrap">
                <ImageUploader label="Add Image" onUpload={urls => onChange([...list, ...urls])} />
                <ImageUploader label="Add Multiple" multiple onUpload={urls => onChange([...list, ...urls])} />
            </div>
            {list.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
                    {list.map((url, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-white/5 group">
                            <img src={normalizeAssetUrl(url) || url} alt="" className="w-full h-full object-cover"
                                onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200'; }} />
                            {/* Always-visible delete */}
                            <button type="button" onClick={() => remove(idx)}
                                className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg z-10"
                                title="Delete image"
                            >
                                <X size={10} />
                            </button>
                            {idx > 0 && (
                                <button type="button" onClick={() => moveUp(idx)}
                                    className="absolute bottom-1 left-1 text-[9px] bg-black/70 text-white px-1.5 py-0.5 rounded hover:bg-black/90 transition-colors"
                                >↑</button>
                            )}
                            {idx === 0 && (
                                <div className="absolute bottom-1 left-1 text-[8px] bg-[#C5A059] text-black px-1.5 py-0.5 rounded font-bold">Cover</div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="border border-dashed border-white/10 rounded-lg p-6 text-center">
                    <ImageIcon size={20} className="mx-auto mb-2 text-white/20" />
                    <p className="text-white/25 text-xs">No images yet</p>
                </div>
            )}
        </div>
    );
};

// ─── Project Form (shared by Add + Edit) ─────────────────────────────────────
const ProjectForm = ({ data, setData, onSave, onCancel, saving, isEdit = false }) => {
    const imgs = (() => {
        const arr = Array.isArray(data.images) ? data.images : [];
        const c = data.cover_image;
        return c && !arr.includes(c) ? [c, ...arr] : arr;
    })();
    const setImgs = (urls) => setData(d => ({ ...d, cover_image: urls[0] || d.cover_image, images: urls }));

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Project Title *">
                    <input className={inp} placeholder="e.g. Prestige Tower" value={data.title || ''} onChange={e => setData(d => ({ ...d, title: e.target.value }))} />
                </Field>
                <Field label="Category *">
                    <select className={inp} value={data.category || ''} onChange={e => setData(d => ({ ...d, category: e.target.value }))}>
                        <option value="">Select…</option>
                        {PROJECT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </Field>
                <Field label="Type">
                    <select className={inp} value={data.type || 'ARCHITECTURE'} onChange={e => setData(d => ({ ...d, type: e.target.value }))}>
                        <option value="ARCHITECTURE">Architecture</option>
                        <option value="INTERIOR">Interior Design</option>
                    </select>
                </Field>
                <Field label="Location">
                    <input className={inp} placeholder="Chennai, India" value={data.location || ''} onChange={e => setData(d => ({ ...d, location: e.target.value }))} />
                </Field>
                <Field label="Year">
                    <input className={inp} placeholder="2024" value={data.year || ''} onChange={e => setData(d => ({ ...d, year: e.target.value }))} />
                </Field>
                <Field label="Area">
                    <input className={inp} placeholder="3500 sqft" value={data.area || ''} onChange={e => setData(d => ({ ...d, area: e.target.value }))} />
                </Field>
                <Field label="Client">
                    <input className={inp} placeholder="Client name" value={data.client || ''} onChange={e => setData(d => ({ ...d, client: e.target.value }))} />
                </Field>
                <Field label="Status">
                    <input className={inp} placeholder="Completed / In Progress" value={data.status || ''} onChange={e => setData(d => ({ ...d, status: e.target.value }))} />
                </Field>
                <Field label="Design Style">
                    <input className={inp} placeholder="Contemporary / Modern" value={data.design_style || ''} onChange={e => setData(d => ({ ...d, design_style: e.target.value }))} />
                </Field>
            </div>

            <Field label="Description">
                <textarea className={inp + ' resize-none'} rows={3} placeholder="Brief about this project…" value={data.description || ''} onChange={e => setData(d => ({ ...d, description: e.target.value }))} />
            </Field>
            <Field label="Key Highlights (comma-separated)">
                <textarea className={inp + ' resize-none'} rows={2} placeholder="Innovation, Sustainability, LEED Certified"
                    value={Array.isArray(data.highlights) ? data.highlights.join(', ') : (data.highlights || '')}
                    onChange={e => setData(d => ({ ...d, highlights: e.target.value.split(',').map(h => h.trim()).filter(Boolean) }))} />
            </Field>
            <Field label="Scope (comma-separated)">
                <textarea className={inp + ' resize-none'} rows={2} placeholder="Architecture, Interior Design, Landscaping"
                    value={Array.isArray(data.scope) ? data.scope.join(', ') : (data.scope || '')}
                    onChange={e => setData(d => ({ ...d, scope: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))} />
            </Field>

            {/* Images */}
            <div className="border border-white/8 rounded-xl p-4 bg-black/20">
                <div className="flex items-center gap-2 mb-3">
                    <Camera size={14} className="text-[#C5A059]" />
                    <span className="text-white text-xs font-bold uppercase tracking-widest">Project Images</span>
                    <span className="text-white/30 text-[10px] ml-1">· First = cover · Click ✕ to delete</span>
                </div>
                <ImageGallery images={imgs} onChange={setImgs} />
                <div className="mt-4 pt-3 border-t border-white/8">
                    <Field label="Or paste cover image URL">
                        <input className={inp} placeholder="https://…" value={data.cover_image || ''} onChange={e => setData(d => ({ ...d, cover_image: e.target.value }))} />
                    </Field>
                </div>
            </div>

            {/* Toggles */}
            <div className="flex gap-6 flex-wrap">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input type="checkbox" className="w-4 h-4 accent-[#C5A059] rounded"
                        checked={data.published || false} onChange={e => setData(d => ({ ...d, published: e.target.checked }))} />
                    <span className="text-white/70 text-sm font-medium">Published</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input type="checkbox" className="w-4 h-4 accent-[#C5A059] rounded"
                        checked={data.is_featured || false} onChange={e => setData(d => ({ ...d, is_featured: e.target.checked }))} />
                    <span className="text-white/70 text-sm font-medium">Featured ⭐ (Home page)</span>
                </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
                <button type="button" disabled={saving} onClick={onSave}
                    className="flex items-center gap-2 bg-[#C5A059] text-black px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-amber-400 transition-colors disabled:opacity-60"
                >
                    <Save size={13} /> {saving ? 'Saving…' : (isEdit ? 'Save Changes' : 'Create Project')}
                </button>
                <button type="button" onClick={onCancel}
                    className="flex items-center gap-2 bg-white/8 text-white/70 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white/15 transition-colors border border-white/10"
                >
                    <X size={13} /> Cancel
                </button>
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const emptyProject = {
    title: '', category: '', type: 'ARCHITECTURE', location: '',
    year: new Date().getFullYear().toString(), area: '', client: '',
    design_style: '', description: '', cover_image: '', images: [],
    published: true, is_featured: false,
};

const ProjectManager = () => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [panel, setPanel] = useState(null); // null | 'add' | project_object (for edit)
    const [formData, setFormData] = useState(emptyProject);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState('');
    const [filterCat, setFilterCat] = useState('ALL');

    useEffect(() => { fetchProjects(); }, []);

    const fetchProjects = async () => {
        try {
            const res = await projectsAPI.getAll();
            if (res.success) setProjects(res.data);
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
    };

    const openAdd = () => { setFormData({ ...emptyProject }); setPanel('add'); };
    const openEdit = (project) => {
        const imgs = Array.isArray(project.images) ? project.images.map(i => i.file_path || i) : [];
        const cover = project.cover_image;
        const merged = cover && !imgs.includes(cover) ? [cover, ...imgs] : imgs;
        setFormData({ ...project, images: merged });
        setPanel(project);
    };
    const closePanel = () => setPanel(null);

    const handleSave = async () => {
        if (!formData.title || !formData.category) { alert('Title and Category are required'); return; }
        setSaving(true);
        try {
            const payload = {
                ...formData,
                cover_image: formData.images?.[0] || formData.cover_image || '',
            };
            if (panel === 'add') {
                const res = await projectsAPI.create(payload);
                if (res.success) { setProjects(p => [res.data, ...p]); closePanel(); }
            } else {
                await projectsAPI.update(panel.id, payload);
                setProjects(p => p.map(x => x.id === panel.id ? { ...x, ...payload } : x));
                closePanel();
            }
        } catch { alert('Failed to save project'); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this project?')) return;
        try { await projectsAPI.delete(id); setProjects(p => p.filter(x => x.id !== id)); }
        catch { alert('Delete failed'); }
    };

    const toggleFeatured = async (project) => {
        try {
            const next = !project.is_featured;
            await projectsAPI.toggleFeatured(project.id, next, project.featured_order || 0);
            setProjects(p => p.map(x => x.id === project.id ? { ...x, is_featured: next } : x));
        } catch { alert('Failed to update'); }
    };

    const togglePublish = async (project) => {
        try {
            await projectsAPI.update(project.id, { published: !project.published });
            setProjects(p => p.map(x => x.id === project.id ? { ...x, published: !x.published } : x));
        } catch { alert('Failed to update'); }
    };

    // Filter
    const cats = ['ALL', ...PROJECT_CATEGORIES];
    const filtered = projects.filter(p => {
        const matchCat = filterCat === 'ALL' || p.category === filterCat;
        const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Projects</h1>
                    <p className="text-white/40 text-sm">{projects.length} projects total · {projects.filter(p => p.published).length} published</p>
                </div>
                <button onClick={openAdd}
                    className="flex items-center gap-2 bg-[#C5A059] text-black px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-amber-400 transition-colors self-start sm:self-auto"
                >
                    <Plus size={14} /> Add Project
                </button>
            </div>

            {/* Search + Category Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <input
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/25 outline-none focus:border-[#C5A059] transition-colors flex-1"
                    placeholder="Search projects…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <select
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#C5A059] transition-colors"
                    value={filterCat}
                    onChange={e => setFilterCat(e.target.value)}
                >
                    {cats.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            {/* Project Card Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-24">
                    <div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-24 text-white/30">
                    <ImageIcon size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No projects found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filtered.map((project) => (
                        <motion.div
                            key={project.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="group bg-white/4 border border-white/8 rounded-2xl overflow-hidden hover:border-[#C5A059]/30 transition-all duration-300"
                        >
                            {/* Image */}
                            <div className="relative aspect-[4/3] bg-white/5">
                                <img
                                    src={normalizeAssetUrl(project.cover_image) || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400'}
                                    alt={project.title}
                                    className="w-full h-full object-cover"
                                    onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400'; }}
                                />
                                {/* Status badges */}
                                <div className="absolute top-2 left-2 flex gap-1">
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${project.published ? 'bg-emerald-500 text-white' : 'bg-gray-600 text-gray-300'}`}>
                                        {project.published ? 'Live' : 'Draft'}
                                    </span>
                                    {project.is_featured && (
                                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#C5A059] text-black">⭐ Featured</span>
                                    )}
                                </div>
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                                    <button onClick={() => openEdit(project)}
                                        className="flex items-center gap-1 bg-[#C5A059] text-black px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase hover:bg-amber-400 transition-colors"
                                    >
                                        <Edit2 size={11} /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(project.id)}
                                        className="flex items-center gap-1 bg-red-500/80 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase hover:bg-red-500 transition-colors"
                                    >
                                        <Trash2 size={11} /> Delete
                                    </button>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-4">
                                <h3 className="text-white text-sm font-bold leading-tight truncate mb-0.5">{project.title}</h3>
                                <p className="text-[#C5A059] text-[10px] uppercase tracking-wider truncate mb-3">{project.category}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-white/30 text-[10px]">{project.location || '—'} {project.year ? `· ${project.year}` : ''}</span>
                                    <div className="flex gap-1">
                                        {/* Publish toggle */}
                                        <button onClick={() => togglePublish(project)}
                                            title={project.published ? 'Unpublish' : 'Publish'}
                                            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-white"
                                        >
                                            {project.published ? <Eye size={13} /> : <EyeOff size={13} />}
                                        </button>
                                        {/* Featured toggle */}
                                        <button onClick={() => toggleFeatured(project)}
                                            title={project.is_featured ? 'Unfeature' : 'Feature on Home'}
                                            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                                        >
                                            <Star size={13} className={project.is_featured ? 'fill-[#C5A059] text-[#C5A059]' : 'text-white/30 hover:text-white/60'} />
                                        </button>
                                        {/* Quick edit */}
                                        <button onClick={() => openEdit(project)}
                                            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-white"
                                        >
                                            <ChevronRight size={13} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* ── Slide-in Edit / Add Panel ── */}
            <AnimatePresence>
                {panel && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
                            onClick={closePanel}
                        />
                        {/* Panel */}
                        <motion.div
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                            className="fixed top-0 right-0 h-full w-full max-w-xl bg-[#0e0e0e] border-l border-white/10 z-50 overflow-y-auto"
                        >
                            {/* Panel Header */}
                            <div className="sticky top-0 bg-[#0e0e0e]/95 backdrop-blur border-b border-white/8 px-6 py-4 flex items-center justify-between z-10">
                                <div>
                                    <h2 className="text-white font-bold text-base">
                                        {panel === 'add' ? 'New Project' : `Edit: ${panel.title}`}
                                    </h2>
                                    <p className="text-white/30 text-xs mt-0.5">
                                        {panel === 'add' ? 'Fill in details to create a new portfolio entry' : 'Update project details and images'}
                                    </p>
                                </div>
                                <button onClick={closePanel} className="p-2 text-white/40 hover:text-white hover:bg-white/8 rounded-lg transition-colors">
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Panel Body */}
                            <div className="p-6">
                                <ProjectForm
                                    data={formData}
                                    setData={setFormData}
                                    onSave={handleSave}
                                    onCancel={closePanel}
                                    saving={saving}
                                    isEdit={panel !== 'add'}
                                />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProjectManager;
