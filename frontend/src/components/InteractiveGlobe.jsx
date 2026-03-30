import React, { useEffect, useRef, useState } from 'react';
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

const InteractiveGlobe = ({ packages }) => {
    const canvasRef = useRef(null);

    const validPackages = packages ? packages.filter(pkg => locationCoordinatesMap[pkg.title]) : [];

    useEffect(() => {
        if (!canvasRef.current || validPackages.length === 0) return;

        let phi = 0;

        const markers = validPackages.map((pkg, idx) => {
            const coords = locationCoordinatesMap[pkg.title];
            return { 
                location: coords, 
                size: 0.04, 
                id: `loc-${idx}`
            };
        });

        const arcs = validPackages.length > 1 ? [
            {
                from: locationCoordinatesMap[validPackages[0].title],
                to: locationCoordinatesMap[validPackages[1].title],
                color: [1, 0.5, 0.5],
                id: `arc-0`
            }
        ] : [];

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
            markerColor: [1, 0.5, 1],       
            glowColor: [1, 1, 1],           
            offset: [0, 0],
            markers: markers,
            arcs: arcs,
            arcColor: [1, 0.5, 1],
            arcWidth: 0.5,
            arcHeight: 0.3,
            markerElevation: 0.02,
            onRender: (state) => {
                state.phi = phi;
                phi += 0.005; 
            }
        });

        return () => {
            globe.destroy();
        };
    }, [validPackages]); 

    return (
        <div style={{ position: 'relative', width: 500, height: 500, margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
            
            <canvas
                id="cobe"
                ref={canvasRef}
                style={{ width: "500px", height: "500px" }}
                width="1000"
                height="1000"
            />

            <style>
                {`
                    .marker-label {
                        position: absolute;
                        background: #1a1a1a;
                        color: white;
                        padding: 4px 8px;
                        border-radius: 4px;
                        font-family: inherit;
                        font-size: 10px;
                        font-weight: 600;
                        text-transform: uppercase;
                        letter-spacing: 0.1em;
                        white-space: nowrap;
                        pointer-events: none;
                        bottom: anchor(top);
                        left: anchor(center);
                        transform: translate(-50%, -10px);
                        transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), filter 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    }
                    
                    ${validPackages.map((_, idx) => `
                        #label-loc-${idx} {
                            position-anchor: --cobe-loc-${idx};
                            opacity: var(--cobe-visible-loc-${idx}, 0);
                            filter: blur(calc((1 - var(--cobe-visible-loc-${idx}, 0)) * 8px));
                        }
                    `).join('')}
                `}
            </style>

            {validPackages.map((pkg, idx) => (
                <div 
                    key={`loc-${idx}`}
                    id={`label-loc-${idx}`}
                    className="marker-label"
                >
                    {pkg.location || pkg.title.split(' ')[0]}
                </div>
            ))}

        </div>
    );
};

export default InteractiveGlobe;