import React, { useState, useEffect, useCallback, useRef } from 'react';

const ImageCarousel = ({ images = [], interval = 5000, height = '220px', alt = 'Travel', hoverOnly = false }) => {
    const [current, setCurrent] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const timerRef = useRef(null);

    const goTo = useCallback((index) => {
        setCurrent(index);
    }, []);

    // Determine if auto-play should be active
    const shouldAutoPlay = images.length > 1 && (hoverOnly ? isHovered : !isHovered);

    // Auto-advance
    useEffect(() => {
        if (!shouldAutoPlay) {
            clearInterval(timerRef.current);
            return;
        }

        timerRef.current = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, interval);

        return () => clearInterval(timerRef.current);
    }, [images.length, interval, shouldAutoPlay]);

    if (!images.length) return null;
    if (images.length === 1) {
        return (
            <div className="image-carousel" style={{ height }}>
                <img src={images[0]} alt={alt} className="carousel-image active" />
            </div>
        );
    }

    return (
        <div
            className="image-carousel"
            style={{ height }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setIsHovered(false); if (hoverOnly) setCurrent(0); }}
        >
            {images.map((src, i) => (
                <img
                    key={i}
                    src={src}
                    alt={`${alt} ${i + 1}`}
                    className={`carousel-image ${i === current ? 'active' : ''}`}
                />
            ))}

            {/* Dot indicators */}
            <div className="carousel-dots">
                {images.map((_, i) => (
                    <button
                        key={i}
                        className={`carousel-dot ${i === current ? 'active' : ''}`}
                        onClick={(e) => { e.stopPropagation(); goTo(i); }}
                        aria-label={`Go to image ${i + 1}`}
                    />
                ))}
            </div>

            {/* Progress bar */}
            {shouldAutoPlay && (
                <div className="carousel-progress">
                    <div
                        className="carousel-progress-bar"
                        key={current}
                        style={{ animationDuration: `${interval}ms` }}
                    />
                </div>
            )}
        </div>
    );
};

export default ImageCarousel;
