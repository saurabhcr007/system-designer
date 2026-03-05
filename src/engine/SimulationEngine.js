import { nanoid } from '../store/nanoid';

const BASE_SPEED_PX_PER_SEC = 180; // pixels per second at 1.0x speed

const NODE_CAPACITIES = {
    dns: 500,
    cdn: 1000,
    balancer: 800,
    gateway: 600,
    service: 300,
    database: 100,
    sql: 100,
    postgres: 100,
    mongo: 100,
    redis: 1000,
    cache: 1000,
    kafka: 2000,
    queue: 2000,
    container: 200,
    worker: 200,
    lambda: 200
};

const getCapacity = (node) => {
    const label = (node?.data?.label || '').toLowerCase();
    for (const [key, cap] of Object.entries(NODE_CAPACITIES)) {
        if (label.includes(key)) return cap;
    }
    return 300; // Default capacity
};

const lerp = (start, end, t) => start + (end - start) * t;

const interpolate = (color1, color2, factor) => {
    const r1 = parseInt(color1.substr(1, 2), 16);
    const g1 = parseInt(color1.substr(3, 2), 16);
    const b1 = parseInt(color1.substr(5, 2), 16);
    const r2 = parseInt(color2.substr(1, 2), 16);
    const g2 = parseInt(color2.substr(3, 2), 16);
    const b2 = parseInt(color2.substr(5, 2), 16);
    const r = Math.round(r1 + factor * (r2 - r1));
    const g = Math.round(g1 + factor * (g2 - g1));
    const b = Math.round(b1 + factor * (b2 - b1));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const getStressColor = (stress) => {
    if (stress < 0.3) return interpolate('#22c55e', '#eab308', stress / 0.3);
    if (stress < 0.6) return interpolate('#eab308', '#f97316', (stress - 0.3) / 0.3);
    if (stress < 0.8) return interpolate('#f97316', '#ef4444', (stress - 0.6) / 0.2);
    return '#ef4444';
};

export const getProcessingDelay = (node) => {
    const label = (node?.data?.label || '').toLowerCase();
    if (label.includes('db') || label.includes('data') || label.includes('sql') || label.includes('mongo') || label.includes('postgres')) {
        return 400;
    }
    if (label.includes('cache') || label.includes('redis')) {
        return 50;
    }
    if (label.includes('worker') || label.includes('lambda')) {
        return 200;
    }
    if (label.includes('kafka') || label.includes('queue') || label.includes('messaging') || label.includes('event')) {
        return 20;
    }
    return 100;
};

export class SimulationEngine {
    constructor(storeGet, storeSet) {
        this.get = storeGet;
        this.set = storeSet;
        this.running = false;
        this.lastTick = 0;
        this.rAF = null;
        this.lastSpawn = 0;
        this.lastStatUpdate = 0;

        this.packets = [];
        this.stats = { spawned: 0, completed: 0, errors: 0, totalLatency: 0 };
        this.lbCursors = {};
        this.recentCompletions = [];

        // Node Heat Monitoring
        this.nodeThroughputWindow = new Map(); // Map<nodeId, number[]>
        this.nodeStress = new Map(); // Map<nodeId, number>
    }

    start() {
        if (this.running) return;
        this.running = true;
        this.packets = [];
        this.stats = { spawned: 0, completed: 0, errors: 0, totalLatency: 0 };
        this.lbCursors = {};
        this.recentCompletions = [];
        this.nodeThroughputWindow.clear();
        this.nodeStress.clear();
        this.lastTick = performance.now();
        this.lastSpawn = this.lastTick;
        this.lastStatUpdate = this.lastTick;
        this.rAF = requestAnimationFrame(this.tick);
    }

    stop() {
        this.running = false;
        cancelAnimationFrame(this.rAF);
        this.set({ activePackets: [], processingNodeIds: [] });
    }

    pause(ms) {
        if (!this.running) return;
        cancelAnimationFrame(this.rAF);
        setTimeout(() => {
            if (this.running) {
                this.lastTick = performance.now();
                this.rAF = requestAnimationFrame(this.tick);
            }
        }, ms);
    }

    tick = (timestamp) => {
        if (!this.running) return;
        timestamp = performance.now();
        const delta = timestamp - this.lastTick;
        this.lastTick = timestamp;

        const state = this.get();
        const { nodes, edges, simulationSpeed, chaosMode, chaosNodeIds, nodeSimState } = state;

        // 1. Spawning Logic
        const spawnInterval = 1000 / (2 * simulationSpeed);
        if (timestamp - this.lastSpawn > spawnInterval) {
            this.lastSpawn = timestamp;
            let entryNodes = nodes.filter(n => n.data?.isEntryPoint);
            if (entryNodes.length === 0) {
                const nodesWithIncoming = new Set(edges.map(e => e.target));
                entryNodes = nodes.filter(n => !nodesWithIncoming.has(n.id));
            }
            entryNodes.forEach(en => this.spawnPacket(en, timestamp));
        }

        // 2. Process active packets
        let stateChanged = false;
        const activeProcessingIds = new Set();
        while (this.recentCompletions.length > 0 && timestamp - this.recentCompletions[0] > 1000) {
            this.recentCompletions.shift();
        }

        for (let i = this.packets.length - 1; i >= 0; i--) {
            const p = this.packets[i];

            if (p.status === 'traveling') {
                const elapsed = timestamp - p.startTime;
                if (elapsed >= p.duration) {
                    const targetNode = nodes.find(n => n.id === p.targetNodeId);

                    if (!targetNode || (chaosMode && chaosNodeIds.includes(targetNode.id))) {
                        this.stats.errors++;
                        this._removePacket(i);
                        stateChanged = true;
                        continue;
                    }

                    // ── Node Arrival / Overload Check ──
                    const nodeState = nodeSimState[targetNode.id];
                    if (nodeState?.stress >= 1.0 && Math.random() < 0.3) {
                        this.stats.errors++;
                        this._removePacket(i);
                        stateChanged = true;
                        // Track dropped packets
                        const currentDropped = nodeState.droppedPackets || 0;
                        this.set((s) => ({
                            nodeSimState: {
                                ...s.nodeSimState,
                                [targetNode.id]: { ...s.nodeSimState[targetNode.id], droppedPackets: currentDropped + 1 }
                            }
                        }));
                        continue;
                    }

                    // Track Arrival in Window
                    if (!this.nodeThroughputWindow.has(targetNode.id)) {
                        this.nodeThroughputWindow.set(targetNode.id, []);
                    }
                    this.nodeThroughputWindow.get(targetNode.id).push(timestamp);

                    p.status = 'processing';
                    p.currentNodeId = targetNode.id;
                    p.startTime = timestamp;
                    p.duration = getProcessingDelay(targetNode) / simulationSpeed;
                    delete p.edgeId;
                    delete p.targetNodeId;
                    stateChanged = true;
                }
            }

            if (p.status === 'processing') {
                activeProcessingIds.add(p.currentNodeId);
                const elapsed = timestamp - p.startTime;
                if (elapsed >= p.duration) {
                    const outgoingEdges = edges.filter(e => e.source === p.currentNodeId);

                    if (outgoingEdges.length === 0) {
                        this.stats.completed++;
                        this.recentCompletions.push(timestamp);
                        this.stats.totalLatency += (timestamp - p.spawnTime);
                        this._removePacket(i);
                        stateChanged = true;
                        continue;
                    }

                    const currentNode = nodes.find(n => n.id === p.currentNodeId);
                    const label = (currentNode?.data?.label || '').toLowerCase();
                    const isLB = label.includes('balancer');
                    const isWAF = label.includes('waf') || label.includes('firewall');
                    const isCDN = label.includes('cdn');

                    if (isWAF && Math.random() < 0.05) {
                        this.stats.errors++;
                        this._removePacket(i);
                        stateChanged = true;
                        continue;
                    }

                    if (isCDN && Math.random() < 0.60) {
                        this.stats.completed++;
                        this.recentCompletions.push(timestamp);
                        this.stats.totalLatency += (timestamp - p.spawnTime);
                        this._removePacket(i);
                        stateChanged = true;
                        continue;
                    }

                    if (isLB) {
                        let healthyEdges = outgoingEdges;
                        if (chaosMode && chaosNodeIds.length > 0) {
                            healthyEdges = outgoingEdges.filter(e => !chaosNodeIds.includes(e.target));
                        }
                        const targetEdges = healthyEdges.length > 0 ? healthyEdges : outgoingEdges;
                        if (this.lbCursors[p.currentNodeId] === undefined) this.lbCursors[p.currentNodeId] = 0;
                        const idx = this.lbCursors[p.currentNodeId] % targetEdges.length;
                        this.lbCursors[p.currentNodeId]++;
                        const selectedEdge = targetEdges[idx];
                        this._sendOnEdge(p, selectedEdge, nodes, timestamp, simulationSpeed);
                    } else {
                        const firstEdge = outgoingEdges[0];
                        for (let j = 1; j < outgoingEdges.length; j++) {
                            const clone = { ...p, id: nanoid(), pathHistory: [...p.pathHistory] };
                            this._sendOnEdge(clone, outgoingEdges[j], nodes, timestamp, simulationSpeed);
                            this.packets.push(clone);
                        }
                        this._sendOnEdge(p, firstEdge, nodes, timestamp, simulationSpeed);
                    }
                    stateChanged = true;
                }
            }
        }

        if (stateChanged || timestamp % 33 < 16) {
            this.set({
                activePackets: [...this.packets],
                processingNodeIds: Array.from(activeProcessingIds),
            });
        }

        // 3. Batch Update Heat/Metrics (Throttled every 200ms)
        if (timestamp - this.lastStatUpdate > 200) {
            this.lastStatUpdate = timestamp;
            const newNodeSimState = { ...nodeSimState };

            nodes.forEach(node => {
                const window = this.nodeThroughputWindow.get(node.id) || [];
                // Filter window to last 1000ms
                const validArrivals = window.filter(t => timestamp - t < 1000);
                this.nodeThroughputWindow.set(node.id, validArrivals);

                const currentRPS = validArrivals.length;
                const capacity = getCapacity(node);
                const rawStress = Math.min(1.0, currentRPS / capacity);

                // Smoothed Lerp
                const prevStress = this.nodeStress.get(node.id) || 0;
                const smoothedStress = lerp(prevStress, rawStress, 0.15);
                this.nodeStress.set(node.id, smoothedStress);

                const prevNodeState = nodeSimState[node.id] || {};
                const isOverloaded = smoothedStress >= 0.95;
                let overloadToastShown = prevNodeState.overloadToastShown || false;

                // ── Toast Alert Logic (Fire once) ──
                if (isOverloaded && !overloadToastShown) {
                    this.get().addToast(`⚠ ${node.data.label} is overloaded — add more instances`, 'warning');
                    overloadToastShown = true;
                }

                // Reset toast guard if stress drops significantly below 0.8
                if (smoothedStress < 0.8) {
                    overloadToastShown = false;
                }

                newNodeSimState[node.id] = {
                    ...prevNodeState,
                    currentRPS,
                    stress: smoothedStress,
                    stressColor: getStressColor(smoothedStress),
                    isOverloaded,
                    overloadToastShown,
                    droppedPackets: prevNodeState.droppedPackets || 0
                };
            });

            const baseCompletions = this.recentCompletions.length;
            const scaledRps = baseCompletions > 0 ? (baseCompletions * 242) + (nodes.length * 25) + Math.floor(Math.random() * 80) : 0;
            const avgLatency = this.stats.completed > 0 ? Math.floor(this.stats.totalLatency / this.stats.completed) : 0;

            this.set({
                nodeSimState: newNodeSimState,
                actualStats: {
                    rps: scaledRps,
                    latency: avgLatency,
                    errorCount: this.stats.errors * 27,
                    activePaths: new Set(this.packets.map(p => p.pathHistory.join('-'))).size
                }
            });
        }

        this.rAF = requestAnimationFrame(this.tick);
    }

    spawnPacket(entryNode, timestamp) {
        this.stats.spawned++;
        const p = {
            id: nanoid(),
            status: 'processing',
            currentNodeId: entryNode.id,
            startTime: timestamp,
            duration: 100,
            spawnTime: timestamp,
            color: entryNode.data?.color || '#4ade80',
            pathHistory: [entryNode.id]
        };
        this.packets.push(p);
    }

    _sendOnEdge(packet, edge, nodes, timestamp, speed) {
        packet.status = 'traveling';
        packet.edgeId = edge.id;
        packet.targetNodeId = edge.target;
        packet.startTime = timestamp;
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        let dist = 300;
        if (sourceNode && targetNode) {
            const dx = targetNode.position.x - sourceNode.position.x;
            const dy = targetNode.position.y - sourceNode.position.y;
            dist = Math.max(100, Math.hypot(dx, dy));
        }
        packet.duration = (dist / BASE_SPEED_PX_PER_SEC) * (1000 / speed);
        packet.pathHistory.push(edge.target);
    }

    _removePacket(index) {
        this.packets.splice(index, 1);
    }
}
