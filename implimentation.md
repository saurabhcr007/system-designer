Vibe System Designer — Implementation Plan
A production-ready React web application for interactive, visual system architecture design. Built with React 18 + Vite, React Flow, Tailwind CSS, Framer Motion, Zustand, and Lucide React. Deployable to GitHub Pages.

User Review Required
IMPORTANT

The base path in vite.config.js needs to match your GitHub repo name (e.g., '/System-Designer/'). I'll set a placeholder — please confirm your repo name before deploying.

NOTE

This is a large application (~25+ files). I will build it in phases and verify each phase compiles before proceeding.

Proposed Changes
Phase 1: Project Initialization
[NEW] Project scaffold via npx create-vite
Initialize React + Vite project in the project directory
Install all deps: reactflow @reactflow/node-resizer tailwindcss @tailwindcss/vite framer-motion zustand lucide-react gh-pages
Configure Tailwind with dark theme defaults
Configure vite.config.js with base for GitHub Pages
Add Google Fonts (JetBrains Mono) in index.html
Add deploy scripts to package.json
Phase 2: Core Data & State
[NEW] 
components.js
All component definitions grouped by category (Traffic, Compute, Storage, Networking, Messaging, Monitoring, Security, AI & Agents)
Each entry: { id, label, icon, color, category, isGroup?, defaultData }
[NEW] 
useDesignStore.js
Zustand store managing: nodes, edges, selectedNode, simulation state, undo/redo history
Actions: addNode, removeNode, updateNode, addEdge, removeEdge, undo, redo, clearCanvas, setSimulation, etc.
[NEW] 
exportImport.js
exportToJSON() — serializes nodes/edges with meta
importFromJSON(file) — validates and loads
[NEW] 
shareLink.js
encodeToURL() — base64 encodes design to URL hash
decodeFromURL() — reads hash and restores design
Phase 3: Layout & UI Shell
[NEW] 
Navbar.jsx
App logo + name "VibeArch"
Export/Import/Clear buttons
Simulation controls (Start/Stop, Speed slider)
Live stats (RPS, Latency)
GitHub link
[NEW] 
Sidebar.jsx
Scrollable list of collapsible categories
Each category renders DraggableComponent items
[NEW] 
ComponentCategory.jsx
Collapsible category with icon, label, expand/collapse
[NEW] 
DraggableComponent.jsx
HTML5 drag source, sets dataTransfer with component type
[NEW] 
NodeInspector.jsx
Right panel, collapsible, shows fields for selected node
Editable: Label, Technology, Version, Notes, Color picker, Entry point toggle
Type-specific fields (Container: image/port/env, DB: type/replication, Service: replicas/healthcheck)
[NEW] 
App.jsx
Three-panel flex layout with Navbar on top
Phase 4: Canvas & Nodes
[NEW] 
BaseNode.jsx
Standard node with icon, label, handles, color accent glow
Inline label editing on double-click
Selection animated gradient border
[NEW] 
GroupNode.jsx
VPC / Subnet / K8s group nodes
Dashed border, resizable via NodeResizer
Semi-transparent fill, label in top-left
[NEW] 
ContainerNode.jsx
Docker container node with port label
Nestable inside K8s group
[NEW] 
nodeTypes.js
Registers all custom node types with React Flow
[NEW] 
DesignCanvas.jsx
React Flow canvas with onDrop, onDragOver handlers
Minimap (dark styled), Controls (styled), Background (dots)
Right-click context menu integration
[NEW] 
ContextMenu.jsx
Right-click context menu: Edit Label, Set Entry Point, Duplicate, Delete
Phase 5: Edges & Connections
[NEW] 
AnimatedEdge.jsx
Custom edge types: Sync HTTP (solid), Async (dashed), DB Query (dotted), gRPC (double)
Edge label editable on double-click
Color matches source node
Animated during simulation
[NEW] 
edgeTypes.js
Registers custom edge types
Phase 6: Simulation
[NEW] 
useSimulation.js
Controls simulation start/stop/speed
Spawns animated packets from entry nodes
RPS counter, latency fluctuation
Chaos mode: random node failure flashing
[NEW] 
SimulationOverlay.jsx
SVG overlay for simulation packets

Phase 10: Discrete Simulation Engine
[NEW] SimulationEngine.js
requestAnimationFrame loop for deterministic, topology-aware packet routing.
Replaces "faked match" with exact travel times based on Euclidean distance.
Handles Node Processing Delays (e.g., databases take longer than caches).
[MODIFY] useDesignStore.js
Hold actualStats, activePackets arrays.
[MODIFY] AnimatedEdge.jsx
Renders exact packets using SVG `<animateMotion>` along precise Bezier paths.
[MODIFY] BaseNode.jsx
Extracts pulse and processing spinner logic based on active packet intersections.

Phase 11: Realism Enhancements
[MODIFY] SimulationEngine.js
Auto-detect graphs tops (Source nodes) if no entry points flag is selected.
Scale raw RPS to emulate massive production-level load.
WAF components probabilistically drop 5% of traffic simulating attack blocks.
CDN components probabilistically return early (cache hits) at 60%.
[MODIFY] AnimatedEdge.jsx
Remove infinite looping from animations by utilizing ref.current.beginElement()

Phase 12: Node Heat / Stress Visualization
[MODIFY] SimulationEngine.js
Rolling 1-second timestamp average to track requests-per-second globally PER MODE.
Hardcoded NODE_CAPACITIES (DB = 100 max, CDN = 1000 max).
Lerped Stress Level Calculation determining load capacity percentages (0-1.0).
Overload Drop Logic: Node instantly drops 30% of traffic if it reaches >= 0.95 stress score.
[MODIFY] BaseNode.jsx
Extracts state via selective Zustand selectors.
Injects 4-tier Heat Colors (Green -> Yellow -> Orange -> Red) into node borders, CSS outer-glows, and React Flow handle styles.
Top-right 'Stress Badge' component showing live node RPS with corresponding Emoji status.
"OVERLOADED" label injected dynamically with a severe pulse animation.
[NEW] ToastContainer.jsx
Global toast system displaying "OVERLOADED: Add more instances" warnings. Restricted via SimulationEngine to fire exactly once per overload event until system cools.
[MODIFY] index.css
`criticalPulse` keyframes for heavily loaded nodes.
Phase 7: Interactions
[NEW] 
useKeyboardShortcuts.js
Delete, Ctrl+Z, Ctrl+A, Ctrl+E, Escape, Ctrl+Shift+S
Phase 8: Styling
[NEW] 
index.css
Tailwind imports, dark theme custom styles
React Flow overrides, dot grid background, glow effects, animation keyframes
Verification Plan
Automated Tests
Build verification: npm run build — must succeed with zero errors
Dev server verification: npm run dev — verify it starts and serves the app
Browser Verification (via browser subagent)
Navigate to the dev server URL
Verify the three-panel layout renders (sidebar, canvas, inspector)
Verify sidebar shows all component categories
Drag a component from sidebar to canvas — verify node appears
Click a node — verify inspector panel shows properties
Test Export JSON button produces valid output
Verify dark theme styling is correct
Manual Verification (by user)
Deploy to GitHub Pages with npm run deploy and verify it loads at the Pages URL
Test drag-and-drop of all component types
Test simulation mode with Start/Stop and speed control
Test import/export round-trip