const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const { query } = require('../config/database');

// Setup multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../../../public/uploads/lp');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.]/g, ''));
    }
});
const upload = multer({ storage });

// POST upload media (Admin)
router.post('/', auth, upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    try {
        const url = `/uploads/lp/${req.file.filename}`;
        const result = await query(
            'INSERT INTO landing_page_media (filename, url) VALUES ($1, $2) RETURNING *',
            [req.file.originalname, url]
        );
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET all media (Admin)
router.get('/', auth, async (req, res) => {
    try {
        const result = await query('SELECT * FROM landing_page_media ORDER BY created_at DESC');
        res.json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE media (Admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        const current = await query('SELECT * FROM landing_page_media WHERE id = $1', [req.params.id]);
        if (current.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
        
        const fileUrl = current.rows[0].url;
        const filePath = path.join(__dirname, '../../../public', fileUrl);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await query('DELETE FROM landing_page_media WHERE id = $1', [req.params.id]);
        res.json({ success: true, message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
