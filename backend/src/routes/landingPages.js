const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { query } = require('../config/database');

// GET all landing pages (Admin)
router.get('/', auth, async (req, res) => {
    try {
        const result = await query('SELECT * FROM landing_pages ORDER BY created_at DESC');
        res.json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET single landing page by Slug (Public)
router.get('/:slug', async (req, res) => {
    try {
        const result = await query('SELECT * FROM landing_pages WHERE slug = $1', [req.params.slug]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Landing page not found' });
        }
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET single landing page by ID (Admin)
router.get('/admin/:id', auth, async (req, res) => {
    try {
        const result = await query('SELECT * FROM landing_pages WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// CREATE landing page (Admin)
router.post('/', auth, async (req, res) => {
    const { name, slug } = req.body;
    try {
        const defaultSections = {
            hero: { enabled: true, content: { eyebrow: "Corporate & Commercial Interiors", headline: "Designed to <em>Perform.</em><br />Delivered with <em>Accountability.</em>", sub_headline: "Integrated Interior Design, Design & Build and Turnkey Project Solutions<br />from concept development to successful project handover.", primary_cta: "Discuss Your Project", secondary_cta: "View Our Projects", image_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop", stats: [ { num: "20+", lbl: "Years of Experience" }, { num: "1.2M+", lbl: "Sq.Ft. Delivered" }, { num: "500+", lbl: "Projects" } ] } },
            about: { enabled: true, content: { eyebrow: "TRUSTED BY LEADING BUSINESSES", headline: "Adroit partners with Corporates, Institutions and Businesses to design and deliver high-quality workplaces and commercial environments.", primary_cta: "GET A FREE VISIT" } },
            services: { enabled: true, content: { eyebrow: "ONE PARTNER. COMPLETE PROJECT DELIVERY.", headline: "Corporate & Commercial Interior Services", primary_cta: "Request a Free Site Visit", items: [ { title: "Corporate & Commercial Interior Design", desc: "Functional, efficient and inspiring workplaces designed around your business requirements, operations and brand identity." }, { title: "Design & Build", desc: "Integrated design, engineering, procurement and execution under a single point of responsibility." }, { title: "Turnkey Interior Execution", desc: "End-to-end execution covering interiors, civil works, MEP, furniture, specialist installations and final handover." }, { title: "Project Management", desc: "Professional planning, cost control, quality management and project monitoring for predictable outcomes." } ] } },
            portfolio: { enabled: true, content: { eyebrow: "PROJECTS THAT DEMONSTRATE OUR CAPABILITIES.", headline: "Explore projects where Adroit united design, engineering, and execution to deliver success.", primary_cta: "See Full Portfolio", featured_projects: [] } },
            why_us: { enabled: true, content: { eyebrow: "Why Adroit", headline: "Built For Businesses Where Quality, Cost And Timelines Matter.", primary_cta: "Talk To Our Consultant", image_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop", items: [ { title: "Single-Point Accountability", desc: "One experienced team coordinating your project from concept to successful completion." }, { title: "Multidisciplinary Expertise", desc: "Integrated Interior Design, Civil, MEP, Procurement and Project Management capabilities." }, { title: "Transparent Project Control", desc: "Detailed BOQs, cost monitoring, progress tracking and systematic project management." }, { title: "Quality-Focused Execution", desc: "Structured QA/QC procedures throughout project execution and final handover." } ] } },
            process: { enabled: true, content: { eyebrow: "FROM CONCEPT TO COMPLETION.", headline: "Our Process", sub_headline: "A disciplined five-phase methodology — refined across hundreds of projects — ensures every build is delivered with precision, on time, and on budget.", primary_cta: "Discuss Your Project", steps: [ { title: "Understand", desc: "Project Brief & Site Assessment", detail: "We listen first. Every project begins with a deep-dive into your vision, goals, and site conditions." }, { title: "Design", desc: "Design Development & Cost Planning", detail: "Our architects craft detailed designs, balancing aesthetics with budget precision." }, { title: "Engineer", desc: "Detailed Engineering & Procurement", detail: "Structural and MEP engineers resolve every technical detail before ground breaks." }, { title: "Execute", desc: "Project Execution & Management", detail: "On-site teams led by experienced project managers keep quality and timelines tight." }, { title: "Deliver", desc: "Testing, Snag Closure & Handover", detail: "We don't leave until every snag is resolved and you're fully satisfied." } ] } },
            testimonials: { enabled: true, content: { eyebrow: "Client Feedback", headline: "What our clients say about working with Adroit Design", primary_cta: "Start Your Project", items: [ { quote: "We handed over one brief and got back a finished office — on schedule, on budget, with none of the vendor chasing we expected.", author: "Operations Head, Technology Company" }, { quote: "The design matched the render almost exactly. That alone set Adroit apart from every other contractor we spoke to.", author: "Director, Retail Chain" }, { quote: "Weekly updates meant we always knew where the project stood. No surprises at handover, no last-minute cost additions.", author: "Founder, Financial Services Firm" } ] } },
            faq: { enabled: true, content: { eyebrow: "FAQ", headline: "Frequently Asked Questions", primary_cta: "Ask Us a Question", items: [ { question: "Does Adroit provide complete Design & Build services?", answer: "Yes. Our services can cover Interior Design, Engineering, MEP, Procurement, Execution, Project Management and final handover." }, { question: "What types of projects does Adroit undertake?", answer: "We specialise in medium to large-scale Corporate and Commercial Interior Projects." }, { question: "Can Adroit undertake projects across multiple locations?", answer: "Yes. We undertake projects across Chennai, Bengaluru and other locations based on project requirements." }, { question: "How does Adroit manage project quality and costs?", answer: "Through detailed BOQs, systematic project planning, cost monitoring, QA/QC procedures and professional project management." } ] } },
            contact: { enabled: true, content: { eyebrow: "Start a Project", headline: "Planning An Upcoming Corporate Or Commercial Interior Project?", body: "Let’s discuss how Adroit can deliver your project." } }
        };
        const defaultOrder = ['hero', 'about', 'services', 'portfolio', 'why_us', 'process', 'testimonials', 'faq', 'contact'];

        const result = await query(
            `INSERT INTO landing_pages (name, slug, status, sections, sections_order, seo) 
             VALUES ($1, $2, 'draft', $3, $4, $5) RETURNING *`,
            [name, slug, JSON.stringify(defaultSections), JSON.stringify(defaultOrder), JSON.stringify({})]
        );
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        if (error.code === '23505') return res.status(400).json({ success: false, message: 'Slug already exists' });
        res.status(500).json({ success: false, message: error.message });
    }
});

// UPDATE landing page (Admin)
router.put('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { status, sections, sections_order, seo } = req.body;
    try {
        const current = await query('SELECT * FROM landing_pages WHERE id = $1', [id]);
        if (current.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
        
        const c = current.rows[0];
        const result = await query(
            `UPDATE landing_pages SET 
                status = COALESCE($1, status),
                sections = COALESCE($2, sections),
                sections_order = COALESCE($3, sections_order),
                seo = COALESCE($4, seo),
                updated_at = NOW()
             WHERE id = $5 RETURNING *`,
            [
                status ?? c.status, 
                sections ? JSON.stringify(sections) : c.sections, 
                sections_order ? JSON.stringify(sections_order) : c.sections_order, 
                seo ? JSON.stringify(seo) : c.seo, 
                id
            ]
        );
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE landing page (Admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        await pool.query('DELETE FROM landing_pages WHERE id = $1', [req.params.id]);
        res.json({ success: true, message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
