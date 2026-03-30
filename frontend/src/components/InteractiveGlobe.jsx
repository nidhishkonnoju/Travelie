import React, { useEffect, useRef } from 'react';
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
const DEFAULT_MARKERS = [
    { location: [48.86, 2.35], size: 0.04, id: 'loc-0' },       // Paris
    { location: [40.71, -74.01], size: 0.04, id: 'loc-1' },      // NYC
    { location: [35.68, 139.76], size: 0.04, id: 'loc-2' },      // Tokyo
    { location: [-33.87, 151.21], size: 0.04, id: 'loc-3' },     // Sydney
    { location: [25.20, 55.27], size: 0.04, id: 'loc-4' },       // Dubai
];

const DEFAULT_LABELS = {
    'loc-0': 'PARIS',
    'loc-1': 'NEW YORK',
    'loc-2': 'TOKYO',
    'loc-3': 'SYDNEY',
    'loc-4': 'DUBAI',
};

const DEFAULT_ARCS = [
    { from: [48.86, 2.35], to: [40.71, -74.01], color: [0.77, 0.64, 0.35] },
    { from: [40.71, -74.01], to: [35.68, 139.76], color: [0.77, 0.64, 0.35] },
    { from: [35.68, 139.76], to: [-33.87, 151.21], color: [0.77, 0.64, 0.35] },
    { from: [-33.87, 151.21], to: [25.20, 55.27], color: [0.77, 0.64, 0.35] },
    { from: [25.20, 55.27], to: [48.86, 2.35], color: [0.77, 0.64, 0.35] },
];

const InteractiveGlobe = ({ packages, onLocationClick }) => {
    const canvasRef = useRef(null);
    const globeRef = useRef(null);
    const phiRef = useRef(0);

    // Build markers and arcs from packages
    const validPackages = packages ? packages.filter(pkg => locationCoordinatesMap[pkg.title]) : [];
    const hasPackages = validPackages.length > 0;

    const markers = hasPackages
        ? validPackages.map((pkg, idx) => ({
            location: locationCoordinatesMap[pkg.title],
            size: 0.05,
            id: `loc-${idx}`,
        }))
        : DEFAULT_MARKERS;

    // Build arc network: connect sequential destinations in a loop
    const arcs = hasPackages && validPackages.length > 1
        ? (() => {
            const result = [];
            for (let i = 0; i < validPackages.length; i++) {
                const fromCoords = locationCoordinatesMap[validPackages[i].title];
                const toCoords = locationCoordinatesMap[validPackages[(i + 1) % validPackages.length].title];
                if (fromCoords && toCoords) {
                    result.push({ from: fromCoords, to: toCoords, color: [0.77, 0.64, 0.35] });
                }
            }
            return result;
        })()
        : DEFAULT_ARCS;

    // Labels for the marker tags
    const labels = hasPackages
        ? Object.fromEntries(validPackages.map((pkg, idx) => [
            `loc-${idx}`,
            (pkg.location || pkg.title.split(' ')[0]).toUpperCase()
        ]))
        : DEFAULT_LABELS;

    useEffect(() => {
        if (!canvasRef.current) return;

        // Destroy previous instance
        if (globeRef.current) {
            globeRef.current.destroy();
            globeRef.current = null;
        }

        try {
            const globe = createGlobe(canvasRef.current, {
                devicePixelRatio: 2,
                width: 1000,
                height: 1000,
                phi: 0,
                theta: 0,
                dark: 0,
                diffuse: 1.2,
                scale: 1,
                mapSamples: 16000,
                mapBrightness: 6,
                baseColor: [0.3, 0.3, 0.3],
                markerColor: [0.1, 0.1, 0.1],
                glowColor: [1, 1, 1],
                offset: [0, 0],
                markers: markers,
                arcs: arcs,
                arcColor: [0.77, 0.64, 0.35],
                arcWidth: 0.4,
                arcHeight: 0.3,
                markerElevation: 0.02,
                onRender: (state) => {
                    state.phi = phiRef.current;
                    phiRef.current += 0.003;
                },
            });
            globeRef.current = globe;
        } catch (err) {
            console.error('Globe creation failed:', err);
        }

        return () => {
            if (globeRef.current) {
                globeRef.current.destroy();
                globeRef.current = null;
            }
        };
    }, [hasPackages]);

    const markerIds = Object.keys(labels);

    return (
        <div className="globe-container">
            <canvas
                id="cobe"
                ref={canvasRef}
                className="globe-canvas"
                width="1000"
                height="1000"
            />

            {/* CSS Anchor-Positioned Labels */}
            <style>
                {`
                    .globe-container {
                        position: relative;
                        width: 500px;
                        height: 500px;
                        margin: 0 auto;
                    }
                    .globe-canvas {
                        width: 500px;
                        height: 500px;
                    }
                    .globe-label {
                        position: absolute;
                        background: #1a1a1a;
                        color: #ffffff;
                        padding: 4px 10px;
                        font-family: var(--font-body, system-ui);
                        font-size: 9px;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 0.15em;
                        white-space: nowrap;
                        pointer-events: none;
                        z-index: 10;
                        transition: 
                            opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                            filter 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    }
                    .globe-label::before {
                        content: '';
                        position: absolute;
                        bottom: -4px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 0;
                        height: 0;
                        border-left: 4px solid transparent;
                        border-right: 4px solid transparent;
                        border-top: 4px solid #1a1a1a;
                    }

                    /* CSS Anchor Positioning for each marker */
                    ${markerIds.map(id => `
                        #globe-label-${id} {
                            position-anchor: --cobe-${id};
                            bottom: anchor(top);
                            left: anchor(center);
                            transform: translate(-50%, -10px);
                            opacity: var(--cobe-visible-${id}, 0);
                            filter: blur(calc((1 - var(--cobe-visible-${id}, 0)) * 6px));
                        }
                    `).join('')}

                    /* Responsive sizing */
                    @media (max-width: 560px) {
                        .globe-container {
                            width: 340px;
                            height: 340px;
                        }
                        .globe-canvas {
                            width: 340px;
                            height: 340px;
                        }
                    }
                `}
            </style>

            {markerIds.map(id => (
                <div
                    key={id}
                    id={`globe-label-${id}`}
                    className="globe-label"
                    onClick={() => {
                        if (onLocationClick && hasPackages) {
                            const idx = parseInt(id.split('-')[1]);
                            if (!isNaN(idx) && validPackages[idx]) {
                                onLocationClick(validPackages[idx]);
                            }
                        }
                    }}
                    style={{ 
                        pointerEvents: onLocationClick && hasPackages ? 'auto' : 'none',
                        cursor: onLocationClick && hasPackages ? 'pointer' : 'default'
                    }}
                >
                    {labels[id]}
                </div>
            ))}
        </div>
    );
};

export default InteractiveGlobe;