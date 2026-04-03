import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare, X, Loader, ArrowRight, Send, RotateCcw, Sparkles } from 'lucide-react';
import { projectsAPI, normalizeAssetUrl } from '../services/api';

const CHATBOT_API_URL = import.meta.env.VITE_CHATBOT_URL;

/* ── Quick‑suggestion chips ────────────────────────────────────────── */
const SUGGESTIONS = [
    'What services do you offer?',
    'Show me your projects',
    'How can I contact you?',
    'Tell me about your design process',
];

/* ── Simple markdown‑ish renderer (bold, line breaks) ──────────────── */
const renderText = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => (
        <span key={i}>
            {line.split(/(\*\*[^*]+\*\*)/).map((part, j) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={j} className="font-semibold">{part.slice(2, -2)}</strong>;
                }
                return part;
            })}
            {i < text.split('\n').length - 1 && <br />}
        </span>
    ));
};

/* ── Keywords that indicate project-related intent ──────────────────── */
const PROJECT_KEYWORDS = [
    'project', 'design', 'work', 'case study', 'portfolio',
    'residential', 'commercial', 'interior', 'architecture',
    'office', 'villa', 'apartment', 'hotel', 'hospital',
    'factory', 'warehouse', 'school', 'college', 'restaurant',
    'showroom', 'retail', 'industrial', 'turnkey', 'fit-out',
    'peb', 'civil', 'construction', 'renovation', 'renovation',
];

