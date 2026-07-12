import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, GripVertical, Eye, Image as ImageIcon, Plus, Trash2, FolderOpen } from 'lucide-react';
import MediaManagerModal from './MediaManagerModal';
import ProjectPickerModal from './ProjectPickerModal';

export default function LandingPageEditor({ pageId, onNavigate }) {
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Editor State
    const [selectedSection, setSelectedSection] = useState(null);
    const [mediaModalOpen, setMediaModalOpen] = useState(false);
    const [projectModalOpen, setProjectModalOpen] = useState(false);
    const [currentImageField, setCurrentImageField] = useState(null); // { section, key, index }

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const token = localStorage.getItem('token');
                const apiUrl = import.meta.env.VITE_API_URL || 'https://api.adroitdesigns.in';
                const res = await fetch(`${apiUrl}/api/landing-pages/admin/${pageId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setPage(data.data);
                    if (data.data.sections_order.length > 0) {
                        setSelectedSection(data.data.sections_order[0]);
                    }
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, [pageId]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const apiUrl = import.meta.env.VITE_API_URL || 'https://api.adroitdesigns.in';
            const res = await fetch(`${apiUrl}/api/landing-pages/${pageId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(page)
            });
            if (!res.ok) throw new Error("Save failed");
            alert("Changes saved successfully!");
        } catch (error) {
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    const updateSectionContent = (sectionKey, fieldKey, value) => {
        setPage(prev => ({
            ...prev,
            sections: {
                ...prev.sections,
                [sectionKey]: {
                    ...prev.sections[sectionKey],
                    content: {
                        ...prev.sections[sectionKey].content,
                        [fieldKey]: value
                    }
                }
            }
        }));
    };

    const toggleSectionVisibility = (sectionKey) => {
        setPage(prev => ({
            ...prev,
            sections: {
                ...prev.sections,
                [sectionKey]: {
                    ...prev.sections[sectionKey],
                    enabled: !prev.sections[sectionKey].enabled
                }
            }
        }));
    };

    const handleImageSelect = (url) => {
        if (currentImageField) {
            updateSectionContent(currentImageField.section, currentImageField.key, url);
        }
        setMediaModalOpen(false);
    };

    const handleProjectSelect = (project) => {
        const currentProjects = page.sections['portfolio']?.content?.featured_projects || [];
        // prevent duplicate
        if (!currentProjects.find(p => p.id === project.id)) {
            const newProject = {
                id: project.id,
                title: project.title,
                category: project.category,
                image: project.images?.[0] || ""
            };
            updateSectionContent('portfolio', 'featured_projects', [...currentProjects, newProject]);
        }
        setProjectModalOpen(false);
    };

    const removeProject = (index) => {
        const currentProjects = page.sections['portfolio']?.content?.featured_projects || [];
        const newArray = [...currentProjects];
        newArray.splice(index, 1);
        updateSectionContent('portfolio', 'featured_projects', newArray);
    };

    // Generic Array Handler (for FAQs, Process steps, etc.)
    const handleArrayChange = (sectionKey, fieldKey, index, subKey, value) => {
        const arr = [...(page.sections[sectionKey].content[fieldKey] || [])];
        arr[index] = { ...arr[index], [subKey]: value };
        updateSectionContent(sectionKey, fieldKey, arr);
    };
    
    const addArrayItem = (sectionKey, fieldKey, template) => {
        const arr = [...(page.sections[sectionKey].content[fieldKey] || [])];
        arr.push(template);
        updateSectionContent(sectionKey, fieldKey, arr);
    };

    const removeArrayItem = (sectionKey, fieldKey, index) => {
        const arr = [...(page.sections[sectionKey].content[fieldKey] || [])];
        arr.splice(index, 1);
        updateSectionContent(sectionKey, fieldKey, arr);
    };

    if (loading || !page) return <div className="p-10 text-center text-white/50 pt-24">Loading editor...</div>;

    const currentSectionConfig = page.sections[selectedSection];
    const currentContent = currentSectionConfig?.content || {};

    return (
        <div className="flex h-screen pt-16 bg-[#080808]">
            {/* Sidebar - Sections */}
            <div className="w-64 border-r border-white/10 flex flex-col bg-[#050505]">
                <div className="p-4 border-b border-white/10 flex items-center gap-3">
                    <button onClick={() => onNavigate('landing-pages')} className="text-white/40 hover:text-white transition-colors">
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <div className="text-xs text-white/40 font-bold uppercase tracking-wider">Editing Campaign</div>
                        <div className="text-white font-bold truncate w-40">{page.name}</div>
                    </div>
                </div>

                <div className="p-3 flex-1 overflow-y-auto">
                    <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-3 px-2">Page Sections</div>
                    {page.sections_order.map((key) => (
                        <div 
                            key={key} 
                            className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors border ${selectedSection === key ? 'bg-white/10 border-white/20 text-white' : 'border-transparent text-white/60 hover:bg-white/5'}`}
                            onClick={() => setSelectedSection(key)}
                        >
                            <div className="flex items-center gap-2">
                                <GripVertical size={14} className="opacity-0 group-hover:opacity-50" />
                                <span className="text-sm font-bold capitalize">{key.replace('_', ' ')}</span>
                            </div>
                            <button 
                                onClick={(e) => { e.stopPropagation(); toggleSectionVisibility(key); }}
                                className={`w-10 h-5 rounded-full relative transition-colors ${page.sections[key]?.enabled ? 'bg-green-500/20' : 'bg-white/10'}`}
                            >
                                <div className={`w-3 h-3 rounded-full absolute top-1 transition-all ${page.sections[key]?.enabled ? 'bg-green-400 right-1' : 'bg-white/40 left-1'}`} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-white/10 flex flex-col gap-2">
                    <a href={`/p/${page.slug}`} target="_blank" rel="noreferrer" className="w-full py-2 bg-white/5 text-white/80 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                        <Eye size={16}/> Live Preview
                    </a>
                    <button onClick={handleSave} disabled={saving} className="w-full py-2 bg-[#C5A059] text-black rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#d4b472] transition-colors">
                        <Save size={16}/> {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

            {/* Main Area - Form Editor */}
            <div className="flex-1 overflow-y-auto p-8 relative">
                {selectedSection && currentSectionConfig && (
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-white capitalize font-logo tracking-wider">{selectedSection.replace('_', ' ')} Content</h2>
                            {!currentSectionConfig.enabled && <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-bold uppercase tracking-widest">Section Hidden</span>}
                        </div>
                        
                        <div className="space-y-6 bg-white/5 p-6 rounded-xl border border-white/10">
                            {Object.entries(currentContent).map(([fieldKey, value]) => {
                                // If it's an image field
                                if (fieldKey.includes('image')) {
                                    return (
                                        <div key={fieldKey} className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-white/50 uppercase tracking-widest capitalize">{fieldKey.replace(/_/g, ' ')}</label>
                                            <div className="flex items-center gap-4">
                                                <div className="w-32 h-20 bg-black rounded border border-white/10 overflow-hidden">
                                                    {value ? <img src={value} className="w-full h-full object-cover"/> : <div className="w-full h-full flex justify-center items-center text-xs text-white/20">No Image</div>}
                                                </div>
                                                <button 
                                                    onClick={() => { setCurrentImageField({section: selectedSection, key: fieldKey}); setMediaModalOpen(true); }}
                                                    className="bg-white/10 px-3 py-2 rounded text-sm text-white hover:bg-white/20 flex items-center gap-2 transition-colors"
                                                >
                                                    <ImageIcon size={16}/> Browse Library
                                                </button>
                                            </div>
                                        </div>
                                    );
                                }

                                // If it's featured projects
                                if (fieldKey === 'featured_projects') {
                                    return (
                                        <div key={fieldKey} className="flex flex-col gap-2 pt-4 border-t border-white/10 mt-4">
                                            <label className="text-xs font-bold text-[#C5A059] uppercase tracking-widest flex items-center justify-between">
                                                Featured Portfolio Projects
                                                <button onClick={() => setProjectModalOpen(true)} className="flex items-center gap-1 text-white bg-white/10 px-2 py-1 rounded hover:bg-white/20 transition-colors"><Plus size={14}/> Add Project</button>
                                            </label>
                                            <div className="space-y-2 mt-2">
                                                {value.map((proj, idx) => (
                                                    <div key={idx} className="flex items-center justify-between bg-black p-2 rounded border border-white/5">
                                                        <div className="flex items-center gap-3">
                                                            <img src={proj.image || "https://via.placeholder.com/100"} className="w-12 h-10 object-cover rounded"/>
                                                            <div>
                                                                <div className="text-sm text-white font-bold">{proj.title}</div>
                                                                <div className="text-xs text-white/40">{proj.category}</div>
                                                            </div>
                                                        </div>
                                                        <button onClick={() => removeProject(idx)} className="text-white/30 hover:text-red-400 p-2"><Trash2 size={16}/></button>
                                                    </div>
                                                ))}
                                                {value.length === 0 && <div className="text-sm text-white/40 italic">No projects selected. Click Add Project to browse.</div>}
                                            </div>
                                        </div>
                                    );
                                }

                                // If it's a generic array (like FAQ items, Process steps)
                                if (Array.isArray(value)) {
                                    return (
                                        <div key={fieldKey} className="flex flex-col gap-4 pt-4 border-t border-white/10 mt-4">
                                            <label className="text-xs font-bold text-[#C5A059] uppercase tracking-widest flex items-center justify-between">
                                                {fieldKey.replace(/_/g, ' ')}
                                                <button onClick={() => addArrayItem(selectedSection, fieldKey, Object.keys(value[0] || {title:'', desc:''}).reduce((a,v)=>({...a, [v]:''}), {}))} className="flex items-center gap-1 text-white bg-white/10 px-2 py-1 rounded hover:bg-white/20 transition-colors"><Plus size={14}/> Add Item</button>
                                            </label>
                                            
                                            {value.map((item, index) => (
                                                <div key={index} className="bg-black p-4 rounded-lg border border-white/5 relative group">
                                                    <button onClick={() => removeArrayItem(selectedSection, fieldKey, index)} className="absolute top-2 right-2 text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                                                    <div className="space-y-3 pt-2">
                                                        {Object.keys(item).map(subKey => (
                                                            <div key={subKey}>
                                                                <div className="text-[10px] text-white/40 uppercase font-bold mb-1">{subKey}</div>
                                                                {subKey === 'desc' || subKey === 'answer' || subKey === 'body' || item[subKey].length > 50 ? (
                                                                    <textarea 
                                                                        className="w-full bg-white/5 border border-white/10 rounded-md p-2 text-sm text-white outline-none focus:border-[#C5A059]"
                                                                        rows="2"
                                                                        value={item[subKey]}
                                                                        onChange={(e) => handleArrayChange(selectedSection, fieldKey, index, subKey, e.target.value)}
                                                                    />
                                                                ) : (
                                                                    <input 
                                                                        type="text"
                                                                        className="w-full bg-white/5 border border-white/10 rounded-md p-2 text-sm text-white outline-none focus:border-[#C5A059]"
                                                                        value={item[subKey]}
                                                                        onChange={(e) => handleArrayChange(selectedSection, fieldKey, index, subKey, e.target.value)}
                                                                    />
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                }

                                // If it's a long string (body, sub_headline)
                                if (typeof value === 'string' && (fieldKey.includes('body') || fieldKey.includes('headline') || value.length > 50)) {
                                    return (
                                        <div key={fieldKey} className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-white/50 uppercase tracking-widest capitalize">{fieldKey.replace(/_/g, ' ')}</label>
                                            <textarea 
                                                className="w-full bg-black/50 border border-white/10 rounded-md p-3 text-sm text-white outline-none focus:border-[#C5A059] font-mono leading-relaxed"
                                                rows="4"
                                                value={value}
                                                onChange={(e) => updateSectionContent(selectedSection, fieldKey, e.target.value)}
                                            />
                                            <div className="text-[10px] text-white/30 italic">Supports basic HTML tags like &lt;br/&gt; &lt;em&gt; &lt;strong&gt;</div>
                                        </div>
                                    );
                                }

                                // Default string input
                                if (typeof value === 'string') {
                                    return (
                                        <div key={fieldKey} className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-white/50 uppercase tracking-widest capitalize">{fieldKey.replace(/_/g, ' ')}</label>
                                            <input 
                                                type="text"
                                                className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-sm text-white outline-none focus:border-[#C5A059]"
                                                value={value}
                                                onChange={(e) => updateSectionContent(selectedSection, fieldKey, e.target.value)}
                                            />
                                        </div>
                                    );
                                }

                                return null;
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <MediaManagerModal isOpen={mediaModalOpen} onClose={() => setMediaModalOpen(false)} onSelect={handleImageSelect} />
            <ProjectPickerModal isOpen={projectModalOpen} onClose={() => setProjectModalOpen(false)} onSelect={handleProjectSelect} />
        </div>
    );
}
