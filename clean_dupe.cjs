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

    let lines = content.split('\n');
    let hasOtherMotion = false;
    let exactMotionIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.includes("import { motion } from 'framer-motion';") || line.includes('import { motion } from "framer-motion";')) {
            if (exactMotionIndex === -1) {
                exactMotionIndex = i;
            } else {
                hasOtherMotion = true;
            }
        } else if (line.includes('framer-motion') && line.includes('motion')) {
            hasOtherMotion = true;
        }
    }
    
    if (exactMotionIndex !== -1 && hasOtherMotion) {
        lines.splice(exactMotionIndex, 1);
        content = lines.join('\n');
        fs.writeFileSync(file, content);
        console.log('Fixed', file);
    }
});
