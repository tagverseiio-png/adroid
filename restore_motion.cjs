const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        if (fs.statSync(dirPath).isDirectory()) {
            walk(dirPath, callback);
        } else if (dirPath.endsWith('.jsx')) {
            callback(dirPath);
        }
    });
}

walk('src', (file) => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Check if it uses <motion.
    if (content.includes('<motion.')) {
        // Check if it's missing import { motion
        if (!content.includes('import { motion') && !content.includes('import {motion')) {
            // Check if it has import { AnimatePresence } from 'framer-motion'
            if (content.includes("import { AnimatePresence } from 'framer-motion'") || content.includes('import { AnimatePresence } from "framer-motion"')) {
                content = content.replace(/import\s*\{\s*AnimatePresence\s*\}\s*from\s*['"]framer-motion['"];/, "import { motion, AnimatePresence } from 'framer-motion';");
            } else {
                // Just add it after the React import
                content = content.replace(/import React.*?['"]react['"];?\r?\n/, "$&import { motion } from 'framer-motion';\n");
                // If it didn't find React import, add to top
                if (content === original) {
                    content = content.replace(/import /, "import { motion } from 'framer-motion';\nimport ");
                }
            }
        }
    }

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log('Restored motion in', file);
    }
});
