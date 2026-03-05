import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import '@reactflow/node-resizer/dist/style.css';

const groupTypeStyles = {
    vpc: {
        borderStyle: 'dashed',
        borderColor: '#818cf8',
        bgColor: 'rgba(129, 140, 248, 0.03)',
        label: 'VPC',
        icon: '🏗️',
    },
    subnet: {
        borderStyle: 'dashed',
        borderColor: '#60a5fa',
        bgColor: 'rgba(96, 165, 250, 0.03)',
        label: 'Subnet',
        icon: '📡',
    },
    kubernetes: {
        borderStyle: 'solid',
        borderColor: '#326CE5',
        bgColor: 'rgba(50, 108, 229, 0.03)',
        label: 'K8s Cluster',
        icon: '☸️',
    },
};

const GroupNode = memo(({ id, data, selected }) => {
    const compId = data.componentId || 'vpc';
    const style = groupTypeStyles[compId] || groupTypeStyles.vpc;
    const label = data.label || style.label;

    return (
        <>
            <NodeResizer
                color={style.borderColor}
                isVisible={selected}
                minWidth={200}
                minHeight={150}
                handleStyle={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    background: style.borderColor,
                    border: 'none',
                }}
            />

            <Handle type="target" position={Position.Top} className="!bg-transparent !border-0 !w-3 !h-3" style={{ background: style.borderColor }} />
            <Handle type="target" position={Position.Left} className="!bg-transparent !border-0 !w-3 !h-3" style={{ background: style.borderColor }} />

            <div
                className="group-node w-full h-full rounded-xl relative"
                style={{
                    background: style.bgColor,
                    border: `2px ${style.borderStyle} ${selected ? style.borderColor : `${style.borderColor}66`}`,
                    boxShadow: selected ? `0 0 20px ${style.borderColor}20` : 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
            >
                {/* Label */}
                <div
                    className="absolute top-2 left-3 flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-mono font-semibold"
                    style={{
                        color: style.borderColor,
                        background: `${style.borderColor}15`,
                    }}
                >
                    <span>{style.icon}</span>
                    <span>{label}</span>
                </div>
            </div>

            <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0 !w-3 !h-3" style={{ background: style.borderColor }} />
            <Handle type="source" position={Position.Right} className="!bg-transparent !border-0 !w-3 !h-3" style={{ background: style.borderColor }} />
        </>
    );
});

GroupNode.displayName = 'GroupNode';
export default GroupNode;
