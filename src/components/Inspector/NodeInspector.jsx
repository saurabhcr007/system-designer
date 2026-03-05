import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, Palette, ToggleLeft, ToggleRight } from 'lucide-react';
import useDesignStore from '../../store/useDesignStore';
import { findComponentById } from '../../data/components';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export default function NodeInspector() {
    const { nodes, selectedNodeId, inspectorOpen, toggleInspector, updateNode, toggleEntryPoint } = useDesignStore();
    const isMobile = useMediaQuery('(max-width: 768px)');
    const selectedNode = nodes.find((n) => n.id === selectedNodeId);
    const compDef = selectedNode ? findComponentById(selectedNode.data?.componentId) : null;

    return (
        <AnimatePresence mode="wait">
            {inspectorOpen && (
                <motion.aside
                    initial={isMobile ? { y: '100%' } : { width: 0, opacity: 0 }}
                    animate={isMobile ? { y: 0 } : { width: 280, opacity: 1 }}
                    exit={isMobile ? { y: '100%' } : { width: 0, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className={`
                        ${isMobile ? 'fixed inset-x-0 bottom-0 z-[60] h-[65vh] rounded-t-3xl border-t' : 'h-full border-l w-[280px]'}
                        flex flex-col bg-[#0b0f1a] border-[#1e2433] shrink-0 overflow-hidden shadow-2xl sidebar-glass
                    `}
                >
                    {isMobile && (
                        <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mt-3 mb-1 shrink-0" />
                    )}

                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-white/[0.04]">
                        <div className="flex flex-col">
                            <h2 className="text-[10px] font-bold text-white/30 tracking-[0.2em] uppercase">
                                Node Properties
                            </h2>
                            {isMobile && selectedNode && (
                                <p className="text-xs font-semibold text-white/80 mt-0.5">{compDef?.label || selectedNode.data?.label}</p>
                            )}
                        </div>
                        <button
                            onClick={toggleInspector}
                            className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-6 sidebar-scroll pb-12">
                        {selectedNode ? (
                            <NodeProperties node={selectedNode} compDef={compDef} updateNode={updateNode} toggleEntryPoint={toggleEntryPoint} />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center py-10">
                                <div className="text-4xl mb-4 opacity-20">🎯</div>
                                <p className="text-xs text-white/30 max-w-[160px] leading-relaxed">Select a node on the canvas to inspect its configuration</p>
                            </div>
                        )}
                    </div>
                </motion.aside>
            )}
        </AnimatePresence>
    );
}

function NodeProperties({ node, compDef, updateNode, toggleEntryPoint }) {
    const data = node.data || {};

    const handleChange = (field, value) => {
        updateNode(node.id, { data: { [field]: value } });
    };

    return (
        <div className="space-y-6">
            {/* Type Badge */}
            {!useMediaQuery('(max-width: 768px)') && (
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                    <span className="text-2xl">{compDef?.icon || '📦'}</span>
                    <div>
                        <p className="text-sm font-bold text-white/90">{compDef?.label || data.componentId}</p>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono">{node.type} node</p>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {/* Common Fields */}
                <Field label="Label" value={data.label || ''} onChange={(v) => handleChange('label', v)} />
                <div className="grid grid-cols-2 gap-3">
                    <Field label="Technology" value={data.technology || ''} onChange={(v) => handleChange('technology', v)} placeholder="e.g. Nginx" />
                    <Field label="Version" value={data.version || ''} onChange={(v) => handleChange('version', v)} placeholder="v1.0" />
                </div>

                {/* Type-specific fields */}
                {(data.componentId === 'container' || compDef?.type === 'container') && (
                    <>
                        <Field label="Docker Image" value={data.image || ''} onChange={(v) => handleChange('image', v)} placeholder="user-service:latest" />
                        <Field label="Container Port" value={data.port || ''} onChange={(v) => handleChange('port', v)} placeholder="8080" />
                        <Field label="Env Variables" value={data.envVars || ''} onChange={(v) => handleChange('envVars', v)} placeholder="PORT=8080" multiline />
                    </>
                )}

                {compDef?.defaultData?.dbType !== undefined && (
                    <>
                        <Field label="Database Engine" value={data.dbType || ''} onChange={(v) => handleChange('dbType', v)} />
                        <ToggleField label="High Availability" value={data.replication || false} onChange={(v) => handleChange('replication', v)} />
                    </>
                )}

                {data.componentId === 'service' && (
                    <>
                        <Field label="Instance Count" value={data.replicas || 1} onChange={(v) => handleChange('replicas', parseInt(v) || 1)} type="number" />
                        <Field label="Health Check" value={data.healthCheck || ''} onChange={(v) => handleChange('healthCheck', v)} placeholder="/health" />
                    </>
                )}

                {/* Notes */}
                <Field label="Architectural Notes" value={data.notes || ''} onChange={(v) => handleChange('notes', v)} placeholder="Implementation details..." multiline />

                {/* Color Override */}
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-wider flex items-center gap-2">
                        <Palette className="w-3 h-3" />
                        Interface Color
                    </label>
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#111827] border border-white/[0.04]">
                        <input
                            type="color"
                            value={data.color || compDef?.color || '#818cf8'}
                            onChange={(e) => handleChange('color', e.target.value)}
                            className="w-10 h-10 rounded-xl cursor-pointer border-none bg-transparent"
                        />
                        <span className="text-xs text-white/60 font-mono font-bold uppercase">{data.color || compDef?.color || '#818cf8'}</span>
                    </div>
                </div>

                {/* Entry Point Toggle */}
                <div className="pt-2">
                    <ToggleField
                        label="Public Entry Point"
                        value={data.isEntryPoint || false}
                        onChange={() => toggleEntryPoint(node.id)}
                    />
                </div>
            </div>
        </div>
    );
}

function Field({ label, value, onChange, placeholder, type = 'text', multiline = false }) {
    const inputClass =
        'w-full px-4 py-3 rounded-2xl bg-[#111827] border border-white/[0.04] text-xs text-white/90 placeholder-white/20 focus:outline-none focus:border-[#818cf8]/50 focus:bg-[#111827]/80 transition-all font-medium';

    return (
        <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-wider ml-1">
                {label}
            </label>
            {multiline ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={3}
                    className={`${inputClass} resize-none`}
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={inputClass}
                />
            )}
        </div>
    );
}

function ToggleField({ label, value, onChange }) {
    return (
        <div
            className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] cursor-pointer hover:bg-white/[0.04] transition-all"
            onClick={() => onChange(!value)}
        >
            <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider cursor-pointer">
                {label}
            </label>
            <div
                className={`relative w-11 h-6 rounded-full transition-all duration-300 ${value ? 'bg-[#818cf8]' : 'bg-[#1e2433]'}`}
            >
                <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${value ? 'left-[22px]' : 'left-1'}`}
                />
            </div>
        </div>
    );
}
