import { useEffect, useState, useRef } from 'react';
import useDesignStore from '../../store/useDesignStore';

// Animated packet that flows along edge paths during simulation
function Packet({ color, duration, delay }) {
    return (
        <circle
            r="4"
            fill={color}
            opacity="0.9"
            style={{
                filter: `drop-shadow(0 0 6px ${color})`,
            }}
        >
            <animateMotion
                dur={`${duration}s`}
                begin={`${delay}s`}
                repeatCount="indefinite"
                fill="freeze"
            />
        </circle>
    );
}

export default function SimulationOverlay() {
    const { isSimulating, simulationSpeed, nodes, edges } = useDesignStore();
    const [packets, setPackets] = useState([]);
    const containerRef = useRef(null);

    useEffect(() => {
        if (!isSimulating || edges.length === 0) {
            setPackets([]);
            return;
        }

        // Generate packets for each edge
        const newPackets = edges.map((edge, index) => {
            const sourceNode = nodes.find((n) => n.id === edge.source);
            const color = edge.data?.color || sourceNode?.data?.color || '#818cf8';
            const baseDuration = 2 / simulationSpeed;

            return {
                id: `packet-${edge.id}-${index}`,
                edgeId: edge.id,
                color,
                duration: baseDuration + Math.random() * 0.5,
                delay: Math.random() * baseDuration,
            };
        });

        setPackets(newPackets);
    }, [isSimulating, simulationSpeed, edges, nodes]);

    if (!isSimulating || packets.length === 0) return null;

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 pointer-events-none z-10"
            aria-hidden="true"
        >
            {/* Simulation active indicator */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111827]/90 border border-[#818cf8]/30 backdrop-blur-sm">
                    <div className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse" />
                    <span className="text-[10px] font-mono text-[#94a3b8] tracking-wider uppercase">
                        Simulation Active
                    </span>
                </div>
            </div>
        </div>
    );
}
