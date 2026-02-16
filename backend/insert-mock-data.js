const { query } = require('./src/config/database');

// All projects data from the mock data
const projects = [
    {
        title: 'M/s Relevantz Technologies',
        slug: 'relevantz-technologies',
        category: 'IT & ITES OFFICES',
        type: 'INTERIOR',
        location: 'Chennai, India',
        year: '2024',
        area: '60,000 Sq.Ft',
        client: 'Relevantz Technologies Pvt Ltd',
        design_style: 'Contemporary Corporate',
        cover_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1400',
        description: 'A contemporary IT workspace designed to promote collaboration, agility, and employee well-being.',
        highlights: ['Collaborative open office planning', 'Biophilic design elements', 'Energy-efficient lighting', 'Flexible work zones'],
        scope: ['Interior Design', 'MEP Coordination', 'Turnkey Execution'],
        is_featured: true
    },
    {
        title: 'M/s Emerson Process Management',
        slug: 'emerson-process-management',
        category: 'IT & ITES OFFICES',
        type: 'INTERIOR',
        location: 'Chennai, India',
        year: '2023',
        area: '45,000 Sq.Ft',
        client: 'Emerson',
        design_style: 'Global Corporate',
        cover_image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1400',
        description: 'Corporate office interiors reflecting global brand standards and operational efficiency.',
        highlights: ['Brand-aligned interiors', 'Efficient space planning', 'High-performance workstations'],
        scope: ['Interior Design', 'Project Management'],
        is_featured: true
    },
    {
        title: 'M/s OFS Technologies',
        slug: 'ofs-technologies',
        category: 'IT & ITES OFFICES',
        type: 'INTERIOR',
        location: 'Bangalore, India',
        year: '2022',
        area: '38,000 Sq.Ft',
        client: 'OFS',
        design_style: 'Modern Tech Office',
        cover_image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1400',
        description: 'Technology-driven office interiors supporting high-performance teams.',
        highlights: ['Optimized workstation layouts', 'Collaboration hubs', 'Minimal modern palette'],
        scope: ['Space Planning', 'Interior Design'],
        is_featured: false
    },
    {
        title: 'M/s Forbes Marshall – Regional Office',
        slug: 'forbes-marshall',
        category: 'IT & ITES OFFICES',
        type: 'INTERIOR',
        location: 'Chennai, India',
        year: '2023',
        area: '25,000 Sq.Ft',
        client: 'Forbes Marshall',
        design_style: 'Corporate Modern',
        cover_image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1400',
        description: 'Regional corporate office designed for leadership presence and functional clarity.',
        highlights: ['Executive office planning', 'Brand identity integration'],
        scope: ['Interior Design', 'Brand Integration'],
        is_featured: true
    },
    {
        title: 'M/s Panalpina World Transport',
        slug: 'panalpina',
        category: 'IT & ITES OFFICES',
        type: 'INTERIOR',
        location: 'Mumbai, India',
        year: '2022',
        area: '28,000 Sq.Ft',
        client: 'Panalpina',
        design_style: 'Corporate Industrial',
        cover_image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1400',
        description: 'Logistics corporate office balancing operations and administration.',
        highlights: ['Functional zoning', 'Durable material palette'],
        scope: ['Interior Design'],
        is_featured: false
    },
    {
        title: 'M/s Al Saraya Corniche Club',
        slug: 'al-saraya-club',
        category: 'CLUBS & RESTO BARS',
        type: 'INTERIOR',
        location: 'Chennai, India',
        year: '2024',
        area: '18,000 Sq.Ft',
        client: 'Al Saraya',
        design_style: 'Luxury Contemporary',
        cover_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1400',
        description: 'Premium club interiors blending luxury with vibrant social spaces.',
        highlights: ['Mood lighting design', 'High-end material palette'],
        scope: ['Interior Design', 'Lighting'],
        is_featured: true
    },
    {
        title: 'M/s DCP Warehouse',
        slug: 'dcp-warehouse',
        category: 'WAREHOUSE & FACTORY BUILDINGS',
        type: 'ARCHITECTURE',
        location: 'Oragadam, India',
        year: '2023',
        area: '1,80,000 Sq.Ft',
        client: 'DCP',
        design_style: 'Industrial Functional',
        cover_image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=1400',
        description: 'Large-scale warehouse optimized for logistics and storage efficiency.',
        highlights: ['Efficient vehicular movement', 'Optimized structural spans'],
        scope: ['Architecture', 'Execution'],
        is_featured: false
    },
    {
        title: 'M/s Blaack Forest',
        slug: 'blaack-forest',
        category: 'SHOWROOM & RETAIL OUTLETS',
        type: 'INTERIOR',
        location: 'Chennai, India',
        year: '2024',
        area: '18,000 Sq.Ft',
        client: 'Blaack Forest',
        design_style: 'Luxury Contemporary',
        cover_image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=1400',
        description: 'Premium showroom interiors blending luxury with vibrant retail spaces.',
        highlights: ['Mood lighting design', 'High-end material palette'],
        scope: ['Interior Design', 'Lighting'],
        is_featured: false
    }
];

(async () => {
    try {
        console.log('🔄 Inserting mock projects...');
        let count = 0;
        for (const proj of projects) {
            const result = await query(
                `INSERT INTO projects (title, slug, category, type, location, year, area, client, design_style, cover_image, description, highlights, scope, is_featured)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
                ON CONFLICT (slug) DO NOTHING`,
                [
                    proj.title,
                    proj.slug,
                    proj.category,
                    proj.type,
                    proj.location,
                    proj.year,
                    proj.area,
                    proj.client,
                    proj.design_style,
                    proj.cover_image,
                    proj.description,
                    JSON.stringify(proj.highlights),
                    JSON.stringify(proj.scope),
                    proj.is_featured
                ]
            );
            if (result.rowCount > 0) count++;
        }
        console.log(`✅ Inserted ${count} new projects`);
        console.log(`📊 Total projects in database: ${count}`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
})();
