import React, { useEffect, useRef, useCallback } from 'react';
import createGlobe from 'cobe';

export const locationCoordinatesMap = {
    'Swiss Alps Ski Adventure': [46.56, 8.56],
    'Santorini Sunset Retreat': [36.39, 25.46],
    'Patagonia Wilderness Trek': [-50.94, -73.40],
    'Morocco Desert Adventure': [31.17, -7.98],
    'Maldives Luxury Escape': [3.20, 73.22],
    'Japan Cherry Blossom Tour': [35.68, 139.76],
    'Iceland Northern Lights Hunt': [64.14, -21.90],
    'Bali Cultural Odyssey': [-8.40, 115.18]
};

// Fallback markers when no packages are loaded
const DEFAULT_CITIES = [
    { id: 'loc-0', label: 'PARIS',      lat: 48.86,  lon: 2.35,    size: 0.06, home: true },
    { id: 'loc-1', label: 'NEW YORK',   lat: 40.71,  lon: -74.01,  size: 0.05 },
    { id: 'loc-2', label: 'TOKYO',      lat: 35.68,  lon: 139.76,  size: 0.05 },
    { id: 'loc-3', label: 'SYDNEY',     lat: -33.87, lon: 151.21,  size: 0.05 },
    { id: 'loc-4', label: 'DUBAI',      lat: 25.20,  lon: 55.27,   size: 0.05 },
];

