import { useEffect, useRef } from 'react';
import useDesignStore from '../store/useDesignStore';
import { SimulationEngine } from '../engine/SimulationEngine';

export default function useSimulation() {
    const isSimulating = useDesignStore(s => s.isSimulating);
    const nodes = useDesignStore(s => s.nodes);
    const edges = useDesignStore(s => s.edges);

    const engineRef = useRef(null);

    // 1. Initialize Engine singleton
    useEffect(() => {
        if (!engineRef.current) {
            engineRef.current = new SimulationEngine(
                useDesignStore.getState,
                useDesignStore.setState
            );
        }
        return () => {
            if (engineRef.current) {
                engineRef.current.stop();
            }
        };
    }, []);

    // 2. Handle Simulation Start/Stop
    useEffect(() => {
        if (isSimulating) {
            engineRef.current?.start();
        } else {
            engineRef.current?.stop();

            // Cleanup UI states
            useDesignStore.setState({
                activePackets: [],
                processingNodeIds: [],
                actualStats: { rps: 0, latency: 0, errorCount: 0, activePaths: 0 }
            });

            // Legacy cleanup (if any edges still had simulated color assigned)
            const state = useDesignStore.getState();
            for (const edge of state.edges) {
                if (edge.data?.trafficLevel) {
                    state.updateEdge(edge.id, { data: { trafficLevel: 0 } });
                }
            }
        }
    }, [isSimulating]);

    // 3. Dynamic Topology Reaction
    // The spec requires: "If user ADDS a new Load Balancer or Service mid-simulation:
    // Pause spawning for 300ms (brief 'reconfiguring' flash). Recompute all paths."
    useEffect(() => {
        if (isSimulating && engineRef.current) {
            engineRef.current.pause(300);
        }
    }, [nodes.length, edges.length, isSimulating]);
}
