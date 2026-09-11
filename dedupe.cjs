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
    
    // Count occurrences of import { motion }
    let motionMatches = content.match(/import\s*\{\s*motion\s*\}\s*from\s*['"]framer-motion['"];?/g);
    let motionPresMatches = content.match(/import\s*\{\s*motion,\s*AnimatePresence\s*\}\s*from\s*['"]framer-motion['"];?/g);
    
    let total = (motionMatches ? motionMatches.length : 0) + (motionPresMatches ? motionPresMatches.length : 0);
    
    if (total > 1) {
        // Replace all but first
        let found = false;
        let lines = content.split('\n');
        let newLines = [];
        for (let line of lines) {
            if (line.includes("import { motion } from 'framer-motion'") || 
                line.includes('import { motion } from "framer-motion"') ||
                line.includes("import { motion, AnimatePresence } from 'framer-motion'") ||
                line.includes('import { motion, AnimatePresence } from "framer-motion"')) {
                if (!found) {
                    found = true;
                    newLines.push(line);
                }
            } else {
                newLines.push(line);
            }
        }
        content = newLines.join('\n');
    }

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log('Fixed duplicates in', file);
    }
});
