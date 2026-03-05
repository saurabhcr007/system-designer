import { memo, useState, useCallback, useEffect, useRef } from 'react';
import { getBezierPath, EdgeLabelRenderer } from 'reactflow';
import useDesignStore from '../../store/useDesignStore';

const edgeStyles = {
    sync: { strokeDasharray: 'none', strokeWidth: 2 },
    async: { strokeDasharray: '8 4', strokeWidth: 2 },
    'db-query': { strokeDasharray: '2 4', strokeWidth: 2 },
    grpc: { strokeDasharray: 'none', strokeWidth: 3 },
};

// Traffic level → color mapping
function getTrafficColor(trafficLevel) {
    if (trafficLevel >= 0.7) return '#f87171'; // Red — high traffic
    if (trafficLevel >= 0.35) return '#fbbf24'; // Yellow — moderate
    return '#4ade80'; // Green — normal
}

// Animated dot component that travels along an SVG path
function TravelingDot({ pathId, color, duration, delay, size = 4 }) {
    const animRef = useRef(null);

    useEffect(() => {
        if (animRef.current) {
            try {
                // Manually start animation to avoid SVG document timeline async bugs
                animRef.current.beginElement();
            } catch (e) {
                // Ignore in testing environments
            }
        }
    }, []);

    return (
        <circle r={size} fill={color} opacity="0.95" style={{ filter: `drop-shadow(0 0 4px ${color})` }}>
            <animateMotion
                ref={animRef}
                dur={`${duration}s`}
                begin="indefinite"
                repeatCount="1"
                fill="freeze"
                rotate="auto"
            >
                <mpath xlinkHref={`#${pathId}`} />
            </animateMotion>
        </circle>
    );
}

const CustomEdge = memo(({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    selected,
    markerEnd,
}) => {
    const [isEditingLabel, setIsEditingLabel] = useState(false);
    const [labelText, setLabelText] = useState(data?.label || '');
    const updateEdge = useDesignStore((s) => s.updateEdge);
    const isSimulating = useDesignStore((s) => s.isSimulating);
    const simulationSpeed = useDesignStore((s) => s.simulationSpeed);

    const baseColor = data?.color || '#818cf8';
    const edgeType = data?.edgeType || 'sync';
    const style = edgeStyles[edgeType] || edgeStyles.sync;

    const activePackets = useDesignStore((s) => s.activePackets).filter(p => p.edgeId === id);

    // Old manual traffic mapping is replaced by exact discrete packets from the engine.
    const trafficColor = baseColor;
    const trafficLevel = data?.trafficLevel || 0;

    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const handleLabelDoubleClick = useCallback((e) => {
        e.stopPropagation();
        setLabelText(data?.label || '');
        setIsEditingLabel(true);
    }, [data?.label]);

    const handleLabelSubmit = useCallback(() => {
        updateEdge(id, { data: { label: labelText } });
        setIsEditingLabel(false);
    }, [id, labelText, updateEdge]);

    const pathElementId = `edge-path-${id}`;
    const baseDuration = 2 / simulationSpeed;

    return (
        <>
            {/* Main visible edge path */}
            <path
                id={pathElementId}
                className={`react-flow__edge-path`}
                d={edgePath}
                fill="none"
                stroke={selected ? '#e2e8f0' : (isSimulating ? trafficColor : baseColor)}
                strokeWidth={style.strokeWidth}
                strokeDasharray={style.strokeDasharray}
                markerEnd={markerEnd}
                style={{
                    filter: selected ? `drop-shadow(0 0 4px ${baseColor})` : 'none',
                    transition: 'stroke 0.5s ease, filter 0.2s',
                }}
            />

            {/* Interactive edge area (wider hit target) */}
            <path
                d={edgePath}
                fill="none"
                stroke="transparent"
                strokeWidth={20}
            />

            {/* Animated exact packets during simulation */}
            {isSimulating && activePackets.length > 0 && (
                <>
                    {activePackets.map((packet) => (
                        <TravelingDot
                            key={packet.id}
                            pathId={pathElementId}
                            color={packet.color}
                            duration={packet.duration / 1000} // ms to seconds for SVG
                            delay={0}
                            size={5}
                        />
                    ))}
                </>
            )}

            {/* Edge Label */}
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        pointerEvents: 'all',
                    }}
                    className="nodrag nopan"
                    onDoubleClick={handleLabelDoubleClick}
                >
                    {isEditingLabel ? (
                        <input
                            autoFocus
                            value={labelText}
                            onChange={(e) => setLabelText(e.target.value)}
                            onBlur={handleLabelSubmit}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleLabelSubmit();
                                if (e.key === 'Escape') setIsEditingLabel(false);
                            }}
                            className="px-2 py-0.5 bg-[#111827] border border-[#818cf8]/50 rounded text-[10px] text-[#e2e8f0] font-mono focus:outline-none min-w-[60px] text-center"
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : data?.label ? (
                        <div
                            className="px-2 py-0.5 bg-[#111827]/90 border border-[#1e2433] rounded text-[10px] text-[#94a3b8] font-mono cursor-pointer hover:text-[#e2e8f0] hover:border-[#818cf8]/30 transition-all"
                        >
                            {data.label}
                        </div>
                    ) : null}
                </div>
            </EdgeLabelRenderer>
        </>
    );
});

CustomEdge.displayName = 'CustomEdge';
export default CustomEdge;
