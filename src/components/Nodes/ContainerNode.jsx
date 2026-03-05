import { memo, useState, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { motion } from 'framer-motion';
import useDesignStore from '../../store/useDesignStore';

const ContainerNode = memo(({ id, data, selected }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editLabel, setEditLabel] = useState(data.label || '');
    const updateNode = useDesignStore((s) => s.updateNode);
    const color = data.color || '#38bdf8';

    const handleDoubleClick = useCallback(() => {
        setEditLabel(data.label || '');
        setIsEditing(true);
    }, [data.label]);

    const handleLabelSubmit = useCallback(() => {
        updateNode(id, { data: { label: editLabel } });
        setIsEditing(false);
    }, [id, editLabel, updateNode]);

    return (
        <>
            <Handle type="target" position={Position.Top} style={{ background: color }} />
            <Handle type="target" position={Position.Left} style={{ background: color }} />

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onDoubleClick={handleDoubleClick}
                className={`relative px-3 py-2 rounded-lg min-w-[120px] cursor-pointer ${selected ? 'animated-gradient-border node-selected-glow' : ''
                    }`}
                style={{
                    background: '#111827',
                    border: `1px solid ${selected ? color : `${color}33`}`,
                    boxShadow: selected ? `0 0 12px ${color}30` : 'none',
                }}
            >
                <div className="flex items-center gap-2">
                    <span className="text-sm">🐳</span>
                    <div className="flex-1 min-w-0">
                        {isEditing ? (
                            <input
                                autoFocus
                                value={editLabel}
                                onChange={(e) => setEditLabel(e.target.value)}
                                onBlur={handleLabelSubmit}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleLabelSubmit();
                                    if (e.key === 'Escape') setIsEditing(false);
                                    e.stopPropagation();
                                }}
                                className="w-full bg-[#0b0f1a] border border-[#38bdf8]/50 rounded px-1 py-0.5 text-[10px] text-[#e2e8f0] font-mono focus:outline-none"
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <p className="text-[10px] font-semibold text-[#e2e8f0] truncate font-mono">
                                {data.label}
                            </p>
                        )}
                        {data.port && (
                            <p className="text-[9px] text-[#64748b] font-mono">:{data.port}</p>
                        )}
                    </div>
                </div>
            </motion.div>

            <Handle type="source" position={Position.Bottom} style={{ background: color }} />
            <Handle type="source" position={Position.Right} style={{ background: color }} />
        </>
    );
});

ContainerNode.displayName = 'ContainerNode';
export default ContainerNode;
