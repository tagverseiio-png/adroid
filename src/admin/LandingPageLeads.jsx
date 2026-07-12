import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Building, Calendar } from 'lucide-react';

export default function LandingPageLeads() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, new, contacted, closed

    const fetchLeads = async () => {
        try {
            const token = localStorage.getItem('token');
            const apiUrl = import.meta.env.VITE_API_URL || 'https://api.adroitdesigns.in';
            const res = await fetch(`${apiUrl}/api/lp-leads`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setLeads(data.data);
            }
        } catch (error) {
            console.error('Error fetching leads', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            const apiUrl = import.meta.env.VITE_API_URL || 'https://api.adroitdesigns.in';
            await fetch(`${apiUrl}/api/lp-leads/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status })
            });
            fetchLeads();
        } catch (e) {
            console.error(e);
        }
    };

    const filteredLeads = leads.filter(l => filter === 'all' ? true : l.status === filter);

    return (
        <div className="p-6 max-w-7xl mx-auto pt-24">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2 font-logo tracking-wider">CAMPAIGN LEADS</h1>
                    <p className="text-white/60">Leads generated from standalone Landing Pages</p>
                </div>
                
                <div className="flex gap-2 bg-[#080808] p-1 rounded-lg border border-white/10">
                    {['all', 'new', 'contacted', 'closed'].map(s => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase transition-colors ${filter === s ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80'}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="text-center text-white/40 py-10">Loading...</div>
            ) : (
                <div className="grid gap-4">
                    {filteredLeads.map(lead => (
                        <div key={lead.id} className="bg-[#080808] border border-white/10 rounded-xl p-5 flex flex-col md:flex-row gap-6 hover:border-white/20 transition-colors">
                            {/* Header Info */}
                            <div className="md:w-1/3 space-y-3">
                                <div>
                                    <h3 className="text-lg font-bold text-[#C5A059]">{lead.name}</h3>
                                    {lead.company && <div className="flex items-center gap-2 text-white/60 text-sm mt-1"><Building size={14} /> {lead.company}</div>}
                                </div>
                                <div className="space-y-2 pt-2 border-t border-white/5">
                                    <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-sm text-white/80 hover:text-white"><Mail size={14} className="text-white/40" /> {lead.email}</a>
                                    <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-sm text-white/80 hover:text-white"><Phone size={14} className="text-white/40" /> {lead.phone}</a>
                                </div>
                            </div>
                            
                            {/* Message / Details */}
                            <div className="md:w-1/2 bg-white/5 rounded-lg p-4 text-sm text-white/80 leading-relaxed border border-white/5">
                                <div className="text-xs text-white/40 font-bold uppercase mb-2">Message & Details</div>
                                {lead.message || "No message provided."}
                            </div>

                            {/* Meta & Actions */}
                            <div className="md:w-1/6 flex flex-col justify-between items-end border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
                                <div className="text-right w-full mb-4 md:mb-0">
                                    <div className="text-xs text-white/40 mb-1 flex items-center justify-end gap-1"><Calendar size={12}/> {new Date(lead.created_at).toLocaleDateString()}</div>
                                    <div className="text-xs text-white/40 bg-white/5 inline-block px-2 py-1 rounded">Campaign: {lead.landing_page_slug}</div>
                                </div>
                                
                                <select 
                                    className="bg-[#111] border border-white/10 text-white text-xs font-bold uppercase rounded px-3 py-2 outline-none focus:border-[#C5A059] w-full"
                                    value={lead.status}
                                    onChange={(e) => updateStatus(lead.id, e.target.value)}
                                >
                                    <option value="new">Status: New</option>
                                    <option value="contacted">Status: Contacted</option>
                                    <option value="closed">Status: Closed</option>
                                </select>
                            </div>
                        </div>
                    ))}
                    {filteredLeads.length === 0 && (
                        <div className="text-center text-white/40 py-12 bg-[#080808] rounded-xl border border-white/5">
                            No leads found in this category.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
