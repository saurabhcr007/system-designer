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
- [x] Final visual polish & testing
- [x] Build verification
- [x] GitHub Pages deployment config

## Phase 10: Discrete Simulation Engine Rewrite
- [x] Implement `SimulationEngine` class (routing, processing delays).
- [x] Update `useDesignStore.js` for discrete packet state.
- [x] Refactor `SimulationOverlay.jsx` for SVG `<animateMotion>`.
- [x] Enhance `BaseNode.jsx` with arrival pulses and loading rings.
- [x] Verify load balancing, chaos mode, and dynamic topology.

## Phase 11: Realism Enhancements
- [x] Fix SVG timeline freeze via `beginElement()`.
- [x] Prevent indefinite packet looping.
- [x] Auto-detect Entry Points (Top-to-Bottom Flow).
- [x] Implement label-based backend behaviors (WAF, CDN, Kafka).

## Phase 12: Node Heat / Stress Visualization
- [x] Implement per-node RPS tracking & capacity thresholds.
- [x] Add dynamic stress colors, glows, and badges to nodes.
- [x] Implement Overload logic (30% packet drop + UI warnings).
- [x] Verify visual transitions and MiniMap reactivity.

## Phase 13: Branding & Deployment
- [x] Link to GitHub Remote (`saurabhcr007/system-designer`).
- [x] Rename project to **FlowForge** across all UI/metadata.
- [x] Fix 404 setup and deploy to GitHub Pages.
- [x] Implement premium visual polishes (Sidebar, search icon).

## Phase 14: Frontend Modules
- [x] Add 'Frontend' category (Web, Mobile, App) to components.
- [x] Update Simulation Engine with frontend-specific latency.
- [x] Update Starter Template with 6-tier vertical flow.

## Phase 15: Mobile & Tablet Responsiveness
- [x] Implement `useMediaQuery` for breakpoint detection.
- [x] Add **Tap-to-Place** mechanic for mobile node creation.
- [x] Convert Navbar/Inspector into **Bottom Sheets** for mobile.
- [x] Increase touch targets (44px) for connection handles.
- [x] Verify layout across 375px/768px viewports.
