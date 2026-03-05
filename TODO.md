# Vibe System Designer — TODO

## Phase 1: Project Setup
- [x] Initialize React 18 + Vite project
- [x] Install dependencies (reactflow, tailwind, framer-motion, zustand, lucide-react, gh-pages)
- [x] Configure Tailwind CSS with dark theme
- [x] Configure Vite for GitHub Pages deployment
- [x] Set up Google Fonts (JetBrains Mono / Inter)

## Phase 2: Core Data & State
- [x] Create component library definitions (`src/data/components.js`)
- [x] Create Zustand store (`src/store/useDesignStore.js`) with undo/redo
- [x] Create export/import utilities (`src/utils/exportImport.js`)
- [x] Create share link utility (`src/utils/shareLink.js`)

## Phase 3: Layout & UI Shell
- [x] Build Navbar (`src/components/Navbar/Navbar.jsx`)
- [x] Build Left Sidebar with categories (`src/components/Sidebar/`)
- [x] Build Right Panel — Node Inspector (`src/components/Inspector/NodeInspector.jsx`)
- [x] Build App.jsx with three-panel layout

## Phase 4: Canvas & Nodes
- [x] Build BaseNode (`src/components/Nodes/BaseNode.jsx`)
- [x] Build GroupNode for VPC/K8s/Subnet (`src/components/Nodes/GroupNode.jsx`)
- [x] Build ContainerNode (`src/components/Nodes/ContainerNode.jsx`)
- [x] Register node types (`src/components/Nodes/nodeTypes.js`)
- [x] Build DesignCanvas with drag-and-drop (`src/components/Canvas/DesignCanvas.jsx`)
- [x] Build ContextMenu (`src/components/Canvas/ContextMenu.jsx`)

## Phase 5: Edges & Connections
- [x] Build custom edge types (`src/components/Edges/`)
- [x] Register edge types (`src/components/Edges/edgeTypes.js`)
- [x] Edge label editing on double-click
- [x] Edge color matches source node

## Phase 6: Simulation Mode
- [x] Build simulation hook (`src/hooks/useSimulation.js`)
- [x] Animated packets along edges
- [x] Chaos mode (random node failures)
- [x] Live RPS counter & latency badge
- [x] SimulationOverlay component

## Phase 7: Interactions & Polish
- [x] Keyboard shortcuts (`src/hooks/useKeyboardShortcuts.js`)
- [x] Node Inspector editable fields
- [x] Double-click inline editing
- [x] Selection glow & animated gradient border
- [x] Minimap & Controls styling

## Phase 8: Export/Import & Sharing
- [x] Export JSON functionality
- [x] Import JSON with validation
- [x] Share via URL hash (base64)

## Phase 9: Final Polish & Deployment
- [ ] Final visual polish & testing
- [ ] Build verification
- [ ] GitHub Pages deployment config

## Phase 10: Discrete Simulation Engine Rewrite
- [x] Implement `SimulationEngine` class (requestAnimationFrame loop, packet routing, processing delays).
- [x] Update `useDesignStore.js` to manage discrete packet state and actual stastistics.
- [x] Update `useSimulation.js` hook to integrate the engine.
- [x] Refactor `SimulationOverlay.jsx` to render `<animateMotion>` packets along precise SVG paths.
- [x] Update `AnimatedEdge.jsx` to support exact path extraction for packet traversal.
- [x] Enhance `BaseNode.jsx` with Framer Motion arrival pulses and processing loading rings.
- [x] Update `Navbar.jsx` to display actual live metrics (RPS, Latency, Errors).
- [x] Verify load balancing, chaos mode, and dynamic topology reactivity with discrete packets.

## Phase 11: Realism Enhancements
- [x] Fix SVG `animateMotion` document timeline start-freeze by using React ref `beginElement()`.
- [x] Prevent indefinite packet looping; nodes delete gracefully at the end of the topology flow.
- [x] Scale mathematical RPS to emulate arbitrary large-scale production numbers.
- [x] Auto-detect Entry Points (Top-to-Bottom Flow) without manual user designation.
- [x] Implement semantic, custom behaviors based purely on Node Label (WAF blocks, CDN cache hits, Kafka fast ingestion).

## Phase 12: Node Heat / Stress Visualization
- [x] Implement per-node RPS tracking in `SimulationEngine.js`.
- [x] Define capacity thresholds and calculate stress levels (0.0 - 1.0).
- [x] Update `useDesignStore.js` to hold `nodeSimState` and Toast alerts.
- [x] Refactor `BaseNode.jsx` to support 4-tier stress-based colors, glows, and pulses.
- [x] Add the Stress Badge UI component to `BaseNode.jsx`.
- [x] Implement Overload state (30% packet drop + UI warnings + Once-per-event Toasts).
- [x] Add CSS animations for critical/overload states in `index.css`.
- [x] Verify visual transitions and throughput-based behavior on MiniMap.
