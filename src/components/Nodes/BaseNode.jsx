import { memo, useState, useCallback, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { motion, AnimatePresence } from 'framer-motion';
import useDesignStore from '../../store/useDesignStore';

const BaseNode = memo(({ id, data, selected }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editLabel, setEditLabel] = useState(data.label || '');
    const updateNode = useDesignStore((s) => s.updateNode);
    const isSimulating = useDesignStore((s) => s.isSimulating);
    const chaosNodeIds = useDesignStore((s) => s.chaosNodeIds);
    const processingNodeIds = useDesignStore((s) => s.processingNodeIds);
    const nodeSimState = useDesignStore(useCallback((s) => s.nodeSimState[id], [id]));

    const isChaosAffected = chaosNodeIds.includes(id);
    const isProcessing = processingNodeIds.includes(id);
    const stress = nodeSimState?.stress || 0;
    const isOverloaded = nodeSimState?.isOverloaded || false;
    const currentRPS = nodeSimState?.currentRPS || 0;
    const stressColor = nodeSimState?.stressColor || data.color || '#818cf8';

    const [pulse, setPulse] = useState(false);
    const prevProcessing = useRef(false);

    useEffect(() => {
        if (isProcessing && !prevProcessing.current) {
            setPulse(true);
            const t = setTimeout(() => setPulse(false), 400);
            return () => clearTimeout(t);
        }
        prevProcessing.current = isProcessing;
    }, [isProcessing]);

    const color = data.color || '#818cf8';

    const handleDoubleClick = useCallback(() => {
        setEditLabel(data.label || '');
        setIsEditing(true);
    }, [data.label]);

    const handleLabelSubmit = useCallback(() => {
        updateNode(id, { data: { label: editLabel } });
        setIsEditing(false);
    }, [id, editLabel, updateNode]);

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === 'Enter') handleLabelSubmit();
            if (e.key === 'Escape') setIsEditing(false);
            e.stopPropagation();
        },
        [handleLabelSubmit]
    );

    return (
        <>
            <Handle type="target" position={Position.Top} className="!bg-transparent !border-0 !w-3 !h-3" style={{ background: color, borderColor: color }} />
            <Handle type="target" position={Position.Left} className="!bg-transparent !border-0 !w-3 !h-3" style={{ background: color, borderColor: color }} />

            <div
                onDoubleClick={handleDoubleClick}
                className={`base-node relative px-4 py-3 rounded-xl min-w-[140px] cursor-pointer 
                    ${isChaosAffected ? 'chaos-flash' : ''} 
                    ${selected ? 'node-selected' : ''}
                    ${isSimulating && stress > 0.8 ? 'node-critical-pulse' : ''}
                    ${isSimulating && isOverloaded ? 'node-overload-shake' : ''}
                `}
                style={{
                    background: 'linear-gradient(135deg, rgba(17,24,39,0.95), rgba(15,20,35,0.95))',
                    border: `1px solid ${isSimulating ? stressColor : (selected ? color : `${color}25`)}`,
                    boxShadow: isSimulating
                        ? (stress > 0.8
                            ? `0 0 24px 8px ${stressColor}99, 0 0 48px 12px ${stressColor}33`
                            : stress > 0.6
                                ? `0 0 16px 5px ${stressColor}88`
                                : stress > 0.3
                                    ? `0 0 10px 3px ${stressColor}66`
                                    : `0 0 6px 1px ${stressColor}44`)
                        : (selected
                            ? `0 0 20px ${color}30, 0 0 40px ${color}10`
                            : `0 2px 8px rgba(0,0,0,0.3)`),
                    transition: 'border-color 0.4s ease, box-shadow 0.4s ease, transform 0.2s ease',
                }}
            >
                {/* Stress Badge */}
                {isSimulating && (
                    <div
                        className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full flex items-center gap-1 border border-white/5 backdrop-blur-md z-10 transition-all duration-500"
                        style={{
                            background: `${stressColor}22`,
                            borderColor: `${stressColor}44`,
                            opacity: stress > 0.05 ? 1 : 0,
                            transform: `scale(${stress > 0.05 ? 1 : 0.8})`
                        }}
                    >
                        <span className="text-[8px]">
                            {stress > 0.8 ? '🔴' : stress > 0.6 ? '🟠' : stress > 0.3 ? '🟡' : '🟢'}
                        </span>
                        <span className="text-[9px] font-mono font-bold" style={{ color: stressColor }}>
                            {currentRPS} <span className="text-[7px] opacity-70">RPS</span>
                        </span>
                    </div>
                )}
                {/* Entry point indicator */}
                {data.isEntryPoint && (
                    <div
                        className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full border-2 border-[#111827]"
                        style={{ background: '#4ade80', boxShadow: '0 0 8px #4ade8060' }}
                        title="Entry Point"
                    />
                )}

                {/* Processing Spinner */}
                {isProcessing && (
                    <div className="absolute top-1 right-1 w-3 h-3 rounded-full border border-white/10 border-t-[#818cf8] animate-spin" />
                )}

                {/* Arrival Pulse Animation */}
                <AnimatePresence>
                    {pulse && (
                        <motion.div
                            initial={{ scale: 1, opacity: 0.8 }}
                            animate={{ scale: 1.4, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                            className="absolute inset-0 rounded-xl pointer-events-none"
                            style={{ border: `2px solid ${color}` }}
                        />
                    )}
                </AnimatePresence>

                {/* Icon + Label */}
                <div className="flex items-center gap-2.5">
                    <span className="text-lg shrink-0 drop-shadow-sm">{data.icon || '📦'}</span>
                    <div className="flex-1 min-w-0">
                        {isEditing ? (
                            <input
                                autoFocus
                                value={editLabel}
                                onChange={(e) => setEditLabel(e.target.value)}
                                onBlur={handleLabelSubmit}
                                onKeyDown={handleKeyDown}
                                className="w-full bg-[#0b0f1a] border border-[#818cf8]/50 rounded px-1.5 py-0.5 text-xs text-white/90 font-mono focus:outline-none"
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <>
                                <p className="text-xs font-semibold text-white/90 truncate font-mono leading-tight flex items-center gap-1">
                                    {data.label}
                                    {isSimulating && isOverloaded && (
                                        <span className="text-[9px] text-red-500 animate-pulse whitespace-nowrap">
                                            ⚠ OVERLOADED
                                        </span>
                                    )}
                                </p>
                                {data.technology && (
                                    <p className="text-[10px] text-white/30 truncate mt-0.5">{data.technology}</p>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Entry node persistent glow when simulating */}
                {isSimulating && data.isEntryPoint && (
                    <div
                        className="absolute inset-0 rounded-xl pointer-events-none entry-pulse"
                        style={{ boxShadow: `0 0 24px ${color}40` }}
                    />
                )}
            </div>

            <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0 !w-3 !h-3" style={{ background: color, borderColor: color }} />
            <Handle type="source" position={Position.Right} className="!bg-transparent !border-0 !w-3 !h-3" style={{ background: color, borderColor: color }} />
        </>
    );
});

BaseNode.displayName = 'BaseNode';
export default BaseNode;
