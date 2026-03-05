import { useCallback, useState, useRef, useEffect } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    addEdge,
    useNodesState,
    useEdgesState,
    ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { nodeTypes } from '../Nodes/nodeTypes';
import { edgeTypes } from '../Edges/edgeTypes';
import ContextMenu from './ContextMenu';
import SimulationOverlay from './SimulationOverlay';
import useDesignStore from '../../store/useDesignStore';
import { findComponentById } from '../../data/components';
import { decodeFromURL } from '../../utils/shareLink';
import { starterTemplate } from '../../data/starterTemplate';
import { LayoutTemplate, MousePointerClick } from 'lucide-react';

function DesignCanvasInner() {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [contextMenu, setContextMenu] = useState(null);

    const {
        nodes,
        edges,
        setNodes,
        setEdges,
        addNode,
        addEdge: storeAddEdge,
        setSelectedNode,
        setSelectedEdge,
        clearSelection,
        setReactFlowInstance: storeSetInstance,
        loadDesign,
        isSimulating,
    } = useDesignStore();

    // Specific selector for minimap performance so it doesn't cause global re-renders
    const storeNodeSimState = useDesignStore(s => s.nodeSimState);

    // Load from URL hash on mount
    useEffect(() => {
        const data = decodeFromURL();
        if (data) {
            loadDesign(data);
        }
    }, []);

    const onInit = useCallback((instance) => {
        setReactFlowInstance(instance);
        storeSetInstance(instance);
    }, [storeSetInstance]);

    // ── Drag & Drop from Sidebar ──────────────
    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();
            const rawData = event.dataTransfer.getData('application/reactflow-type');
            if (!rawData || !reactFlowInstance) return;

            const component = JSON.parse(rawData);
            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const nodeType = component.type === 'group' ? 'group' : component.type === 'container' ? 'container' : 'base';

            const newNodeData = {
                type: nodeType,
                position,
                data: {
                    label: component.label,
                    icon: component.icon,
                    color: component.color,
                    componentId: component.id,
                    ...component.defaultData,
                },
            };

            // Group nodes need explicit dimensions
            if (nodeType === 'group') {
                newNodeData.style = { width: 400, height: 300 };
            }

            addNode(newNodeData);
        },
        [reactFlowInstance, addNode]
    );

    // ── Connections ────────────────────────────
    const onConnect = useCallback(
        (params) => {
            // Find source node color
            const sourceNode = nodes.find((n) => n.id === params.source);
            const sourceColor = sourceNode?.data?.color || '#818cf8';

            storeAddEdge({
                ...params,
                data: {
                    edgeType: 'sync',
                    label: '',
                    color: sourceColor,
                },
            });
        },
        [nodes, storeAddEdge]
    );

    // ── Selection ──────────────────────────────
    const onNodeClick = useCallback(
        (_, node) => {
            setSelectedNode(node.id);
            setContextMenu(null);
        },
        [setSelectedNode]
    );

    const onEdgeClick = useCallback(
        (_, edge) => {
            setSelectedEdge(edge.id);
            setContextMenu(null);
        },
        [setSelectedEdge]
    );

    const onPaneClick = useCallback(() => {
        clearSelection();
        setContextMenu(null);
    }, [clearSelection]);

    // ── Context Menu ───────────────────────────
    const onNodeContextMenu = useCallback((event, node) => {
        event.preventDefault();
        setContextMenu({
            x: event.clientX,
            y: event.clientY,
            nodeId: node.id,
        });
    }, []);

    const onEdgeContextMenu = useCallback((event, edge) => {
        event.preventDefault();
        setContextMenu({
            x: event.clientX,
            y: event.clientY,
            edgeId: edge.id,
        });
    }, []);

    // ── Node Changes ───────────────────────────
    const onNodesChange = useCallback(
        (changes) => {
            setNodes((nds) => {
                let newNodes = [...nds];
                for (const change of changes) {
                    if (change.type === 'position' && change.position) {
                        newNodes = newNodes.map((n) =>
                            n.id === change.id ? { ...n, position: change.position, dragging: change.dragging } : n
                        );
                    } else if (change.type === 'select') {
                        newNodes = newNodes.map((n) =>
                            n.id === change.id ? { ...n, selected: change.selected } : n
                        );
                    } else if (change.type === 'remove') {
                        newNodes = newNodes.filter((n) => n.id !== change.id);
                    } else if (change.type === 'dimensions' && change.dimensions) {
                        newNodes = newNodes.map((n) =>
                            n.id === change.id
                                ? { ...n, style: { ...n.style, ...change.dimensions }, width: change.dimensions.width, height: change.dimensions.height }
                                : n
                        );
                    }
                }
                return newNodes;
            });
        },
        [setNodes]
    );

    const onEdgesChange = useCallback(
        (changes) => {
            setEdges((eds) => {
                let newEdges = [...eds];
                for (const change of changes) {
                    if (change.type === 'select') {
                        newEdges = newEdges.map((e) =>
                            e.id === change.id ? { ...e, selected: change.selected } : e
                        );
                    } else if (change.type === 'remove') {
                        newEdges = newEdges.filter((e) => e.id !== change.id);
                    }
                }
                return newEdges;
            });
        },
        [setEdges]
    );

    // Close context menu on click outside
    useEffect(() => {
        const handleClick = () => setContextMenu(null);
        if (contextMenu) {
            window.addEventListener('click', handleClick);
            return () => window.removeEventListener('click', handleClick);
        }
    }, [contextMenu]);

    return (
        <div ref={reactFlowWrapper} className="flex-1 h-full relative">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={onInit}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onNodeClick={onNodeClick}
                onEdgeClick={onEdgeClick}
                onPaneClick={onPaneClick}
                onNodeContextMenu={onNodeContextMenu}
                onEdgeContextMenu={onEdgeContextMenu}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                defaultEdgeOptions={{
                    type: 'custom',
                    animated: isSimulating,
                }}
                fitView
                deleteKeyCode={['Delete', 'Backspace']}
                multiSelectionKeyCode="Control"
                selectionKeyCode="Shift"
                snapToGrid
                snapGrid={[16, 16]}
                minZoom={0.1}
                maxZoom={4}
            >
                <Background
                    variant="dots"
                    gap={24}
                    size={1}
                    color="#1e2433"
                />
                <Controls
                    showInteractive={false}
                    position="bottom-left"
                />
                <MiniMap
                    position="bottom-right"
                    nodeStrokeWidth={3}
                    nodeColor={(node) => storeNodeSimState[node.id]?.stressColor || node.data.color || '#1f2937'}
                    pannable
                    zoomable
                />
            </ReactFlow>

            {/* Simulation Overlay */}
            {isSimulating && <SimulationOverlay />}

            {/* Context Menu */}
            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    nodeId={contextMenu.nodeId}
                    edgeId={contextMenu.edgeId}
                    onClose={() => setContextMenu(null)}
                />
            )}

            {/* Empty State — Welcome */}
            {nodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="pointer-events-auto text-center max-w-sm">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#818cf8] to-[#c084fc] flex items-center justify-center shadow-lg shadow-[#818cf8]/20">
                            <MousePointerClick className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-[#e2e8f0] mb-1 font-mono">Start Designing</h3>
                        <p className="text-xs text-[#64748b] mb-5 leading-relaxed">
                            Drag components from the sidebar onto the canvas, or load a sample architecture to get started.
                        </p>
                        <button
                            onClick={() => loadDesign(starterTemplate)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#818cf8]/10 text-[#818cf8] text-xs font-semibold border border-[#818cf8]/25 hover:bg-[#818cf8]/20 hover:border-[#818cf8]/40 transition-all cursor-pointer"
                        >
                            <LayoutTemplate className="w-4 h-4" />
                            Load Sample Template
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function DesignCanvas() {
    return (
        <ReactFlowProvider>
            <DesignCanvasInner />
        </ReactFlowProvider>
    );
}
