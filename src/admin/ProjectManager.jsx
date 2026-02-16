import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Star, Upload, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { projectsAPI, uploadAPI, getApiOrigin } from '../services/api';

const ProjectManager = () => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [selectedProject, setSelectedProject] = useState(null);
    const [showQuickEdit, setShowQuickEdit] = useState(false);

    const categories = ['Architecture', 'Interior Design', 'Landscape', 'Urban Planning', 'Commercial', 'Residential', 'Mixed Use'];

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await projectsAPI.getAll();
            if (response.success) {
                setProjects(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await projectsAPI.delete(id);
                setProjects(projects.filter(p => p.id !== id));
            } catch (error) {
                console.error('Failed to delete project:', error);
                alert('Failed to delete project');
            }
        }
    };

    const toggleFeatured = async (project) => {
        try {
            const newFeaturedStatus = !project.is_featured;
            await projectsAPI.toggleFeatured(project.id, newFeaturedStatus, project.featured_order || 0);
            setProjects(projects.map(p => 
                p.id === project.id 
                    ? { ...p, is_featured: newFeaturedStatus } 
                    : p
            ));
        } catch (error) {
            console.error('Failed to toggle featured status:', error);
            alert('Failed to update featured status');
        }
    };

    const startEdit = (project) => {
        setEditingId(project.id);
        setEditForm({ ...project });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

    const saveEdit = async () => {
        try {
            await projectsAPI.update(editingId, editForm);
            setProjects(projects.map(p => p.id === editingId ? editForm : p));
            setEditingId(null);
        } catch (error) {
            console.error('Failed to update project:', error);
            alert('Failed to update project');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditForm({ ...editForm, [name]: value });
    };

    const [isAdding, setIsAdding] = useState(false);
    const [newProject, setNewProject] = useState({
        title: '',
        category: '',
        type: 'ARCHITECTURE',
        location: '',
        year: new Date().getFullYear().toString(),
        area: '',
        client: '',
        design_style: '',
        description: '',
        cover_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1400',
        published: true
    });

    const [isUploading, setIsUploading] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            alert('Image size must be less than 10MB');
            return;
        }

        setIsUploading(true);
        try {
            const response = await uploadAPI.uploadImage(file, 'projects');
            if (response.success) {
                const apiOrigin = getApiOrigin() || window.location.origin;
                const imageUrl = `${apiOrigin}${response.data.path}`;
                setUploadedImage(imageUrl);
                setNewProject({ ...newProject, cover_image: imageUrl });
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    const handleAddProject = async () => {
        if (!newProject.title || !newProject.category) {
            alert('Please fill in required fields');
            return;
        }
        try {
            const response = await projectsAPI.create(newProject);
            if (response.success) {
                setProjects([...projects, response.data]);
                setIsAdding(false);
                setUploadedImage(null);
                setNewProject({ title: '', category: '', type: 'ARCHITECTURE', location: '', year: new Date().getFullYear().toString(), area: '', client: '', design_style: '', description: '', cover_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1400', published: true });
            }
        } catch (error) {
            console.error('Failed to create project:', error);
            alert('Failed to create project');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-serif text-white mb-2">Manage Projects</h2>
                    <p className="text-white/40 text-sm">Add, edit, or remove portfolio projects.</p>
                </div>
                {isLoading ? (
                    <div className="text-center text-white/40 py-12">Loading projects...</div>
                ) : !isAdding && (
                    <button onClick={() => setIsAdding(true)} className="bg-[#C5A059] text-black px-6 py-3 rounded text-sm font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2">
                        <Plus size={16} /> Add Project
                    </button>
                )}
            </div>

            {isAdding && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-white/5 border border-white/10 p-8 rounded-xl mb-8"
                >
                    <h3 className="text-xl text-white mb-6">Create New Project</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <input
                            placeholder="Project Title *"
                            className="bg-black/20 border border-white/10 p-4 text-white rounded focus:border-[#C5A059] outline-none"
                            value={newProject.title}
                            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        />
                        <select
                            className="bg-black/20 border border-white/10 p-4 text-white rounded focus:border-[#C5A059] outline-none"
                            value={newProject.category}
                            onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                        >
                            <option value="">Select Category *</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <select
                            className="bg-black/20 border border-white/10 p-4 text-white rounded focus:border-[#C5A059] outline-none"
                            value={newProject.type}
                            onChange={(e) => setNewProject({ ...newProject, type: e.target.value })}
                        >
                            <option value="ARCHITECTURE">Architecture</option>
                            <option value="INTERIOR">Interior Design</option>
                        </select>
                        <input
                            placeholder="Location"
                            className="bg-black/20 border border-white/10 p-4 text-white rounded focus:border-[#C5A059] outline-none"
                            value={newProject.location}
                            onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
                        />
                        <input
                            placeholder="Year"
                            className="bg-black/20 border border-white/10 p-4 text-white rounded focus:border-[#C5A059] outline-none"
                            value={newProject.year}
                            onChange={(e) => setNewProject({ ...newProject, year: e.target.value })}
                        />
                        <input
                            placeholder="Area"
                            className="bg-black/20 border border-white/10 p-4 text-white rounded focus:border-[#C5A059] outline-none"
                            value={newProject.area}
                            onChange={(e) => setNewProject({ ...newProject, area: e.target.value })}
                        />
                        <input
                            placeholder="Client"
                            className="bg-black/20 border border-white/10 p-4 text-white rounded focus:border-[#C5A059] outline-none"
                            value={newProject.client}
                            onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                        />
                        <input
                            placeholder="Status (e.g. Completed, In Progress)"
                            className="bg-black/20 border border-white/10 p-4 text-white rounded focus:border-[#C5A059] outline-none"
                            value={newProject.status || ''}
                            onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                        />
                        <input
                            placeholder="Design Style"
                            className="bg-black/20 border border-white/10 p-4 text-white rounded focus:border-[#C5A059] outline-none"
                            value={newProject.design_style}
                            onChange={(e) => setNewProject({ ...newProject, design_style: e.target.value })}
                        />
                    </div>
                    
                    {/* Image Upload Section */}
                    <div className="mb-6 border border-white/10 rounded-lg p-6 bg-black/20">
                        <h4 className="text-white text-sm font-bold mb-4 uppercase tracking-wider">Cover Image</h4>
                        
                        <div className="flex gap-4 mb-4">
                            <label className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="image-upload"
                                    disabled={isUploading}
                                />
                                <div className="bg-[#C5A059] text-black px-6 py-3 rounded text-sm font-bold uppercase tracking-widest hover:bg-white transition-colors cursor-pointer flex items-center justify-center gap-2">
                                    {isUploading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                            <span>Uploading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={16} />
                                            <span>Upload Image</span>
                                        </>
                                    )}
                                </div>
                            </label>
                        </div>

                        <div className="text-white/40 text-xs mb-4">
                            Or enter image URL manually:
                        </div>
                        
                        <input
                            placeholder="Cover Image URL (optional)"
                            className="bg-black/20 border border-white/10 p-4 text-white rounded focus:border-[#C5A059] outline-none w-full"
                            value={newProject.cover_image}
                            onChange={(e) => setNewProject({ ...newProject, cover_image: e.target.value })}
                        />
                    </div>

                    <div className="mb-6">
                        {newProject.cover_image && (
                            <div className="w-full h-48 bg-white/10 rounded overflow-hidden mb-4 relative group">
                                <img 
                                    src={newProject.cover_image} 
                                    alt="Cover preview" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400'}
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <ImageIcon className="text-white" size={32} />
                                </div>
                            </div>
                        )}
                    </div>
                    <textarea
                        placeholder="Project Description"
                        rows={4}
                        className="w-full bg-black/20 border border-white/10 p-4 text-white rounded focus:border-[#C5A059] outline-none mb-6"
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    />
                    <textarea
                        placeholder="Key Highlights (comma-separated, e.g. Innovation, Sustainability, Modern Design)"
                        rows={2}
                        className="w-full bg-black/20 border border-white/10 p-4 text-white rounded focus:border-[#C5A059] outline-none mb-6"
                        value={typeof newProject.highlights === 'string' ? newProject.highlights : (Array.isArray(newProject.highlights) ? newProject.highlights.join(', ') : '')}
                        onChange={(e) => setNewProject({ ...newProject, highlights: e.target.value.split(',').map(h => h.trim()).filter(h => h) })}
                    />
                    <textarea
                        placeholder="Scope (comma-separated, e.g. Architecture, Interior Design, Project Management)"
                        rows={2}
                        className="w-full bg-black/20 border border-white/10 p-4 text-white rounded focus:border-[#C5A059] outline-none mb-6"
                        value={typeof newProject.scope === 'string' ? newProject.scope : (Array.isArray(newProject.scope) ? newProject.scope.join(', ') : '')}
                        onChange={(e) => setNewProject({ ...newProject, scope: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
                    />
                    <div className="flex gap-4">
                        <button onClick={handleAddProject} className="bg-green-500 text-white px-6 py-2 rounded font-bold uppercase text-xs hover:bg-green-600">Create</button>
                        <button onClick={() => setIsAdding(false)} className="bg-white/10 text-white px-6 py-2 rounded font-bold uppercase text-xs hover:bg-white/20">Cancel</button>
                    </div>
                </motion.div>
            )}

            {/* Quick Project Selector */}
            {!isAdding && projects.length > 0 && (
                <div className="mb-8 bg-white/5 border border-white/10 rounded-xl p-6">
                    <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-4">Quick Select Project</h3>
                    <div className="flex gap-3 items-center flex-wrap">
                        <select
                            value={selectedProject?.id || ''}
                            onChange={(e) => {
                                const proj = projects.find(p => p.id === parseInt(e.target.value));
                                setSelectedProject(proj);
                                if (proj) setShowQuickEdit(true);
                            }}
                            className="bg-black/20 border border-white/10 p-3 text-white rounded focus:border-[#C5A059] outline-none flex-1 min-w-[250px]"
                        >
                            <option value="">Select a project to edit...</option>
                            {projects.map(proj => (
                                <option key={proj.id} value={proj.id}>
                                    {proj.title} - {proj.category}
                                </option>
                            ))}
                        </select>
                        {selectedProject && showQuickEdit && (
                            <button
                                onClick={() => {
                                    setShowQuickEdit(false);
                                    setSelectedProject(null);
                                }}
                                className="bg-white/10 text-white px-4 py-3 rounded text-sm font-bold hover:bg-white/20 transition-colors"
                            >
                                Clear Selection
                            </button>
                        )}
                    </div>

                    {/* Quick Edit Panel */}
                    {selectedProject && showQuickEdit && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-6 pt-6 border-t border-white/10"
                        >
                            <h4 className="text-white text-lg mb-4 font-semibold">Edit: {selectedProject.title}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-white/60 text-xs uppercase tracking-wider block mb-2">Project Title</label>
                                    <input
                                        value={selectedProject.title}
                                        onChange={(e) => setSelectedProject({ ...selectedProject, title: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 p-3 text-white rounded focus:border-[#C5A059] outline-none text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-white/60 text-xs uppercase tracking-wider block mb-2">Category</label>
                                    <select
                                        value={selectedProject.category}
                                        onChange={(e) => setSelectedProject({ ...selectedProject, category: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 p-3 text-white rounded focus:border-[#C5A059] outline-none text-sm"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-white/60 text-xs uppercase tracking-wider block mb-2">Location</label>
                                    <input
                                        value={selectedProject.location || ''}
                                        onChange={(e) => setSelectedProject({ ...selectedProject, location: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 p-3 text-white rounded focus:border-[#C5A059] outline-none text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-white/60 text-xs uppercase tracking-wider block mb-2">Year</label>
                                    <input
                                        value={selectedProject.year || ''}
                                        onChange={(e) => setSelectedProject({ ...selectedProject, year: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 p-3 text-white rounded focus:border-[#C5A059] outline-none text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-white/60 text-xs uppercase tracking-wider block mb-2">Area</label>
                                    <input
                                        value={selectedProject.area || ''}
                                        onChange={(e) => setSelectedProject({ ...selectedProject, area: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 p-3 text-white rounded focus:border-[#C5A059] outline-none text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-white/60 text-xs uppercase tracking-wider block mb-2">Client</label>
                                    <input
                                        value={selectedProject.client || ''}
                                        onChange={(e) => setSelectedProject({ ...selectedProject, client: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 p-3 text-white rounded focus:border-[#C5A059] outline-none text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-white/60 text-xs uppercase tracking-wider block mb-2">Status</label>
                                    <input
                                        value={selectedProject.status || ''}
                                        onChange={(e) => setSelectedProject({ ...selectedProject, status: e.target.value })}
                                        placeholder="e.g. Completed, In Progress"
                                        className="w-full bg-black/20 border border-white/10 p-3 text-white rounded focus:border-[#C5A059] outline-none text-sm"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-white/60 text-xs uppercase tracking-wider block mb-2">Design Style</label>
                                    <input
                                        value={selectedProject.design_style || ''}
                                        onChange={(e) => setSelectedProject({ ...selectedProject, design_style: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 p-3 text-white rounded focus:border-[#C5A059] outline-none text-sm"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-white/60 text-xs uppercase tracking-wider block mb-2">Description</label>
                                    <textarea
                                        value={selectedProject.description || ''}
                                        onChange={(e) => setSelectedProject({ ...selectedProject, description: e.target.value })}
                                        rows={3}
                                        className="w-full bg-black/20 border border-white/10 p-3 text-white rounded focus:border-[#C5A059] outline-none text-sm"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-white/60 text-xs uppercase tracking-wider block mb-2">Key Highlights (comma-separated)</label>
                                    <textarea
                                        value={typeof selectedProject.highlights === 'string' ? selectedProject.highlights : (Array.isArray(selectedProject.highlights) ? selectedProject.highlights.join(', ') : '')}
                                        onChange={(e) => setSelectedProject({ ...selectedProject, highlights: e.target.value.split(',').map(h => h.trim()).filter(h => h) })}
                                        rows={2}
                                        placeholder="e.g. Innovation, Sustainability, Modern Design"
                                        className="w-full bg-black/20 border border-white/10 p-3 text-white rounded focus:border-[#C5A059] outline-none text-sm"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-white/60 text-xs uppercase tracking-wider block mb-2">Scope (comma-separated)</label>
                                    <textarea
                                        value={typeof selectedProject.scope === 'string' ? selectedProject.scope : (Array.isArray(selectedProject.scope) ? selectedProject.scope.join(', ') : '')}
                                        onChange={(e) => setSelectedProject({ ...selectedProject, scope: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
                                        rows={2}
                                        placeholder="e.g. Architecture, Interior Design, Project Management"
                                        className="w-full bg-black/20 border border-white/10 p-3 text-white rounded focus:border-[#C5A059] outline-none text-sm"
                                    />
                                </div>
                                <div className="md:col-span-2 grid grid-cols-2 gap-4 pt-2 border-t border-white/10">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedProject.published || false}
                                            onChange={(e) => setSelectedProject({ ...selectedProject, published: e.target.checked })}
                                            className="w-4 h-4 rounded border-white/20 bg-black/20"
                                        />
                                        <span className="text-white/80 text-sm font-semibold">Published</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedProject.is_featured || false}
                                            onChange={(e) => setSelectedProject({ ...selectedProject, is_featured: e.target.checked })}
                                            className="w-4 h-4 rounded border-white/20 bg-black/20"
                                        />
                                        <span className="text-white/80 text-sm font-semibold">Featured ⭐</span>
                                    </label>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={async () => {
                                        try {
                                            await projectsAPI.update(selectedProject.id, selectedProject);
                                            setProjects(projects.map(p => p.id === selectedProject.id ? selectedProject : p));
                                            setShowQuickEdit(false);
                                            setSelectedProject(null);
                                            alert('Project updated successfully!');
                                        } catch (error) {
                                            console.error('Failed to update:', error);
                                            alert('Failed to update project');
                                        }
                                    }}
                                    className="bg-green-500 text-white px-6 py-2 rounded text-sm font-bold uppercase hover:bg-green-600 transition-colors"
                                >
                                    <Save className="inline mr-2" size={14} />Save Changes
                                </button>
                                <button
                                    onClick={() => {
                                        setShowQuickEdit(false);
                                        setSelectedProject(null);
                                    }}
                                    className="bg-white/10 text-white px-6 py-2 rounded text-sm font-bold uppercase hover:bg-white/20 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            )}

            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm text-white/60">
                    <thead className="text-xs uppercase text-white/30 border-b border-white/10 bg-white/5">
                        <tr>
                            <th className="p-6 font-medium tracking-wider">Image</th>
                            <th className="p-6 font-medium tracking-wider">Status</th>
                            <th className="p-6 font-medium tracking-wider">Featured</th>
                            <th className="p-6 font-medium tracking-wider">Project Name</th>
                            <th className="p-6 font-medium tracking-wider">Category</th>
                            <th className="p-6 font-medium tracking-wider">Location</th>
                            <th className="p-6 font-medium tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {projects.map(project => (
                            <tr key={project.id} className="group hover:bg-white/5 transition-colors">
                                <td className="p-6">
                                    <div className="w-12 h-12 bg-white/10 rounded overflow-hidden flex-shrink-0">
                                        <img 
                                            src={project.cover_image} 
                                            alt={project.title} 
                                            className="w-full h-full object-cover" 
                                            onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=100'}
                                        />
                                    </div>
                                </td>
                                <td className="p-6">
                                    <div className="flex flex-col gap-2">
                                        <span className={`text-xs font-semibold px-2 py-1 rounded w-fit ${project.published ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                            {project.published ? '✓ Published' : '○ Draft'}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <button
                                        onClick={() => toggleFeatured(project)}
                                        className="transition-all duration-200"
                                        title={project.is_featured ? 'Remove from Selected Works' : 'Add to Selected Works'}
                                    >
                                        <Star 
                                            size={20} 
                                            className={project.is_featured 
                                                ? 'fill-[#C5A059] text-[#C5A059]' 
                                                : 'text-white/20 hover:text-white/40'
                                            } 
                                        />
                                    </button>
                                </td>
                                <td className="p-6 font-medium text-white">
                                    {editingId === project.id ? (
                                        <input
                                            name="title"
                                            value={editForm.title}
                                            onChange={handleChange}
                                            className="bg-black/20 border border-white/20 rounded p-2 text-white w-full"
                                        />
                                    ) : (
                                        project.title
                                    )}
                                </td>
                                <td className="p-6">
                                    {editingId === project.id ? (
                                        <input
                                            name="category"
                                            value={editForm.category}
                                            onChange={handleChange}
                                            className="bg-black/20 border border-white/20 rounded p-2 text-white w-full"
                                        />
                                    ) : (
                                        project.category
                                    )}
                                </td>
                                <td className="p-6">
                                    {editingId === project.id ? (
                                        <input
                                            name="location"
                                            value={editForm.location}
                                            onChange={handleChange}
                                            className="bg-black/20 border border-white/20 rounded p-2 text-white w-full"
                                        />
                                    ) : (
                                        project.location
                                    )}
                                </td>
                                <td className="p-6 text-right">
                                    {editingId === project.id ? (
                                        <div className="flex justify-end gap-2">
                                            <button onClick={saveEdit} className="p-2 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors">
                                                <Save size={16} />
                                            </button>
                                            <button onClick={cancelEdit} className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-end gap-4 opacity-50 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => startEdit(project)} className="text-white hover:text-[#C5A059] transition-colors">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(project.id)} className="text-white hover:text-red-400 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProjectManager;
