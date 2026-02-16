import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        const updateMousePosition = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('.cursor-pointer')) {
                setHovered(true);
            } else {
                setHovered(false);
            }
        };

        window.addEventListener('mousemove', updateMousePosition);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    return (
        <motion.div
            className="fixed top-0 left-0 w-4 h-4 rounded-full bg-white z-[100] pointer-events-none mix-blend-difference hidden md:block"
            animate={{
                x: mousePosition.x - (hovered ? 24 : 8),
                y: mousePosition.y - (hovered ? 24 : 8),
                scale: hovered ? 3 : 1,
            }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.5 }}
        />
    );
};

export default CustomCursor;
