"use client";

import { useEffect, useState } from "react";

const PATH_DATA: Record<string, string> = {
    p1: "M100 120 L250 100",
    p2: "M250 100 L400 120",
    p3: "M100 120 L150 220",
    p4: "M250 100 L350 200",
    p5: "M400 120 L450 300",
    p6: "M150 220 L350 200",
    p7: "M350 200 L450 300",
    p8: "M150 220 L200 320",
    p9: "M350 200 L200 320",
};

interface HouseProps {
    x: number;
    y: number;
    solarCount?: number;
}

const House = ({ x, y, solarCount = 4 }: HouseProps) => (
    <g transform={`translate(${x - 30}, ${y - 35})`} stroke="#003d1e" strokeWidth="1.5">
        {/* Bigger Roof */}
        <path d="M30 15 L60 30 L30 45 L0 30 Z" fill="#ffffff" />
        {/* Bigger Side Walls */}
        <path d="M0 30 L30 45 L30 65 L0 50 Z" fill="#e1e3e4" />
        <path d="M30 45 L60 30 L60 50 L30 65 Z" fill="#f1f3f4" />
        {/* Bigger Solar Panel Array */}
        <g transform="translate(12, 18) rotate(26, 0, 0)">
            {Array.from({ length: solarCount }).map((_, i) => (
                <rect
                    key={i}
                    x={i * 8}
                    y={0}
                    width="6"
                    height="12"
                    fill="#2c3e50"
                    stroke="#34495e"
                    strokeWidth="0.8"
                    rx="1"
                />
            ))}
        </g>
    </g>
);

export function NeighborhoodMap() {
    const [activeTrades, setActiveTrades] = useState<{ id: number; pathId: string; speed: string }[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            const id = Date.now();
            const pathIds = Object.keys(PATH_DATA);
            const pathId = pathIds[Math.floor(Math.random() * pathIds.length)];
            const speed = (1.5 + Math.random() * 2).toFixed(1) + "s";

            setActiveTrades(prev => [...prev, { id, pathId, speed }].slice(-25));

            setTimeout(() => {
                setActiveTrades(prev => prev.filter(t => t.id !== id));
            }, 4000);
        }, 300);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-full bg-surface-low/30 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-5 pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(#006d37 1px, transparent 1px), linear-gradient(90deg, #006d37 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

            <svg
                viewBox="0 0 600 400"
                className="w-full h-full p-6 sm:p-10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <filter id="glow-v3" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Connection Network */}
                <g stroke="#e1e3e4" strokeWidth="2" strokeDasharray="4 4" opacity="0.5">
                    {Object.values(PATH_DATA).map((d, i) => (
                        <path key={i} d={d} />
                    ))}
                </g>

                {/* 24x7 Core Grid Flow (Infinite Replay) */}
                {Object.values(PATH_DATA).map((d, i) => (
                    <circle key={`core-${i}`} r="4" fill="#2ecc71" opacity="0.4" filter="url(#glow-v3)">
                        <animateMotion dur={`${3 + i}s`} repeatCount="indefinite" path={d} />
                    </circle>
                ))}

                {/* High-Frequency Dynamic Energy Pulses */}
                {activeTrades.map(trade => (
                    <circle key={trade.id} r="4.5" fill="#2ecc71" filter="url(#glow-v3)">
                        <animateMotion
                            dur={trade.speed}
                            path={PATH_DATA[trade.pathId]}
                            rotate="auto"
                            repeatCount="indefinite"
                        />
                    </circle>
                ))}

                {/* Even Bigger Neighborhood Houses */}
                <House x={100} y={120} solarCount={5} />
                <House x={250} y={100} solarCount={4} />
                <House x={400} y={120} solarCount={6} />
                <House x={150} y={220} solarCount={3} />
                <House x={350} y={200} solarCount={5} />
                <House x={200} y={320} solarCount={4} />
                <House x={450} y={300} solarCount={6} />

            </svg>

            {/* Live Status Overlays */}
            <div className="absolute bottom-6 left-6">
                <div className="glass px-5 py-2.5 rounded-full flex items-center gap-3 shadow-soft border border-outline-variant/30">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                    <span className="label-md text-on-surface text-[12px] font-bold tracking-widest">WATT_GRID ACTIVE</span>
                </div>
            </div>

            <div className="absolute top-6 right-6 flex flex-col gap-2 origin-top-right">
                <div className="glass px-5 py-4 rounded-2xl shadow-soft border border-outline-variant/40 text-right min-w-[140px]">
                    <p className="label-md text-[10px] text-on-surface-variant font-black tracking-widest mb-1.5 uppercase">Network Nodes</p>
                    <p className="headline-sm text-primary leading-none text-2xl">128 Online</p>
                </div>
                <div className="glass px-5 py-2.5 rounded-xl shadow-soft border border-outline-variant/20 text-right">
                    <p className="label-md text-[9px] text-on-surface-variant font-bold mb-0.5">PEAK FLOW</p>
                    <p className="body-md font-black text-secondary leading-none">24.8 kWh</p>
                </div>
            </div>
        </div>
    );
}
