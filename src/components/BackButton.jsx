import React from 'react';
import { ChevronLeft } from 'lucide-react';

/**
 * Mobile-only back button (hidden on screens >= 769px via CSS).
 * Accepts an `onBack` callback prop; if not provided, uses window.history.back().
 */
const BackButton = ({ onBack }) => {
    const handleBack = () => {
        if (typeof onBack === 'function') {
            onBack();
        } else {
            window.history.back();
        }
    };

    return (
        <>
            <style>{`
                .mobile-back-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: fixed;
                    top: 16px;
                    left: 16px;
                    z-index: 999;
                    width: 38px;
                    height: 38px;
                    border-radius: 50%;
                    background: rgba(10, 10, 10, 0.75);
                    border: 1px solid rgba(197, 160, 89, 0.4);
                    cursor: pointer;
                    color: #fff;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.5);
                    backdrop-filter: blur(6px);
                    transition: background 0.2s, transform 0.15s;
                    -webkit-tap-highlight-color: transparent;
                }
                .mobile-back-btn:active {
                    transform: scale(0.92);
                    background: rgba(197, 160, 89, 0.85);
                }
                @media (min-width: 769px) {
                    .mobile-back-btn {
                        display: none !important;
                    }
                }
            `}</style>
            <button
                className="mobile-back-btn"
                onClick={handleBack}
                aria-label="Go back"
            >
                <ChevronLeft size={20} strokeWidth={2.5} />
            </button>
        </>
    );
};

export default BackButton;