const AIChatbot = ({ setPage = () => {} }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'assistant',
            text: "Welcome to Adroit Design. I'm your AI concierge — ask me about our services, projects, or how to get in touch.",
            projects: null,
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [allProjects, setAllProjects] = useState([]);
    const [projectsFetched, setProjectsFetched] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const inputRef = useRef(null);

    /* ── Auto‑scroll ───────────────────────────────────────────────── */
    const scrollToBottom = useCallback(() => {
        requestAnimationFrame(() => {
            if (messagesContainerRef.current) {
                messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
            }
        });
    }, []);

    useEffect(() => { scrollToBottom(); }, [messages, isLoading, scrollToBottom]);

    /* ── Fetch ALL published projects from backend ─────────────────── */
    useEffect(() => {
        if (!isOpen || projectsFetched) return;
        (async () => {
            try {
                const res = await projectsAPI.getAll({ published: true, limit: 200 });
                const data = res.data || res.projects || [];
                // Handle paginated response shapes
                const projectList = Array.isArray(data) ? data : (data.rows || data.data || []);
                setAllProjects(projectList);
                setProjectsFetched(true);
            } catch (error) {
                console.error('Failed to fetch projects:', error);
                // Fallback: try featured
                try {
                    const res = await projectsAPI.getFeatured(20);
                    if (res.success) {
                        setAllProjects(res.data || []);
                        setProjectsFetched(true);
                    }
                } catch (e2) {
                    console.error('Fallback fetch also failed:', e2);
                }
            }
        })();
    }, [isOpen, projectsFetched]);

    /* ── Focus input when opened ───────────────────────────────────── */
    useEffect(() => {
        if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
    }, [isOpen]);

    const canSend = useMemo(() => inputValue.trim().length > 0 && !isLoading, [inputValue, isLoading]);

    /* ── Smart project matching based on chat context ───────────────── */
    const findRelevantProjects = useCallback((userQuery, aiResponse) => {
        if (allProjects.length === 0) return null;

        const combinedText = `${userQuery} ${aiResponse}`.toLowerCase();

        // Check if the conversation is about projects at all
        const isProjectRelated = PROJECT_KEYWORDS.some(kw => combinedText.includes(kw));
        if (!isProjectRelated) return null;

        /* ── STEP 1: Try to match projects mentioned by NAME in the AI response ── */
        const nameMatched = [];
        const responseText = aiResponse.toLowerCase();

        for (const project of allProjects) {
            const title = (project.title || '').toLowerCase().trim();
            if (!title || title.length < 3) continue;

            // Extract meaningful words from the project title (skip M/s, Mr, Mrs, etc.)
            const cleanTitle = title
                .replace(/^(m\/s|mr\s*&?\s*mrs|mr|mrs|dr)\s+/i, '')
                .trim();

            // Check if the AI response contains a substantial part of the project title
            // Use multiple matching strategies:

            // Strategy 1: Full clean title appears in the response
            if (cleanTitle.length > 4 && responseText.includes(cleanTitle)) {
                nameMatched.push({ ...project, _nameScore: 100 });
                continue;
            }

            // Strategy 2: Title words (significant ones) match in the response
            const titleWords = cleanTitle
                .split(/[\s,\-–]+/)
                .filter(w => w.length > 3)
                .filter(w => !['residence', 'villa', 'apartment', 'office', 'hotel',
                    'restaurant', 'building', 'house', 'project', 'design',
                    'interior', 'interiors', 'private', 'limited', 'pvt', 'ltd'].includes(w));

            if (titleWords.length > 0) {
                const matchCount = titleWords.filter(w => responseText.includes(w)).length;
                // If most unique words from the title are in the response, it's a match
                if (matchCount >= Math.ceil(titleWords.length * 0.6) && matchCount >= 1) {
                    nameMatched.push({ ...project, _nameScore: 50 + (matchCount / titleWords.length) * 50 });
                }
            }
        }

        // If we found projects mentioned by name, return those (sorted by match quality)
        if (nameMatched.length > 0) {
            const uniqueMatched = nameMatched
                .sort((a, b) => b._nameScore - a._nameScore)
                .filter((p, i, arr) => arr.findIndex(x => x.id === p.id) === i)
                .slice(0, 4);
            return uniqueMatched;
        }

        /* ── STEP 2: Fallback — keyword-based scoring ──────────────────── */
        const locations = [
            'chennai', 'bangalore', 'bengaluru', 'delhi', 'mumbai',
            'hyderabad', 'pune', 'kolkata', 'dubai', 'coimbatore',
            'thiruvannamalai', 'perungudi', 'pallavaram', 'thoraipakkam',
            'kodaikanal', 'madurai', 'trichy', 'salem', 'pondicherry',
        ];
        const matchedLocation = locations.find(loc => combinedText.includes(loc));

        const categoryMap = {
            'residential': ['residential', 'villa', 'apartment', 'home', 'house'],
            'commercial': ['commercial', 'office', 'it park', 'retail', 'showroom', 'shop'],
            'hospitality': ['hotel', 'restaurant', 'resort', 'club', 'motel', 'hospitality'],
            'healthcare': ['hospital', 'clinic', 'healthcare', 'nursing', 'medical'],
            'institutional': ['school', 'college', 'university', 'institution', 'campus'],
            'industrial': ['factory', 'warehouse', 'industrial', 'manufacturing', 'plant'],
            'interior': ['interior', 'fit-out', 'fitout', 'turnkey', 'renovation'],
        };

        let matchedCategories = [];
        for (const [category, keywords] of Object.entries(categoryMap)) {
            if (keywords.some(kw => combinedText.includes(kw))) {
                matchedCategories.push(category);
            }
        }

        const areaMatch = combinedText.match(/(\d+(?:,\d+)*)\s*(?:sqft|sft|sq\.ft|square\s*feet)/i);
        const targetArea = areaMatch ? parseInt(areaMatch[1].replace(',', '')) : null;

        const scored = allProjects.map(project => {
            let score = 0;
            const pTitle = (project.title || '').toLowerCase();
            const pCategory = (project.category || '').toLowerCase();
            const pType = (project.type || '').toLowerCase();
            const pLocation = (project.location || '').toLowerCase();
            const pDescription = (project.description || '').toLowerCase();

            if (matchedLocation && pLocation.includes(matchedLocation)) score += 10;

            for (const cat of matchedCategories) {
                if (pCategory.includes(cat) || pType.includes(cat) || pTitle.includes(cat)) score += 8;
                const keywords = categoryMap[cat] || [];
                if (keywords.some(kw => pCategory.includes(kw) || pType.includes(kw) || pTitle.includes(kw) || pDescription.includes(kw))) score += 5;
            }

            if (targetArea) {
                const pArea = parseInt(project.area) || 0;
                if (pArea > 0 && pArea >= targetArea * 0.7 && pArea <= targetArea * 1.3) score += 6;
            }

            // Extract meaningful words from user query (not generic ones)
            const skipWords = new Set([
                'what', 'which', 'show', 'tell', 'about', 'your', 'have', 'done',
                'project', 'projects', 'design', 'work', 'service', 'services',
                'portfolio', 'like', 'some', 'give', 'list', 'type', 'types',
                'that', 'this', 'with', 'from', 'the', 'and', 'for', 'are',
            ]);
            const queryWords = userQuery.toLowerCase().split(/\s+/).filter(w => w.length > 3 && !skipWords.has(w));
            for (const word of queryWords) {
                if (pTitle.includes(word)) score += 4;
                if (pLocation.includes(word)) score += 6;
                if (pCategory.includes(word)) score += 5;
            }

            return { ...project, _score: score };
        });

        const sorted = scored
            .filter(p => p._score > 0)
            .sort((a, b) => b._score - a._score)
            .slice(0, 4);

        if (sorted.length === 0) {
            const shuffled = [...allProjects].sort(() => Math.random() - 0.5);
            return shuffled.slice(0, 4);
        }

        return sorted;
    }, [allProjects]);

    /* ── Send message ──────────────────────────────────────────────── */
    const handleSend = async (overrideText) => {
        const trimmed = (overrideText || inputValue).trim();
        if (!trimmed || isLoading) return;

        setShowSuggestions(false);
        setMessages((prev) => [...prev, { id: Date.now(), role: 'user', text: trimmed, projects: null }]);
        setInputValue('');
        setIsLoading(true);

        try {
            if (!CHATBOT_API_URL) throw new Error('Chatbot URL not configured');

            const response = await fetch(CHATBOT_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: trimmed }),
            });

            if (!response.ok) throw new Error(`API ${response.status}`);

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let assistantText = '';
            const assistantMsgId = Date.now() + 1;

            setMessages((prev) => [...prev, { id: assistantMsgId, role: 'assistant', text: '', projects: null }]);

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });

                if (buffer.includes('[END]')) {
                    assistantText = buffer.split('[END]')[0].trim();
                    break;
                }
                assistantText = buffer.trim();
                setMessages((prev) =>
                    prev.map((m) => (m.id === assistantMsgId ? { ...m, text: assistantText } : m)),
                );
            }

            // Find relevant projects based on conversation context
            const relevantProjects = findRelevantProjects(trimmed, assistantText);

            setMessages((prev) =>
                prev.map((m) =>
                    m.id === assistantMsgId
                        ? { ...m, text: assistantText || 'No response received.', projects: relevantProjects }
                        : m,
                ),
            );
        } catch (error) {
            console.error('Chat error:', error);
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 2,
                    role: 'assistant',
                    text: "I'm having trouble connecting right now. You can reach us directly at info@adroitdesigns.in or call (+91) 44-45561113.",
                    projects: null,
                },
            ]);
        } finally {
            setIsLoading(false);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const resetChat = () => {
        setMessages([
            {
                id: Date.now(),
                role: 'assistant',
                text: "Welcome to Adroit Design. I'm your AI concierge — ask me about our services, projects, or how to get in touch.",
                projects: null,
            },
        ]);
        setShowSuggestions(true);
    };

    /* ── Stop Lenis from hijacking scroll inside chatbot ────────────── */
    const handleWheel = useCallback((e) => {
        e.stopPropagation();
    }, []);

    const handleTouchMove = useCallback((e) => {
        e.stopPropagation();
    }, []);

    /* ── Render ─────────────────────────────────────────────────────── */
    return (
        <>
            {/* Floating Action Button */}
            <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40"
            >
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative bg-[#0a0a0a] text-white p-4 rounded-full shadow-2xl cursor-pointer hover:bg-[#C5A059] transition-colors duration-500 border border-white/10"
                    aria-label={isOpen ? 'Close chat' : 'Open chat'}
                >
                    {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
                    {!isOpen && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#C5A059] rounded-full animate-pulse" />
                    )}
                </button>
            </motion.div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed bottom-20 right-4 md:right-8 z-40 w-[92vw] sm:w-96 md:w-[28rem] max-w-[28rem] max-h-[75vh] bg-white shadow-2xl border border-stone-200 rounded-2xl overflow-hidden flex flex-col"
                        data-lenis-prevent
                    >
                        {/* ── Header ──────────────────────────────────────── */}
                        <div className="px-5 py-4 border-b border-stone-100 bg-[#0a0a0a] text-white flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Sparkles size={12} className="text-[#C5A059]" />
                                    <span className="text-[10px] tracking-widest uppercase text-[#C5A059] font-sans font-bold">
                                        AI Concierge
                                    </span>
                                </div>
                                <p className="text-base font-logo mt-1 uppercase tracking-tight">Adroit Assistant</p>
                            </div>
                            <button
                                onClick={resetChat}
                                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-white"
                                title="Reset conversation"
                            >
                                <RotateCcw size={14} />
                            </button>
                        </div>

                        {/* ── Messages ─────────────────────────────────────── */}
                        <div
                            className="flex-1 min-h-[300px] md:h-[32rem] bg-stone-50 p-4 space-y-4 flex flex-col"
                            ref={messagesContainerRef}
                            onWheel={handleWheel}
                            onTouchMove={handleTouchMove}
                            style={{
                                overflowY: 'auto',
                                overscrollBehavior: 'contain',
                                WebkitOverflowScrolling: 'touch',
                            }}
                            data-lenis-prevent
                        >
                            {messages.map((msg) => (
                                <div key={msg.id} className="flex flex-col gap-2">
                                    {/* Text Bubble */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
                                    >
                                        <div
                                            className={
                                                msg.role === 'user'
                                                    ? 'max-w-[85%] bg-[#0a0a0a] text-white px-4 py-3 text-sm rounded-2xl rounded-br-sm shadow-md leading-relaxed'
                                                    : 'max-w-[85%] bg-white text-stone-700 px-4 py-3 text-sm rounded-2xl rounded-bl-sm shadow border border-stone-100 leading-relaxed'
                                            }
                                        >
                                            {renderText(msg.text)}
                                        </div>
                                    </motion.div>

                                    {/* Project Cards */}
                                    {msg.projects && msg.projects.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="flex gap-2 pb-2"
                                            style={{
                                                overflowX: 'auto',
                                                overscrollBehavior: 'contain',
                                                WebkitOverflowScrolling: 'touch',
                                                scrollbarWidth: 'none',
                                                msOverflowStyle: 'none',
                                            }}
                                        >
                                            {msg.projects.slice(0, 4).map((project) => (
                                                <div
                                                    key={project.id}
                                                    className="min-w-[200px] max-w-[220px] bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex-shrink-0"
                                                >
                                                    <div className="relative h-24 bg-stone-200 overflow-hidden">
                                                        <img
                                                            src={normalizeAssetUrl(
                                                                project.cover_image ||
                                                                    project.coverImage ||
                                                                    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400',
                                                            )}
                                                            alt={project.title}
                                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src =
                                                                    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400';
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="p-2.5">
                                                        <p className="text-[8px] text-[#C5A059] font-bold uppercase tracking-widest mb-0.5">
                                                            {project.category || 'Design'}
                                                        </p>
                                                        <h4 className="text-[11px] font-semibold text-stone-900 mb-0.5 line-clamp-1">
                                                            {project.title}
                                                        </h4>
                                                        <p className="text-[10px] text-stone-400 mb-2 line-clamp-1">
                                                            {project.location || 'Design Project'}
                                                        </p>
                                                        <button
                                                            onClick={() => {
                                                                setPage('Projects');
                                                                window.projectToLoad = project.slug;
                                                                setIsOpen(false);
                                                            }}
                                                            className="w-full flex items-center justify-between px-2 py-1.5 bg-[#0a0a0a] text-white text-[9px] font-bold uppercase tracking-widest rounded-md hover:bg-[#C5A059] transition-colors"
                                                        >
                                                            View Project
                                                            <ArrowRight size={10} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </div>
                            ))}

                            {/* Suggestions */}
                            {showSuggestions && messages.length <= 1 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="flex flex-wrap gap-2 mt-2"
                                >
                                    {SUGGESTIONS.map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => handleSend(s)}
                                            className="text-[11px] px-3 py-1.5 rounded-full border border-stone-200 text-stone-500 hover:bg-[#C5A059] hover:text-white hover:border-[#C5A059] transition-all duration-300"
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </motion.div>
                            )}

                            {/* Loading indicator */}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-white text-stone-500 px-4 py-3 text-sm rounded-2xl rounded-bl-sm shadow border border-stone-100 flex items-center gap-2">
                                        <div className="flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                        <span className="text-xs text-stone-400">Thinking...</span>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} className="h-1" />
                        </div>

                        {/* ── Input ────────────────────────────────────────── */}
                        <div className="p-3 bg-white border-t border-stone-100">
                            <div className="flex items-end gap-2 bg-stone-50 rounded-xl px-3 py-2 border border-stone-100 focus-within:border-[#C5A059] transition-colors">
                                <textarea
                                    ref={inputRef}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask about projects, services..."
                                    rows={1}
                                    disabled={isLoading}
                                    className="flex-1 resize-none text-sm outline-none placeholder:text-stone-300 bg-transparent max-h-24 disabled:opacity-60"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleSend()}
                                    disabled={!canSend}
                                    className="p-2 rounded-lg bg-[#C5A059] text-white hover:bg-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                                    aria-label="Send message"
                                >
                                    <Send size={14} />
                                </button>
                            </div>
                            <p className="text-center text-[9px] text-stone-300 mt-1.5">
                                Powered by Adroit AI · Press Enter to send
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AIChatbot;
