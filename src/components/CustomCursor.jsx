import React, { useRef, useEffect, useCallback } from 'react';

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const pos = useRef({ x: 0, y: 0 });
    const target = useRef({ x: 0, y: 0 });
    const hovered = useRef(false);
    const rafId = useRef(null);

    const lerp = (a, b, n) => a + (b - a) * n;

    const animate = useCallback(() => {
        pos.current.x = lerp(pos.current.x, target.current.x, 0.15);
        pos.current.y = lerp(pos.current.y, target.current.y, 0.15);

        if (cursorRef.current) {
            const size = hovered.current ? 48 : 16;
            const offset = size / 2;
            cursorRef.current.style.transform = `translate3d(${pos.current.x - offset}px, ${pos.current.y - offset}px, 0)`;
            cursorRef.current.style.width = `${size}px`;
            cursorRef.current.style.height = `${size}px`;
        }

        rafId.current = requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
        // Skip on touch devices
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouch) return;

        const updateMousePosition = (e) => {
            target.current.x = e.clientX;
            target.current.y = e.clientY;
        };

        const handleMouseOver = (e) => {
            hovered.current = !!(
                e.target.tagName === 'BUTTON' ||
                e.target.tagName === 'A' ||
                e.target.closest('.cursor-pointer')
            );
        };

        window.addEventListener('mousemove', updateMousePosition, { passive: true });
        window.addEventListener('mouseover', handleMouseOver, { passive: true });
        rafId.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            window.removeEventListener('mouseover', handleMouseOver);
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, [animate]);

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 w-4 h-4 rounded-full bg-white z-[100] pointer-events-none mix-blend-difference hidden md:block"
            style={{ willChange: 'transform', transition: 'width 0.2s, height 0.2s' }}
        />
    );
};

export default CustomCursor;