const InteractiveGlobe = ({ packages, onLocationClick }) => {
    const wrapperRef = useRef(null);
    const canvasRef = useRef(null);
    const labelsRef = useRef(null);
    const globeRef = useRef(null);
    const animIdRef = useRef(null);
    const phiRef = useRef(0);
    const thetaRef = useRef(0.2);
    const isDraggingRef = useRef(false);
    const lastMouseRef = useRef({ x: 0, y: 0 });

    // Build cities from packages or use defaults
    const validPackages = packages ? packages.filter(pkg => locationCoordinatesMap[pkg.title]) : [];
    const hasPackages = validPackages.length > 0;

    const cities = hasPackages
        ? validPackages.map((pkg, idx) => ({
            id: `loc-${idx}`,
            label: (pkg.location || pkg.title.split(' ')[0]).toUpperCase(),
            lat: locationCoordinatesMap[pkg.title][0],
            lon: locationCoordinatesMap[pkg.title][1],
            size: 0.05,
        }))
        : DEFAULT_CITIES;

    // Build arcs: connect from the first (home) city to all others, or sequential loop
    const homeCity = cities[0];
    const arcs = cities.length > 1
        ? cities.filter(c => c.id !== homeCity.id).map(c => ({
            from: [homeCity.lat, homeCity.lon],
            to: [c.lat, c.lon],
            color: [0.77, 0.64, 0.35], // Gold arcs
        }))
        : [];

    const buildGlobe = useCallback(() => {
        const wrapper = wrapperRef.current;
        const canvas = canvasRef.current;
        const labelsWrapper = labelsRef.current;
        if (!wrapper || !canvas || !labelsWrapper) return;

        // Destroy previous instance
        if (globeRef.current) {
            globeRef.current.destroy();
            globeRef.current = null;
        }
        if (animIdRef.current) {
            cancelAnimationFrame(animIdRef.current);
            animIdRef.current = null;
        }

        const W = wrapper.offsetWidth;
        const H = wrapper.offsetHeight;

        canvas.width = W * 2;
        canvas.height = H * 2;
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        canvas.style.cursor = 'grab';

        // Create labels using CSS Anchor Positioning
        labelsWrapper.innerHTML = '';
        cities.forEach((c) => {
            const el = document.createElement('div');
            el.className = 'globe-label';
            el.textContent = c.label;
            el.dataset.cityId = c.id;
            el.style.cssText = `
                position-anchor: --cobe-${c.id};
                opacity: var(--cobe-visible-${c.id}, 0);
                filter: blur(calc((1 - var(--cobe-visible-${c.id}, 0)) * 6px));
            `;
            labelsWrapper.appendChild(el);
        });

        const globe = createGlobe(canvas, {
            devicePixelRatio: 2,
            width: W * 2,
            height: H * 2,
            phi: phiRef.current,
            theta: thetaRef.current,
            dark: 0,
            diffuse: 1.2,
            mapSamples: 20000,
            mapBrightness: 6,
            mapBaseBrightness: 0.08,
            baseColor: [0.3, 0.3, 0.3],
            markerColor: [0.1, 0.1, 0.1],
            glowColor: [1, 1, 1],
            markers: cities.map((c) => ({
                location: [c.lat, c.lon],
                size: c.size,
                id: c.id,
            })),
            arcs,
            arcColor: [0.77, 0.64, 0.35],
            arcWidth: 0.55,
            arcHeight: 0.22,
            scale: 1,
            opacity: 1,
        });

        globeRef.current = globe;

        // Animation loop
        function animate() {
            if (!isDraggingRef.current) {
                phiRef.current += 0.003;
                globe.update({ phi: phiRef.current });
            }
            animIdRef.current = requestAnimationFrame(animate);
        }
        animate();

        // --- Drag handlers ---
        const onMouseDown = (e) => {
            isDraggingRef.current = true;
            canvas.style.cursor = 'grabbing';
            lastMouseRef.current = { x: e.clientX, y: e.clientY };
        };

        const onTouchStart = (e) => {
            isDraggingRef.current = true;
            lastMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        };

        const onMouseMove = (e) => {
            if (!isDraggingRef.current) return;
            const dx = e.clientX - lastMouseRef.current.x;
            const dy = e.clientY - lastMouseRef.current.y;
            phiRef.current -= dx * 0.005;
            thetaRef.current = Math.max(
                -Math.PI / 2.5,
                Math.min(Math.PI / 2.5, thetaRef.current + dy * 0.005)
            );
            lastMouseRef.current = { x: e.clientX, y: e.clientY };
            globe.update({ phi: phiRef.current, theta: thetaRef.current });
        };

        const onTouchMove = (e) => {
            if (!isDraggingRef.current) return;
            const dx = e.touches[0].clientX - lastMouseRef.current.x;
            const dy = e.touches[0].clientY - lastMouseRef.current.y;
            phiRef.current -= dx * 0.005;
            thetaRef.current = Math.max(
                -Math.PI / 2.5,
                Math.min(Math.PI / 2.5, thetaRef.current + dy * 0.005)
            );
            lastMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            globe.update({ phi: phiRef.current, theta: thetaRef.current });
        };

        const onMouseUp = () => {
            isDraggingRef.current = false;
            canvas.style.cursor = 'grab';
        };

        const onTouchEnd = () => {
            isDraggingRef.current = false;
        };

        canvas.addEventListener('mousedown', onMouseDown);
        canvas.addEventListener('touchstart', onTouchStart, { passive: true });
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('touchmove', onTouchMove, { passive: true });
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('touchend', onTouchEnd);

        // Store cleanup references
        canvas._globeCleanup = () => {
            canvas.removeEventListener('mousedown', onMouseDown);
            canvas.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('touchend', onTouchEnd);
        };
    }, [cities, arcs, hasPackages]);

    useEffect(() => {
        buildGlobe();

        // Debounced resize handler
        let resizeTimer;
        const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(buildGlobe, 200);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(resizeTimer);
            if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
            if (canvasRef.current?._globeCleanup) canvasRef.current._globeCleanup();
            if (globeRef.current) {
                globeRef.current.destroy();
                globeRef.current = null;
            }
        };
    }, [buildGlobe]);

    // Handle label clicks
    const handleLabelClick = useCallback((e) => {
        if (!onLocationClick || !hasPackages) return;
        const label = e.target.closest('.globe-label');
        if (!label) return;
        const cityId = label.dataset.cityId;
        const idx = parseInt(cityId?.split('-')[1]);
        if (!isNaN(idx) && validPackages[idx]) {
            onLocationClick(validPackages[idx]);
        }
    }, [onLocationClick, hasPackages, validPackages]);

    return (
        <div
            ref={wrapperRef}
            className="globe-container"
            id="globe-wrapper"
        >
            <canvas
                id="globe-canvas"
                ref={canvasRef}
                className="globe-canvas"
            />
            <div
                id="globe-labels"
                ref={labelsRef}
                onClick={handleLabelClick}
            />
        </div>
    );
};

export default InteractiveGlobe;