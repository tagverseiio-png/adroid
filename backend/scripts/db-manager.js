/**
 * Adroit Design - Project Seeding & Database Management Tool
 * 
 * Features:
 * - List all projects
 * - Seed projects with mock data
 * - Delete all projects (with confirmation)
 * - Backup projects to JSON
 * 
 * Usage: 
 * 1. Ensure 'inquirer' is installed: npm install inquirer@^9.0.0
 * 2. Run: node scripts/db-manager.js
 */

const inquirer = require('inquirer');
const { pool, query } = require('../src/config/database');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Default Mock Data
const mockProjects = [
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
        is_featured: true,
        published: true
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
        is_featured: true,
        published: true
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
        is_featured: false,
        published: true
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
        is_featured: true,
        published: true
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
        is_featured: false,
        published: true
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
        is_featured: true,
        published: true
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
        is_featured: false,
        published: true
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
        is_featured: false,
        published: true
    }
];

// 1. List Projects
async function listProjects() {
    try {
        const result = await query('SELECT id, title, slug, category, published FROM projects ORDER BY id ASC');
        if (result.rows.length === 0) {
            console.log('\n📭 No projects found.');
        } else {
            console.log('\n📋 CURRENT PROJECTS:');
            console.table(result.rows);
        }
    } catch (err) {
        console.error('\n❌ Error:', err.message);
    }
}

// 2. Backup Projects
async function createBackup() {
    const backupDir = path.join(__dirname, '../backups');
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `projects_backup_${timestamp}.json`);

    try {
        const result = await query('SELECT * FROM projects');
        const imagesResult = await query('SELECT * FROM project_images');
        fs.writeFileSync(backupFile, JSON.stringify({ projects: result.rows, images: imagesResult.rows }, null, 2));
        console.log(`\n✅ Backup created: ${backupFile}`);
    } catch (err) {
        console.error('\n❌ Backup failed:', err.message);
    }
}

// 3. Delete All Projects
async function deleteAll() {
    try {
        await query('TRUNCATE projects CASCADE');
        console.log('\n🔥 ALL PROJECTS DELETED (Cascade to images)');
    } catch (err) {
        console.error('\n❌ Deletion failed:', err.message);
    }
}

// 4. Seed Projects
async function seedProjects() {
    console.log('\n🔄 Seeding projects...');
    try {
        // Detect 'is_featured' vs 'featured' column
        const cols = await query("SELECT column_name FROM information_schema.columns WHERE table_name = 'projects'");
        const columnNames = cols.rows.map(r => r.column_name);
        const featuredCol = columnNames.includes('featured') ? 'featured' : (columnNames.includes('is_featured') ? 'is_featured' : null);

        let count = 0;
        for (const proj of mockProjects) {
            const values = [
                proj.title, proj.slug, proj.category, proj.type, proj.location, 
                proj.year, proj.area, proj.client, proj.design_style, proj.cover_image, 
                proj.description, proj.highlights, proj.scope, proj.published
            ];

            let queryStr = `
                INSERT INTO projects (
                    title, slug, category, type, location, year, area, client, 
                    design_style, cover_image, description, highlights, scope, published
                    ${featuredCol ? `, ${featuredCol}` : ''}
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14 ${featuredCol ? ', $15' : ''})
                ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, updated_at = NOW();
            `;

            if (featuredCol) values.push(proj.is_featured);
            await query(queryStr, values);
            count++;
        }
        console.log(`\n✅ Successfully seeded ${count} projects.`);
    } catch (err) {
        console.error('\n❌ Seeding failed:', err.message);
    }
}

// 5. Seed from File
async function seedFromFile() {
    const { filePath } = await inquirer.prompt([{
        name: 'filePath',
        message: 'Enter the absolute path to your projects JSON file:',
        default: 'backups/my_projects.json'
    }]);

    const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(__dirname, '..', filePath);

    if (!fs.existsSync(absolutePath)) {
        console.error(`\n❌ File not found: ${absolutePath}`);
        return;
    }

    try {
        const fileContent = fs.readFileSync(absolutePath, 'utf8');
        const data = JSON.parse(fileContent);
        const projectsToSeed = Array.isArray(data) ? data : (data.projects || []);

        if (projectsToSeed.length === 0) {
            console.warn('\n⚠️ No projects found in the file.');
            return;
        }

        console.log(`\n🔄 Seeding ${projectsToSeed.length} projects from file...`);
        
        // Detect 'is_featured' vs 'featured' column
        const cols = await query("SELECT column_name FROM information_schema.columns WHERE table_name = 'projects'");
        const columnNames = cols.rows.map(r => r.column_name);
        const featuredCol = columnNames.includes('featured') ? 'featured' : (columnNames.includes('is_featured') ? 'is_featured' : null);

        let count = 0;
        for (const proj of projectsToSeed) {
            const values = [
                proj.title, proj.slug, proj.category, proj.type, proj.location, 
                proj.year, proj.area, proj.client, proj.design_style, proj.cover_image, 
                proj.description, proj.highlights, proj.scope, proj.published === undefined ? true : proj.published
            ];

            let queryStr = `
                INSERT INTO projects (
                    title, slug, category, type, location, year, area, client, 
                    design_style, cover_image, description, highlights, scope, published
                    ${featuredCol ? `, ${featuredCol}` : ''}
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14 ${featuredCol ? ', $15' : ''})
                ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, updated_at = NOW();
            `;

            if (featuredCol) values.push(proj.is_featured);
            await query(queryStr, values);
            count++;
        }
        console.log(`\n✅ Successfully seeded ${count} projects from file.`);
    } catch (err) {
        console.error('\n❌ Failed to seed from file:', err.message);
    }
}

// Main Menu
async function start() {
    console.log('\x1b[36m%s\x1b[0m', '\n--- ADROIT DB MANAGER ---');
    const { action } = await inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'Choose an action:',
        choices: [
            'List Projects',
            'Seed Fresh Data (Default Mock)',
            'Seed from custom JSON file',
            'Backup to JSON',
            'Delete All (DANGER)',
            'Full Reset (Backup -> Delete -> Seed Mock)',
            'Exit'
        ]
    }]);

    if (action === 'List Projects') await listProjects();
    if (action === 'Seed Fresh Data (Default Mock)') await seedProjects();
    if (action === 'Seed from custom JSON file') await seedFromFile();
    if (action === 'Backup to JSON') await createBackup();
    if (action === 'Delete All (DANGER)') {
        const { confirm } = await inquirer.prompt([{ type: 'confirm', name: 'confirm', message: 'Continue deletion?', default: false }]);
        if (confirm) await deleteAll();
    }
    if (action === 'Full Reset (Backup -> Delete -> Seed)') {
        const { confirm } = await inquirer.prompt([{ type: 'confirm', name: 'confirm', message: 'Reset database?', default: false }]);
        if (confirm) {
            await createBackup();
            await deleteAll();
            await seedProjects();
        }
    }
    if (action === 'Exit') {
        pool.end();
        process.exit(0);
    }

    await start();
}

start().catch(err => { console.error(err); process.exit(1); });
