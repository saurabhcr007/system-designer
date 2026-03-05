<div align="center">

```
███████╗██╗      ██████╗ ██╗    ██╗    ███████╗ ██████╗ ██████╗  ██████╗ ███████╗
██╔════╝██║     ██╔═══██╗██║    ██║    ██╔════╝██╔═══██╗██╔══██╗██╔════╝ ██╔════╝
█████╗  ██║     ██║   ██║██║ █╗ ██║    █████╗  ██║   ██║██████╔╝██║  ███╗█████╗  
██╔══╝  ██║     ██║   ██║██║███╗██║    ██╔══╝  ██║   ██║██╔══██╗██║   ██║██╔══╝  
██║     ███████╗╚██████╔╝╚███╔███╔╝    ██║     ╚██████╔╝██║  ██║╚██████╔╝███████╗
╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝     ╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝
```

### Design. Connect. Simulate.

**FlowForge** is an open-source, browser-based system architecture designer with real-time traffic simulation, node stress visualization, and topology-aware packet routing.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-flowforge.io-38bdf8?style=for-the-badge)](https://YOUR_USERNAME.github.io/flowforge)
[![MIT License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)](https://react.dev)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-f472b6?style=for-the-badge)](CONTRIBUTING.md)

![FlowForge Demo](./docs/demo.gif)

</div>

---

## ✨ What is FlowForge?

FlowForge lets you **visually design system architectures** — drag and drop components like Load Balancers, Kubernetes clusters, Databases, and Redis caches onto a canvas, connect them, and then **run a live simulation** to watch packets flow through your system in real time.

Unlike static diagram tools, FlowForge:

- Routes packets **along the topology you draw** — not randomly
- Shows **per-node stress** with color-coded heat (green → yellow → orange → red glow)
- Reacts dynamically when you **add or remove nodes mid-simulation**
- Works entirely in the browser — **no backend, no signup, no cost**

---

## 🎬 Features

### 🖱️ Visual Canvas
- Drag-and-drop components from the sidebar onto an infinite canvas
- Connect nodes by clicking source → target to draw edges
- Group nodes inside **VPC**, **Kubernetes**, and **Subnet** container nodes
- Double-click any node to rename it inline
- Right-click context menu: Edit, Duplicate, Set Entry Point, Delete

### 📦 Full Component Library

| Category | Components |
|---|---|
| **Frontend** | Web App, Mobile App, Tablet App, Desktop App, Smart Watch |
| **Traffic & Edge** | DNS, CDN, Load Balancer, API Gateway, WAF, Ingress, Reverse Proxy |
| **Compute** | Service, Container, Kubernetes Cluster, VM/Server, Lambda, Worker |
| **Storage** | PostgreSQL, MongoDB, Redis, Elasticsearch, S3/Blob, HDFS |
| **Networking** | VPC, Subnet, Firewall, VPN, NAT Gateway |
| **Messaging** | Kafka, RabbitMQ, SQS/Queue, Event Bus, WebSocket |
| **Monitoring** | Prometheus, Grafana, Logging, Alert Manager, APM/Tracing |
| **Security** | Auth Server/OAuth, Secret Manager, SSO/SAML |
| **AI & Agents** | AI Model, AI Agent, Vector DB, Embedding Service |

### 🎬 Live Simulation Engine
- **Topology-aware routing** — packets follow YOUR drawn edges via BFS path resolution
- **Fan-out support** — packets split at every branching node
- **Load Balancer awareness** — traffic distributes evenly across all connected downstream nodes
- **Dynamic rerouting** — add/remove nodes mid-sim and traffic adapts instantly
- **Configurable speed** — 0.5x to 3x simulation speed slider
- **Traffic load slider** — 1x to 10x traffic multiplier

### 🌡️ Node Heat Visualization
Every node has a live stress level (`currentRPS / maxCapacity`) displayed as:

| Stress | Color | Glow |
|---|---|---|
| 0–30% | 🟢 Green `#22c55e` | Soft glow |
| 30–60% | 🟡 Yellow `#eab308` | Moderate glow |
| 60–80% | 🟠 Orange `#f97316` | Strong glow |
| 80–100% | 🔴 Red `#ef4444` | Pulsing critical glow |

- Live **RPS badge** on each node during simulation
- **Overload warning** toast when a node hits 100% capacity
- 30% **packet drop** chance at overloaded nodes — increments error counter
- **Chaos Mode** — randomly fails nodes to simulate real-world outages

### 💾 Export / Import / Share
- **Export JSON** — save your architecture as a portable `.json` file
- **Import JSON** — load any previously saved design
- **Share Link** — base64-encodes your design into the URL for instant sharing

---

## 🚀 Quick Start

### Option 1 — Use the Live Version
Just go to **[YOUR_USERNAME.github.io/flowforge](https://YOUR_USERNAME.github.io/flowforge)** — no install needed.

### Option 2 — Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/flowforge.git
cd flowforge

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev

# 4. Open in browser
# http://localhost:5173
```

### Option 3 — Build for Production

```bash
npm run build
# Output in /dist — ready to serve as static files
```

---

## 🌐 Deploy to GitHub Pages

### Step 1 — Configure Vite

In `vite.config.js`, set the base to your repo name:

```js
export default defineConfig({
  base: '/flowforge/',   // replace with your repo name
  plugins: [react()],
})
```

### Step 2 — Add deploy script to `package.json`

```json
{
  "homepage": "https://YOUR_USERNAME.github.io/flowforge",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### Step 3 — Install gh-pages

```bash
npm install --save-dev gh-pages
```

### Step 4 — Deploy

```bash
npm run deploy
```

### Step 5 — Enable GitHub Pages

Go to your repo → **Settings** → **Pages** → Source: `gh-pages` branch → Save.

Your app will be live at `https://YOUR_USERNAME.github.io/flowforge` within 2 minutes.

---

## 🗂️ Project Structure

```
flowforge/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Sidebar/
│   │   │   ├── Sidebar.jsx              # Component palette
│   │   │   ├── ComponentCategory.jsx    # Collapsible category
│   │   │   └── DraggableComponent.jsx   # Draggable item
│   │   ├── Canvas/
│   │   │   ├── DesignCanvas.jsx         # React Flow canvas
│   │   │   ├── SimulationOverlay.jsx    # SVG packet animation
│   │   │   └── ContextMenu.jsx          # Right-click menu
│   │   ├── Nodes/
│   │   │   ├── BaseNode.jsx             # All standard nodes
│   │   │   ├── GroupNode.jsx            # VPC / K8s / Subnet
│   │   │   ├── ContainerNode.jsx        # Docker container
│   │   │   └── nodeTypes.js             # Node type registry
│   │   ├── Edges/
│   │   │   ├── AnimatedEdge.jsx         # Packet-carrying edge
│   │   │   └── edgeTypes.js
│   │   ├── Inspector/
│   │   │   └── NodeInspector.jsx        # Right panel
│   │   └── Navbar/
│   │       └── Navbar.jsx               # Top bar + stats
│   ├── engine/
│   │   └── SimulationEngine.js          # BFS routing + packets
│   ├── store/
│   │   └── useDesignStore.js            # Zustand global state
│   ├── data/
│   │   ├── components.js                # Component definitions
│   │   └── starterTemplate.js           # Default canvas layout
│   ├── hooks/
│   │   ├── useSimulation.js             # Sim loop hook
│   │   └── useKeyboardShortcuts.js
│   ├── utils/
│   │   ├── exportImport.js
│   │   ├── stressColor.js               # Green→Red interpolation
│   │   └── shareLink.js
│   ├── index.css                        # Global styles + keyframes
│   └── App.jsx
├── vite.config.js
└── package.json
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Delete` / `Backspace` | Delete selected node or edge |
| `Ctrl + Z` | Undo |
| `Ctrl + A` | Select all |
| `Ctrl + E` | Export JSON |
| `Ctrl + Shift + S` | Start / Stop simulation |
| `Escape` | Deselect / cancel connection |

---

## 🧱 Tech Stack

| Tool | Purpose |
|---|---|
| [React 18](https://react.dev) | UI framework |
| [React Flow](https://reactflow.dev) | Canvas, nodes, edges |
| [Zustand](https://zustand-demo.pmnd.rs) | State management |
| [Framer Motion](https://www.framer.com/motion/) | Node animations |
| [Tailwind CSS](https://tailwindcss.com) | Styling |
| [Lucide React](https://lucide.dev) | Icons |
| [Vite](https://vitejs.dev) | Build tool |
| [gh-pages](https://github.com/tschaub/gh-pages) | GitHub Pages deploy |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

```bash
# Fork the repo, then clone your fork
git clone https://github.com/YOUR_USERNAME/flowforge.git

# Create a feature branch
git checkout -b feature/my-new-component

# Make changes, then commit
git commit -m "feat: add Cassandra storage node"

# Push and open a Pull Request
git push origin feature/my-new-component
```

### Ideas for Contribution
- New component types (Nginx, RabbitMQ, Envoy, Istio...)
- Auto-layout algorithm for clean diagram arrangement
- Collaboration mode (multi-user via WebSockets)
- Export to PNG / PDF
- Import from Terraform / Kubernetes YAML
- Dark/light theme toggle
- Architecture templates (CQRS, Event Sourcing, Saga Pattern...)

---

## 📋 Roadmap

- [x] Drag-and-drop canvas
- [x] Topology-aware simulation
- [x] Node heat / stress visualization
- [x] Export / Import JSON
- [x] Share via URL
- [x] Frontend component tier
- [x] Kubernetes + VPC group nodes
- [ ] Auto-layout (ELK.js)
- [ ] Architecture templates library
- [ ] Export to PNG/PDF
- [ ] Collaborative editing
- [ ] Terraform YAML import
- [ ] Mobile responsive view

---

## 📄 License

MIT License — free to use, modify, and distribute.

See [LICENSE](LICENSE) for full details.

---

## 👤 Author

Built by **[Saurabh Chaudhary](https://github.com/saurabhcr007)**

<!-- - 💼 Backend & DevOps Engineer
- 🌐 [Portfolio](https://YOUR_PORTFOLIO_URL)
- 🐦 [Twitter/X](https://twitter.com/YOUR_HANDLE)
- 💬 [LinkedIn](https://linkedin.com/in/YOUR_HANDLE) -->

---

<div align="center">

If FlowForge helped you, please consider giving it a ⭐ — it helps others discover the project!

**[⭐ Star on GitHub](https://github.com/saurabhcr007/flowforge)**

</div>