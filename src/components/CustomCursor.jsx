import React, { useRef, useEffect, useCallback } from 'react';

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const pos = useRef({ x: 0, y: 0 });
    const target = useRef({ x: 0, y: 0 });
    const hovered = useRef(false);
    const rafId = useRef(null);
    const isVisible = useRef(true);
    const isAnimating = useRef(false);

    const lerp = (a, b, n) => a + (b - a) * n;

    const animate = useCallback(() => {
        if (!isVisible.current) {
            isAnimating.current = false;
            rafId.current = null;
            return;
        }

        pos.current.x = lerp(pos.current.x, target.current.x, 0.15);
        pos.current.y = lerp(pos.current.y, target.current.y, 0.15);

        if (cursorRef.current) {
            const size = hovered.current ? 48 : 16;
            const offset = size / 2;
            cursorRef.current.style.transform = `translate3d(${pos.current.x - offset}px, ${pos.current.y - offset}px, 0)`;
            cursorRef.current.style.width = `${size}px`;
            cursorRef.current.style.height = `${size}px`;
        }

        const dx = Math.abs(target.current.x - pos.current.x);
        const dy = Math.abs(target.current.y - pos.current.y);

        // Keep animating only while the cursor is catching up.
        if (dx > 0.2 || dy > 0.2) {
            rafId.current = requestAnimationFrame(animate);
        } else {
            isAnimating.current = false;
            rafId.current = null;
        }
    }, []);

    useEffect(() => {
        // Skip on touch devices
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (isTouch || prefersReducedMotion) return;

        const updateMousePosition = (e) => {
            target.current.x = e.clientX;
            target.current.y = e.clientY;

            if (!isAnimating.current && isVisible.current) {
                isAnimating.current = true;
                rafId.current = requestAnimationFrame(animate);
            }
        };

        const handleMouseOver = (e) => {
            hovered.current = !!(
                e.target.tagName === 'BUTTON' ||
                e.target.tagName === 'A' ||
                e.target.closest('.cursor-pointer')
            );

            if (!isAnimating.current && isVisible.current) {
                isAnimating.current = true;
                rafId.current = requestAnimationFrame(animate);
            }
        };

        const onVisibilityChange = () => {
            isVisible.current = !document.hidden;
            if (!isVisible.current && rafId.current) {
                cancelAnimationFrame(rafId.current);
                rafId.current = null;
                isAnimating.current = false;
            }
        };

        window.addEventListener('mousemove', updateMousePosition, { passive: true });
        window.addEventListener('mouseover', handleMouseOver, { passive: true });
        document.addEventListener('visibilitychange', onVisibilityChange);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            window.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('visibilitychange', onVisibilityChange);
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
