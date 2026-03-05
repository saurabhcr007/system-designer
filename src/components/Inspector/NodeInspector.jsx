import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, Palette, ToggleLeft, ToggleRight } from 'lucide-react';
import useDesignStore from '../../store/useDesignStore';
import { findComponentById } from '../../data/components';

export default function NodeInspector() {
    const { nodes, selectedNodeId, inspectorOpen, toggleInspector, updateNode, toggleEntryPoint } = useDesignStore();
    const selectedNode = nodes.find((n) => n.id === selectedNodeId);
    const compDef = selectedNode ? findComponentById(selectedNode.data?.componentId) : null;

    return (
        <AnimatePresence mode="wait">
            {inspectorOpen && (
                <motion.aside
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 280, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="h-full flex flex-col bg-[#0b0f1a] border-l border-[#1e2433] shrink-0 overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-3 border-b border-[#1e2433]">
                        <h2 className="text-xs font-bold text-[#94a3b8] tracking-widest uppercase">
                            Inspector
                        </h2>
                        <button
                            onClick={toggleInspector}
                            className="p-1 rounded text-[#64748b] hover:text-[#e2e8f0] hover:bg-[#111827] transition-all cursor-pointer"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-3">
                        {selectedNode ? (
                            <NodeProperties node={selectedNode} compDef={compDef} updateNode={updateNode} toggleEntryPoint={toggleEntryPoint} />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <div className="text-3xl mb-3 opacity-30">🎯</div>
                                <p className="text-xs text-[#64748b]">Select a node to inspect its properties</p>
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
        <div className="space-y-4">
            {/* Type Badge */}
            <div className="flex items-center gap-2">
                <span className="text-xl">{compDef?.icon || '📦'}</span>
                <div>
                    <p className="text-sm font-semibold text-[#e2e8f0]">{compDef?.label || data.componentId}</p>
                    <p className="text-[10px] text-[#64748b] uppercase tracking-wider">{node.type} node</p>
                </div>
            </div>

            {/* Common Fields */}
            <Field label="Label" value={data.label || ''} onChange={(v) => handleChange('label', v)} />
            <Field label="Technology" value={data.technology || ''} onChange={(v) => handleChange('technology', v)} placeholder="e.g. nginx, spring-boot" />
            <Field label="Version" value={data.version || ''} onChange={(v) => handleChange('version', v)} placeholder="e.g. 1.0.0" />

            {/* Type-specific fields */}
            {(data.componentId === 'container' || compDef?.type === 'container') && (
                <>
                    <Field label="Image" value={data.image || ''} onChange={(v) => handleChange('image', v)} placeholder="e.g. user-service:latest" />
                    <Field label="Port" value={data.port || ''} onChange={(v) => handleChange('port', v)} placeholder="e.g. 8080" />
                    <Field label="Env Vars" value={data.envVars || ''} onChange={(v) => handleChange('envVars', v)} placeholder="KEY=VALUE" multiline />
                </>
            )}

            {compDef?.defaultData?.dbType !== undefined && (
                <>
                    <Field label="DB Type" value={data.dbType || ''} onChange={(v) => handleChange('dbType', v)} />
                    <ToggleField label="Replication" value={data.replication || false} onChange={(v) => handleChange('replication', v)} />
                </>
            )}

            {data.componentId === 'service' && (
                <>
                    <Field label="Replicas" value={data.replicas || 1} onChange={(v) => handleChange('replicas', parseInt(v) || 1)} type="number" />
                    <Field label="Health Check URL" value={data.healthCheck || ''} onChange={(v) => handleChange('healthCheck', v)} placeholder="/health" />
                </>
            )}

            {/* Notes */}
            <Field label="Notes" value={data.notes || ''} onChange={(v) => handleChange('notes', v)} placeholder="Description..." multiline />

            {/* Color Override */}
            <div className="space-y-1">
                <label className="text-[10px] font-semibold text-[#64748b] uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="w-3 h-3" />
                    Accent Color
                </label>
                <div className="flex items-center gap-2">
                    <input
                        type="color"
                        value={data.color || compDef?.color || '#818cf8'}
                        onChange={(e) => handleChange('color', e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer border border-[#1e2433] bg-transparent"
                    />
                    <span className="text-xs text-[#94a3b8] font-mono">{data.color || compDef?.color || '#818cf8'}</span>
                </div>
            </div>

            {/* Entry Point Toggle */}
            <ToggleField
                label="Entry Point"
                value={data.isEntryPoint || false}
                onChange={() => toggleEntryPoint(node.id)}
            />
        </div>
    );
}

function Field({ label, value, onChange, placeholder, type = 'text', multiline = false }) {
    const inputClass =
        'w-full px-2.5 py-1.5 rounded-md bg-[#111827] border border-[#1e2433] text-xs text-[#e2e8f0] placeholder-[#4a5568] focus:outline-none focus:border-[#818cf8]/50 transition-colors font-mono';

    return (
        <div className="space-y-1">
            <label className="text-[10px] font-semibold text-[#64748b] uppercase tracking-wider">
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
        <div className="flex items-center justify-between">
            <label className="text-[10px] font-semibold text-[#64748b] uppercase tracking-wider">
                {label}
            </label>
            <button
                onClick={() => onChange(!value)}
                className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${value ? 'bg-[#818cf8]' : 'bg-[#1e2433]'}`}
            >
                <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${value ? 'left-[18px]' : 'left-0.5'}`}
                />
            </button>
        </div>
    );
}
