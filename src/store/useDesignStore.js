import { create } from 'zustand';
import { nanoid } from './nanoid';

// Simple nanoid replacement (no external dep)


const MAX_HISTORY = 50;

const useDesignStore = create((set, get) => ({
    // ── Nodes & Edges ──────────────────────────
    nodes: [],
    edges: [],
    selectedNodeId: null,
    selectedEdgeId: null,

    // ── Simulation ─────────────────────────────
    isSimulating: false,
    simulationSpeed: 1,
    chaosMode: false,
    rps: 0,
    latency: 43,
    errorCount: 0,
    chaosNodeIds: [],

    // ── Discrete Engine State ──────────────────
    activePackets: [],
    processingNodeIds: [],
    nodeSimState: {}, // Stores per-node stress/rps
    toasts: [], // Global notification system
    actualStats: {
        rps: 0,
        latency: 0,
        errorCount: 0,
        activePaths: 0
    },

    setSimulationState: (updates) => set(updates),
    setNodeSimState: (nodeId, state) => set(s => ({
        nodeSimState: { ...s.nodeSimState, [nodeId]: { ...s.nodeSimState[nodeId], ...state } }
    })),
    resetNodeSimState: () => set({ nodeSimState: {} }),

    addToast: (message, type = 'info') => set(s => ({
        toasts: [...s.toasts, { id: nanoid(), message, type, timestamp: Date.now() }]
    })),
    removeToast: (id) => set(s => ({
        toasts: s.toasts.filter(t => t.id !== id)
    })),

    // ── UI State ───────────────────────────────
    inspectorOpen: true,
    reactFlowInstance: null,

    // ── History (Undo/Redo) ────────────────────
    history: [],
    historyIndex: -1,

    // ── Actions ────────────────────────────────

    setReactFlowInstance: (instance) => set({ reactFlowInstance: instance }),

    // Push to history before mutations
    _pushHistory: () => {
        const { nodes, edges, history, historyIndex } = get();
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push({
            nodes: JSON.parse(JSON.stringify(nodes)),
            edges: JSON.parse(JSON.stringify(edges)),
        });
        if (newHistory.length > MAX_HISTORY) newHistory.shift();
        set({ history: newHistory, historyIndex: newHistory.length - 1 });
    },

    undo: () => {
        const { historyIndex, history } = get();
        if (historyIndex <= 0) return;
        const prev = history[historyIndex - 1];
        set({
            nodes: JSON.parse(JSON.stringify(prev.nodes)),
            edges: JSON.parse(JSON.stringify(prev.edges)),
            historyIndex: historyIndex - 1,
        });
    },

    redo: () => {
        const { historyIndex, history } = get();
        if (historyIndex >= history.length - 1) return;
        const next = history[historyIndex + 1];
        set({
            nodes: JSON.parse(JSON.stringify(next.nodes)),
            edges: JSON.parse(JSON.stringify(next.edges)),
            historyIndex: historyIndex + 1,
        });
    },

    // Nodes
    setNodes: (nodesOrUpdater) => {
        if (typeof nodesOrUpdater === 'function') {
            set((state) => ({ nodes: nodesOrUpdater(state.nodes) }));
        } else {
            set({ nodes: nodesOrUpdater });
        }
    },

    addNode: (nodeData) => {
        get()._pushHistory();
        const id = nanoid();
        const newNode = {
            id,
            ...nodeData,
            data: {
                ...nodeData.data,
                label: nodeData.data?.label || 'New Node',
            },
        };
        set((state) => ({ nodes: [...state.nodes, newNode] }));
        return id;
    },

    updateNode: (nodeId, updates) => {
        get()._pushHistory();
        set((state) => ({
            nodes: state.nodes.map((n) =>
                n.id === nodeId ? { ...n, ...updates, data: { ...n.data, ...updates.data } } : n
            ),
        }));
    },

    removeNode: (nodeId) => {
        get()._pushHistory();
        set((state) => ({
            nodes: state.nodes.filter((n) => n.id !== nodeId && n.parentNode !== nodeId),
            edges: state.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
            selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
        }));
    },

    duplicateNode: (nodeId) => {
        const { nodes } = get();
        const node = nodes.find((n) => n.id === nodeId);
        if (!node) return;
        get()._pushHistory();
        const id = nanoid();
        const newNode = {
            ...JSON.parse(JSON.stringify(node)),
            id,
            position: {
                x: node.position.x + 40,
                y: node.position.y + 40,
            },
        };
        delete newNode.parentNode;
        delete newNode.extent;
        set((state) => ({ nodes: [...state.nodes, newNode] }));
    },

    setSelectedNode: (nodeId) => set({ selectedNodeId: nodeId, selectedEdgeId: null }),
    setSelectedEdge: (edgeId) => set({ selectedEdgeId: edgeId, selectedNodeId: null }),
    clearSelection: () => set({ selectedNodeId: null, selectedEdgeId: null }),

    // Edges
    setEdges: (edgesOrUpdater) => {
        if (typeof edgesOrUpdater === 'function') {
            set((state) => ({ edges: edgesOrUpdater(state.edges) }));
        } else {
            set({ edges: edgesOrUpdater });
        }
    },

    addEdge: (edgeData) => {
        get()._pushHistory();
        const id = nanoid();
        const newEdge = {
            id,
            ...edgeData,
            type: 'custom',
            data: {
                edgeType: 'sync',
                label: '',
                ...edgeData.data,
            },
        };
        set((state) => ({ edges: [...state.edges, newEdge] }));
    },

    updateEdge: (edgeId, updates) => {
        set((state) => ({
            edges: state.edges.map((e) =>
                e.id === edgeId ? { ...e, ...updates, data: { ...e.data, ...updates.data } } : e
            ),
        }));
    },

    removeEdge: (edgeId) => {
        get()._pushHistory();
        set((state) => ({
            edges: state.edges.filter((e) => e.id !== edgeId),
            selectedEdgeId: state.selectedEdgeId === edgeId ? null : state.selectedEdgeId,
        }));
    },

    // Canvas
    clearCanvas: () => {
        get()._pushHistory();
        set({ nodes: [], edges: [], selectedNodeId: null, selectedEdgeId: null });
    },

    // Simulation
    startSimulation: () => set({ isSimulating: true, rps: 0, errorCount: 0 }),
    stopSimulation: () => {
        set({ isSimulating: false, chaosMode: false, chaosNodeIds: [], rps: 0 });
        get().resetNodeSimState();
    },
    setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),
    toggleChaosMode: () => set((state) => ({ chaosMode: !state.chaosMode })),
    setRps: (rps) => set({ rps }),
    setLatency: (latency) => set({ latency }),
    setErrorCount: (count) => set({ errorCount: count }),
    setChaosNodeIds: (ids) => set({ chaosNodeIds: ids }),

    // Inspector
    toggleInspector: () => set((state) => ({ inspectorOpen: !state.inspectorOpen })),

    // Import / Load
    loadDesign: (data) => {
        set({
            nodes: data.nodes || [],
            edges: data.edges || [],
            selectedNodeId: null,
            selectedEdgeId: null,
            history: [],
            historyIndex: -1,
        });
    },

    // Select All
    selectAll: () => {
        set((state) => ({
            nodes: state.nodes.map((n) => ({ ...n, selected: true })),
        }));
    },

    // Delete selected
    deleteSelected: () => {
        const { nodes, edges } = get();
        const selectedNodeIds = nodes.filter((n) => n.selected).map((n) => n.id);
        const selectedEdgeIds = edges.filter((e) => e.selected).map((e) => e.id);

        if (selectedNodeIds.length === 0 && selectedEdgeIds.length === 0) return;

        get()._pushHistory();
        set((state) => ({
            nodes: state.nodes.filter((n) => !n.selected && !selectedNodeIds.includes(n.parentNode)),
            edges: state.edges.filter(
                (e) =>
                    !e.selected &&
                    !selectedNodeIds.includes(e.source) &&
                    !selectedNodeIds.includes(e.target)
            ),
            selectedNodeId: null,
            selectedEdgeId: null,
        }));
    },

    // Set entry point
    toggleEntryPoint: (nodeId) => {
        set((state) => ({
            nodes: state.nodes.map((n) =>
                n.id === nodeId
                    ? { ...n, data: { ...n.data, isEntryPoint: !n.data?.isEntryPoint } }
                    : n
            ),
        }));
    },
}));

export default useDesignStore;
