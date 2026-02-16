import React, { useMemo, useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare, X, Loader, ArrowRight } from 'lucide-react';
import { projectsAPI, normalizeAssetUrl } from '../services/api';

const CHATBOT_API_URL = import.meta.env.VITE_CHATBOT_URL;

const AIChatbot = ({ setPage = () => {} }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, role: 'assistant', text: 'Welcome. How may I assist with your design inquiry today?', projects: null }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 0);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // Fetch projects once when component mounts
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await projectsAPI.getFeatured(4);
                if (response.success) {
                    setProjects(response.data || []);
                }
            } catch (error) {
                console.error('Failed to fetch projects:', error);
            }
        };
        fetchProjects();
    }, []);

    const canSend = useMemo(() => inputValue.trim().length > 0 && !isLoading, [inputValue, isLoading]);

    const extractProjectFilters = (text) => {
        const lowerText = text.toLowerCase();
        
        // Extract location (look for city names)
        const locations = ['chennai', 'bangalore', 'delhi', 'mumbai', 'hyderabad', 'pune', 'kolkata', 'delhi', 'malibu', 'dubai', 'kyoto', 'berlin'];
        const location = locations.find(loc => lowerText.includes(loc));
        
        // Extract area (numbers followed by sqft/sft/sq.ft)
        const areaMatch = text.match(/(\d+(?:,\d+)*)\s*(?:sqft|sft|sq\.ft|square\s*feet)/i);
        const area = areaMatch ? parseInt(areaMatch[1].replace(',', '')) : null;
        
        return { location, area };
    };

    const filterProjectsByResponse = (allProjects, responseText) => {
        const { location, area } = extractProjectFilters(responseText);
        
        // If no filters found, return all projects
        if (!location && !area) return allProjects;
        
        return allProjects.filter(project => {
            let matches = 0;
            let required = 0;
            
            // Check location match
            if (location) {
                required++;
                if (project.location && project.location.toLowerCase().includes(location)) {
                    matches++;
                }
            }
            
            // Check area match (within 20% range)
            if (area) {
                required++;
                const projectArea = parseInt(project.area) || 0;
                if (projectArea > 0) {
                    const tolerance = area * 0.2;
                    if (projectArea >= area - tolerance && projectArea <= area + tolerance) {
                        matches++;
                    }
                }
            }
            
            // Return project if it matches the filters
            return matches === required && required > 0;
        });
    };

    const handleSend = async () => {
        if (!canSend) return;
        const trimmed = inputValue.trim();
        
        // Add user message
        setMessages((prev) => [
            ...prev,
            { id: Date.now(), role: 'user', text: trimmed, projects: null }
        ]);
        setInputValue('');
        setIsLoading(true);

        try {
            if (!CHATBOT_API_URL) {
                throw new Error('VITE_CHATBOT_URL is not set');
            }

            const response = await fetch(CHATBOT_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: trimmed }),
            });

            if (!response.ok) throw new Error(`API error: ${response.status}`);

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let assistantText = '';

            // Add placeholder for assistant response
            const assistantMsgId = Date.now() + 1;
            setMessages((prev) => [
                ...prev,
                { id: assistantMsgId, role: 'assistant', text: '', projects: null }
            ]);

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;

                if (buffer.includes('[END]')) {
                    assistantText = buffer.split('[END]')[0].trim();
                    break;
                } else {
                    assistantText = buffer.trim();
                    setMessages((prev) =>
                        prev.map((msg) =>
                            msg.id === assistantMsgId ? { ...msg, text: assistantText } : msg
                        )
                    );
                }
            }

            // Check if AI response mentions projects - then show matching project cards
            const shouldShowProjects = assistantText.toLowerCase().includes('project') || 
                                      assistantText.toLowerCase().includes('design') ||
                                      assistantText.toLowerCase().includes('work') ||
                                      assistantText.toLowerCase().includes('case study');
            
            let filteredProjects = null;
            if (shouldShowProjects && projects.length > 0) {
                filteredProjects = filterProjectsByResponse(projects, assistantText);
                // If filtering found matches, use filtered; otherwise show all
                if (filteredProjects.length === 0) {
                    filteredProjects = projects;
                }
            }
            
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === assistantMsgId ? { ...msg, text: assistantText || 'No response received.', projects: filteredProjects } : msg
                )
            );
        } catch (error) {
            console.error('Chat error:', error);
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 2,
                    role: 'assistant',
                    text: 'Sorry, I encountered an error. Please try again.',
                    projects: null
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            <div
                className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 bg-[#0a0a0a] text-white p-4 rounded-full shadow-2xl cursor-pointer hover:bg-[#C5A059] transition-colors duration-500"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-20 right-4 md:right-8 z-40 w-[92vw] sm:w-96 md:w-[28rem] max-w-[28rem] bg-white shadow-2xl border border-stone-100 rounded-xl overflow-hidden flex flex-col"
                    >
                        <div className="px-5 py-4 border-b border-stone-100 bg-[#0a0a0a] text-white">
                            <span className="text-[10px] tracking-widest uppercase text-[#C5A059] font-sans font-bold">Concierge</span>
                            <p className="text-lg font-logo mt-1 uppercase tracking-tight">Adroit Assistant</p>
                            <p className="text-xs text-white/60 mt-1">Ask about our projects & designs</p>
                        </div>
                        <div className="h-96 md:h-[32rem] bg-stone-50 p-4 overflow-y-auto space-y-4 flex flex-col" ref={messagesContainerRef}>
                            {messages.map((msg) => (
                                <div key={msg.id} className="flex flex-col gap-2">
                                    {/* Text Message */}
                                    <div className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                                        <div
                                            className={
                                                msg.role === 'user'
                                                    ? 'max-w-[85%] bg-[#0a0a0a] text-white px-4 py-3 text-sm rounded-2xl rounded-br-md shadow'
                                                    : 'max-w-[85%] bg-white text-stone-700 px-4 py-3 text-sm rounded-2xl rounded-bl-md shadow border border-stone-100'
                                            }
                                        >
                                            {msg.text}
                                        </div>
                                    </div>

                                    {/* Project Cards */}
                                    {msg.projects && msg.projects.length > 0 && (
                                        <div className="flex flex-col gap-2 mt-2">
                                            {msg.projects.map((project) => (
                                                <div
                                                    key={project.id}
                                                    className="max-w-xs bg-white border border-stone-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                                >
                                                    {/* Project Image */}
                                                    <div className="relative h-28 bg-stone-200 overflow-hidden">
                                                        <img
                                                            src={normalizeAssetUrl(project.cover_image || project.coverImage || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400')}
                                                            alt={project.title}
                                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                            onError={(e) => {
                                                                e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400';
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Project Info */}
                                                    <div className="p-3">
                                                        <p className="text-[9px] text-[#C5A059] font-bold uppercase tracking-widest mb-1">
                                                            {project.category || 'Design'}
                                                        </p>
                                                        <h4 className="text-xs font-semibold text-stone-900 mb-1 line-clamp-1">
                                                            {project.title}
                                                        </h4>
                                                        <p className="text-[11px] text-stone-500 mb-2 line-clamp-1">
                                                            {project.location || 'Design Project'}
                                                        </p>
                                                        <button
                                                            onClick={() => {
                                                                setPage('Projects');
                                                                // Store the slug to fetch details when ProjectsPage loads
                                                                window.projectToLoad = project.slug;
                                                            }}
                                                            className="w-full flex items-center justify-between px-2.5 py-2 bg-[#0a0a0a] text-white text-[10px] font-bold uppercase tracking-widest rounded hover:bg-[#C5A059] transition-colors"
                                                        >
                                                            View
                                                            <ArrowRight size={12} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white text-stone-700 px-4 py-3 text-sm rounded-2xl rounded-bl-md shadow border border-stone-100 flex items-center gap-2">
                                        <Loader size={14} className="animate-spin" />
                                        Thinking...
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} className="h-1" />
                        </div>
                        <div className="p-4 bg-white border-t border-stone-100">
                            <div className="flex items-end gap-3">
                                <textarea
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask about projects..."
                                    rows={1}
                                    disabled={isLoading}
                                    className="flex-1 resize-none text-sm outline-none placeholder:text-stone-300 bg-white max-h-24 disabled:opacity-60"
                                />
                                <button
                                    type="button"
                                    onClick={handleSend}
                                    disabled={!canSend}
                                    className="px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-md bg-[#C5A059] text-white hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 flex-shrink-0"
                                >
                                    {isLoading ? <Loader size={12} className="animate-spin" /> : 'Send'}
                                </button>
                            </div>
                            <div className="mt-2 text-[10px] text-stone-400">
                                Press Enter to send
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AIChatbot;
