import { Edit3, Crosshair, Copy, Trash2, Globe, Link } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useDesignStore from '../../store/useDesignStore';

export default function ContextMenu({ x, y, nodeId, edgeId, onClose }) {
    const { removeNode, duplicateNode, toggleEntryPoint, removeEdge, updateEdge, nodes } = useDesignStore();
    const node = nodes.find((n) => n.id === nodeId);

    const handleAction = (action) => {
        action();
        onClose();
    };

    // Edge context menu
    if (edgeId) {
        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="context-menu fixed z-[9999]"
                    style={{ left: x, top: y }}
                >
                    <MenuItem icon={<Edit3 />} label="Sync HTTP" onClick={() => handleAction(() => updateEdge(edgeId, { data: { edgeType: 'sync' } }))} />
                    <MenuItem icon={<Link />} label="Async Event" onClick={() => handleAction(() => updateEdge(edgeId, { data: { edgeType: 'async' } }))} />
                    <MenuItem icon={<Globe />} label="DB Query" onClick={() => handleAction(() => updateEdge(edgeId, { data: { edgeType: 'db-query' } }))} />
                    <MenuItem icon={<Link />} label="gRPC" onClick={() => handleAction(() => updateEdge(edgeId, { data: { edgeType: 'grpc' } }))} />
                    <div className="context-menu-divider" />
                    <MenuItem icon={<Trash2 />} label="Delete Edge" onClick={() => handleAction(() => removeEdge(edgeId))} danger />
                </motion.div>
            </AnimatePresence>
        );
    }

    // Node context menu
    if (!nodeId) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="context-menu fixed z-[9999]"
                style={{ left: x, top: y }}
            >
                <MenuItem
                    icon={<Crosshair />}
                    label={node?.data?.isEntryPoint ? 'Unset Entry Point' : 'Set as Entry Point'}
                    onClick={() => handleAction(() => toggleEntryPoint(nodeId))}
                />
                <MenuItem icon={<Copy />} label="Duplicate" onClick={() => handleAction(() => duplicateNode(nodeId))} />
                <div className="context-menu-divider" />
                <MenuItem icon={<Trash2 />} label="Delete" onClick={() => handleAction(() => removeNode(nodeId))} danger />
            </motion.div>
        </AnimatePresence>
    );
}

function MenuItem({ icon, label, onClick, danger }) {
    return (
        <button
            onClick={onClick}
            className={`context-menu-item w-full text-left cursor-pointer ${danger ? 'hover:!text-[#f87171]' : ''}`}
        >
            <span className="w-4 h-4 flex items-center justify-center [&>svg]:w-3.5 [&>svg]:h-3.5">{icon}</span>
            <span>{label}</span>
        </button>
    );
}
