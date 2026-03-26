import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Star, Eye, EyeOff, Search, Loader2, X, Upload, Package } from 'lucide-react';
import { shopAPI, categoriesAPI, uploadAPI, normalizeAssetUrl } from '../../services/api';

const ARRANGE_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'name-asc', label: 'Name A-Z' },
    { value: 'name-desc', label: 'Name Z-A' },
    { value: 'price-asc', label: 'Price Low-High' },
    { value: 'price-desc', label: 'Price High-Low' },
    { value: 'stock-desc', label: 'Stock High-Low' },
    { value: 'featured-first', label: 'Featured First' },
];

const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [arrangeBy, setArrangeBy] = useState('newest');
    const [editProduct, setEditProduct] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploadingImg, setUploadingImg] = useState(false);

    const emptyForm = {
        name: '', sku: '', category_id: '', short_description: '', description: '',
        price: '', sale_price: '', stock_qty: '', weight_grams: '', cover_image: '',
        images: [], tags: '', published: false, featured: false,
        specifications: '',
    };
    const [form, setForm] = useState(emptyForm);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const [prodRes, catRes] = await Promise.all([shopAPI.getAdminAll({ limit: 200 }), categoriesAPI.getAll()]);
            if (prodRes.success) setProducts(prodRes.data);
            if (catRes.success) setCategories(catRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const set = (f) => (e) => setForm(v => ({ ...v, [f]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

    const openAdd = () => { setForm(emptyForm); setEditProduct(null); setShowForm(true); };
    const openEdit = (p) => {
        setForm({
            ...p,
            tags: (p.tags || []).join(', '),
            category_id: p.category_id || '',
            specifications: typeof p.specifications === 'object' ? JSON.stringify(p.specifications, null, 2) : (p.specifications || ''),
            images: p.images || [],
        });
        setEditProduct(p);
        setShowForm(true);
    };

    const handleCoverUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingImg(true);
        try {
            const res = await uploadAPI.uploadImage(file, 'shop');
            if (res.success && res.data?.path) {
                setForm(f => ({ ...f, cover_image: res.data.path }));
            } else {
                alert('Upload succeeded but no path was returned.');
            }
        } catch (err) { 
            console.error('Cover upload failed:', err);
            alert(`Upload failed: ${err.message || 'Server/Network Error'}`);
        }
        setUploadingImg(false);
    };

    const handleGalleryUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        setUploadingImg(true);
        try {
            const res = await uploadAPI.uploadMultiple(files, 'shop');
            if (res.success && Array.isArray(res.data)) {
                const paths = res.data.map(d => d.path).filter(Boolean);
                setForm(f => ({ ...f, images: [...(f.images || []), ...paths] }));
            }
        } catch (err) { 
            console.error('Gallery upload failed:', err);
            alert(`Gallery upload failed: ${err.message || 'Server/Network Error'}`);
        }
        setUploadingImg(false);
    };

    const handleSave = async () => {
        if (!form.name || !form.price) return;
        setSaving(true);
        try {
            let specs = {};
            try { specs = form.specifications ? JSON.parse(form.specifications) : {}; } catch { specs = {}; }
            const payload = {
                ...form,
                tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
                specifications: specs,
                price: parseFloat(form.price),
                sale_price: form.sale_price ? parseFloat(form.sale_price) : null,
                stock_qty: parseInt(form.stock_qty || 0),
                weight_grams: parseInt(form.weight_grams || 0),
                category_id: form.category_id || null,
            };
            if (editProduct) {
                await shopAPI.update(editProduct.id, payload);
            } else {
                await shopAPI.create(payload);
            }
            await fetchAll();
            setShowForm(false);
        } catch (err) { console.error(err); }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        await shopAPI.delete(id);
        setProducts(p => p.filter(x => x.id !== id));
    };

    const handleTogglePublish = async (id) => {
        await shopAPI.togglePublish(id);
        setProducts(p => p.map(x => x.id === id ? { ...x, published: !x.published } : x));
    };

    const handleToggleFeatured = async (id) => {
        await shopAPI.toggleFeatured(id);
        setProducts(p => p.map(x => x.id === id ? { ...x, featured: !x.featured } : x));
    };

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.sku || '').toLowerCase().includes(search.toLowerCase())
    );

    const arranged = [...filtered].sort((a, b) => {
        const priceA = parseFloat(a.sale_price || a.price || 0);
        const priceB = parseFloat(b.sale_price || b.price || 0);
        const stockA = Number.parseInt(a.stock_qty || 0, 10) || 0;
        const stockB = Number.parseInt(b.stock_qty || 0, 10) || 0;

        switch (arrangeBy) {
            case 'oldest':
                return (a.id || 0) - (b.id || 0);
            case 'name-asc':
                return (a.name || '').localeCompare(b.name || '');
            case 'name-desc':
                return (b.name || '').localeCompare(a.name || '');
            case 'price-asc':
                return priceA - priceB;
            case 'price-desc':
                return priceB - priceA;
            case 'stock-desc':
                return stockB - stockA;
            case 'featured-first':
                if ((a.featured ? 1 : 0) !== (b.featured ? 1 : 0)) {
                    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
                }
                return (b.id || 0) - (a.id || 0);
            case 'newest':
            default:
                return (b.id || 0) - (a.id || 0);
        }
    });

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Products</h1>
                    <p className="text-white/40 text-sm">{products.length} total products</p>
                </div>
                <button onClick={openAdd} className="flex items-center gap-2 bg-[#C5A059] hover:bg-amber-400 text-black px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
                    <Plus size={14} /> Add Product
                </button>
            </div>

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5 max-w-3xl">
                <div className="relative flex-1 min-w-[280px]">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
                        className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C5A059]/50" />
                </div>
                <select
                    value={arrangeBy}
                    onChange={e => setArrangeBy(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#C5A059]/50"
                >
                    {ARRANGE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
            </div>

            {/* Product Table */}
            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#C5A059]" size={28} /></div>
            ) : (
                <div className="rounded-2xl border border-white/8 overflow-hidden">
                    <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                        <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/8">
                                <th className="text-left px-4 py-3 text-white/40 text-xs uppercase tracking-widest font-bold">Product</th>
                                <th className="text-left px-4 py-3 text-white/40 text-xs uppercase tracking-widest font-bold hidden md:table-cell">Category</th>
                                <th className="text-left px-4 py-3 text-white/40 text-xs uppercase tracking-widest font-bold">Price</th>
                                <th className="text-left px-4 py-3 text-white/40 text-xs uppercase tracking-widest font-bold hidden sm:table-cell">Stock</th>
                                <th className="text-left px-4 py-3 text-white/40 text-xs uppercase tracking-widest font-bold">Status</th>
                                <th className="text-right px-4 py-3 text-white/40 text-xs uppercase tracking-widest font-bold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {arranged.length === 0 ? (
                                <tr><td colSpan={6} className="text-center text-white/30 py-12">No products found</td></tr>
                            ) : arranged.map(p => (
                                <tr key={p.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                                                {p.cover_image ? (
                                                    <img src={normalizeAssetUrl(p.cover_image)} alt="" className="w-full h-full object-cover" onError={e => { e.target.onerror = null; }} />
                                                ) : <Package size={16} className="m-auto mt-2.5 text-white/30" />}
                                            </div>
                                            <div>
                                                <p className="text-white font-bold text-sm line-clamp-1">{p.name}</p>
                                                <p className="text-white/30 text-xs">{p.sku}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-white/50 text-xs hidden md:table-cell">{p.category_name || '—'}</td>
                                    <td className="px-4 py-3">
                                        <p className="text-white font-bold">₹{parseFloat(p.sale_price || p.price).toLocaleString('en-IN')}</p>
                                        {p.sale_price && <p className="text-white/30 text-xs line-through">₹{parseFloat(p.price).toLocaleString('en-IN')}</p>}
                                    </td>
                                    <td className="px-4 py-3 text-white/60 text-sm hidden sm:table-cell">
                                        <span className={p.stock_qty === 0 ? 'text-red-400 font-bold' : p.stock_qty <= 5 ? 'text-amber-400 font-bold' : ''}>{p.stock_qty}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-1 flex-wrap">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.published ? 'bg-emerald-400/15 text-emerald-400' : 'bg-white/10 text-white/40'}`}>
                                                {p.published ? 'Live' : 'Draft'}
                                            </span>
                                            {p.featured && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C5A059]/20 text-[#C5A059]">Featured</span>}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => handleTogglePublish(p.id)} title={p.published ? 'Unpublish' : 'Publish'}
                                                className="p-1.5 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                                {p.published ? <EyeOff size={14} /> : <Eye size={14} />}
                                            </button>
                                            <button onClick={() => handleToggleFeatured(p.id)} title="Toggle Featured"
                                                className={`p-1.5 rounded-lg transition-colors ${p.featured ? 'text-[#C5A059]' : 'text-white/40 hover:text-[#C5A059]'} hover:bg-white/5`}>
                                                <Star size={14} />
                                            </button>
                                            <button onClick={() => openEdit(p)} className="p-1.5 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                                <Edit2 size={14} />
                                            </button>
                                            <button onClick={() => handleDelete(p.id)} className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

            {/* Add/Edit Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center p-4 overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl my-8 shadow-2xl"
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                            <h2 className="text-white font-bold">{editProduct ? 'Edit Product' : 'Add Product'}</h2>
                            <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white"><X size={20} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            {/* Name & SKU */}
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-white/50 text-xs uppercase tracking-wider block mb-1">Name *</label>
                                    <input value={form.name} onChange={set('name')} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C5A059]/50" />
                                </div>
                                <div>
                                    <label className="text-white/50 text-xs uppercase tracking-wider block mb-1">SKU</label>
                                    <input value={form.sku} onChange={set('sku')} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C5A059]/50" />
                                </div>
                            </div>

                            {/* Category */}
                            <div>
                                <label className="text-white/50 text-xs uppercase tracking-wider block mb-1">Category</label>
                                <select value={form.category_id} onChange={set('category_id')} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C5A059]/50">
                                    <option value="">— Select Category —</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            {/* Price */}
                            <div className="grid sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-white/50 text-xs uppercase tracking-wider block mb-1">Price (₹) *</label>
                                    <input type="number" value={form.price} onChange={set('price')} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C5A059]/50" />
                                </div>
                                <div>
                                    <label className="text-white/50 text-xs uppercase tracking-wider block mb-1">Sale Price (₹)</label>
                                    <input type="number" value={form.sale_price} onChange={set('sale_price')} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C5A059]/50" />
                                </div>
                                <div>
                                    <label className="text-white/50 text-xs uppercase tracking-wider block mb-1">Stock Qty</label>
                                    <input type="number" value={form.stock_qty} onChange={set('stock_qty')} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C5A059]/50" />
                                </div>
                            </div>

                            {/* Short Desc */}
                            <div>
                                <label className="text-white/50 text-xs uppercase tracking-wider block mb-1">Short Description</label>
                                <input value={form.short_description} onChange={set('short_description')} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C5A059]/50" />
                            </div>

                            {/* Full Desc */}
                            <div>
                                <label className="text-white/50 text-xs uppercase tracking-wider block mb-1">Full Description</label>
                                <textarea rows={3} value={form.description} onChange={set('description')} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C5A059]/50 resize-none" />
                            </div>

                            {/* Specs */}
                            <div>
                                <label className="text-white/50 text-xs uppercase tracking-wider block mb-1">Specifications (JSON)</label>
                                <textarea rows={3} value={form.specifications} onChange={set('specifications')} placeholder='{"Material": "Teak Wood", "Dimensions": "120x60x75 cm"}' className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C5A059]/50 resize-none font-mono" />
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="text-white/50 text-xs uppercase tracking-wider block mb-1">Tags (comma-separated)</label>
                                <input value={form.tags} onChange={set('tags')} placeholder="dining, wooden, modern" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C5A059]/50" />
                            </div>

                            {/* Cover Image Upload */}
                            <div>
                                <label className="text-white/50 text-xs uppercase tracking-wider block mb-1">Cover Image</label>
                                <div className="flex gap-3 items-start">
                                    {form.cover_image && (
                                        <img src={normalizeAssetUrl(form.cover_image)} alt="" className="w-16 h-16 rounded-xl object-cover border border-white/10" onError={e => { e.target.onerror = null; }} />
                                    )}
                                    <label className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:border-[#C5A059]/50 transition-colors text-sm text-white/60">
                                        {uploadingImg ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} Upload Cover
                                        <input type="file" accept="image/jpeg, image/png, image/webp" className="hidden" onChange={handleCoverUpload} />
                                    </label>
                                </div>
                            </div>

                            {/* Gallery Upload */}
                            <div>
                                <label className="text-white/50 text-xs uppercase tracking-wider block mb-1">Gallery Images</label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {(form.images || []).map((img, idx) => (
                                        <div key={idx} className="relative">
                                            <img src={normalizeAssetUrl(img)} alt="" className="w-14 h-14 rounded-lg object-cover border border-white/10" onError={e => { e.target.onerror = null; }} />
                                            <button onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))}
                                                className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                                <X size={10} className="text-white" />
                                            </button>
                                        </div>
                                    ))}
                                    <label className="w-14 h-14 flex items-center justify-center bg-white/5 border border-dashed border-white/20 rounded-lg cursor-pointer hover:border-[#C5A059]/50 transition-colors">
                                        <Plus size={18} className="text-white/30" />
                                        <input type="file" accept="image/jpeg, image/png, image/webp" multiple className="hidden" onChange={handleGalleryUpload} />
                                    </label>
                                </div>
                            </div>

                            {/* Toggles */}
                            <div className="flex gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={form.published} onChange={set('published')} className="w-4 h-4 rounded accent-[#C5A059]" />
                                    <span className="text-white/70 text-sm">Published</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={form.featured} onChange={set('featured')} className="w-4 h-4 rounded accent-[#C5A059]" />
                                    <span className="text-white/70 text-sm">Featured</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 px-6 pb-6">
                            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 text-white/40 hover:text-white text-sm font-bold transition-colors">Cancel</button>
                            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-[#C5A059] hover:bg-amber-400 disabled:bg-stone-600 text-black px-6 py-2.5 rounded-xl font-bold text-sm transition-all">
                                {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                                {saving ? 'Saving...' : 'Save Product'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ProductManager;
