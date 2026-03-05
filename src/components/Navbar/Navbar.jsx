import { useRef } from 'react';
import {
    Download,
    Upload,
    Trash2,
    Play,
    Square,
    Zap,
    Share2,
    Github,
    Activity,
    Clock,
    AlertTriangle,
    LayoutTemplate,
} from 'lucide-react';
import useDesignStore from '../../store/useDesignStore';
import { exportToJSON, importFromJSON } from '../../utils/exportImport';
import { copyShareLink } from '../../utils/shareLink';
import { starterTemplate } from '../../data/starterTemplate';

export default function Navbar() {
    const fileInputRef = useRef(null);
    const {
        nodes,
        edges,
        isSimulating,
        simulationSpeed,
        chaosMode,
        startSimulation,
        stopSimulation,
        setSimulationSpeed,
        toggleChaosMode,
        clearCanvas,
        loadDesign,
    } = useDesignStore();
    const actualStats = useDesignStore((s) => s.actualStats) || { rps: 0, latency: 0, errorCount: 0 };
    const { rps, latency, errorCount } = actualStats;

    const handleExport = () => {
        exportToJSON(nodes, edges);
    };

    const handleImport = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const data = await importFromJSON(file);
            loadDesign(data);
        } catch (err) {
            alert(err.message);
        }
        e.target.value = '';
    };

    const handleShare = () => {
        const success = copyShareLink(nodes, edges);
        if (success) {
            alert('Share link copied to clipboard!');
        }
    };

    const handleClear = () => {
        if (nodes.length === 0 && edges.length === 0) return;
        if (confirm('Clear the entire canvas? This cannot be undone.')) {
            clearCanvas();
        }
    };

    const handleLoadTemplate = () => {
        if (nodes.length > 0) {
            if (!confirm('This will replace your current design with a sample template. Continue?')) return;
        }
        loadDesign(starterTemplate);
    };

    return (
        <nav className="h-12 flex items-center justify-between px-4 border-b border-[#1e2433] bg-[#0a0d18] relative z-50"
            style={{ borderBottomColor: 'rgba(129,140,248,0.15)' }}
        >
            {/* Logo */}
            <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#818cf8] to-[#c084fc] flex items-center justify-center">
                    <Activity className="w-4 h-4 text-white" />
                </div>
                <span className="font-mono font-bold text-sm tracking-wider text-[#e2e8f0]">
                    VibeArch
                </span>
            </div>

            {/* Center Controls */}
            <div className="flex items-center gap-2">
                {/* File Controls */}
                <div className="flex items-center gap-1 mr-3">
                    <NavButton icon={<LayoutTemplate className="w-3.5 h-3.5" />} label="Template" onClick={handleLoadTemplate} />
                    <NavButton icon={<Download className="w-3.5 h-3.5" />} label="Export" onClick={handleExport} />
                    <NavButton icon={<Upload className="w-3.5 h-3.5" />} label="Import" onClick={handleImport} />
                    <NavButton icon={<Share2 className="w-3.5 h-3.5" />} label="Share" onClick={handleShare} />
                    <NavButton icon={<Trash2 className="w-3.5 h-3.5" />} label="Clear" onClick={handleClear} variant="danger" />
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>

                {/* Divider */}
                <div className="w-px h-6 bg-[#1e2433] mx-1" />

                {/* Simulation Controls */}
                <div className="flex items-center gap-2">
                    {!isSimulating ? (
                        <button
                            onClick={startSimulation}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-[#818cf8]/10 text-[#818cf8] hover:bg-[#818cf8]/20 border border-[#818cf8]/20 transition-all cursor-pointer"
                        >
                            <Play className="w-3 h-3" fill="currentColor" />
                            Start Sim
                        </button>
                    ) : (
                        <button
                            onClick={stopSimulation}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-[#f87171]/10 text-[#f87171] hover:bg-[#f87171]/20 border border-[#f87171]/20 transition-all cursor-pointer"
                        >
                            <Square className="w-3 h-3" fill="currentColor" />
                            Stop
                        </button>
                    )}

                    {/* Speed */}
                    <div className="flex items-center gap-1.5 text-xs text-[#94a3b8]">
                        <span className="font-mono">{simulationSpeed.toFixed(1)}x</span>
                        <input
                            type="range"
                            min="0.5"
                            max="3"
                            step="0.5"
                            value={simulationSpeed}
                            onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
                            className="w-16 h-1 accent-[#818cf8] cursor-pointer"
                        />
                    </div>

                    {/* Chaos Mode */}
                    {isSimulating && (
                        <button
                            onClick={toggleChaosMode}
                            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${chaosMode
                                ? 'bg-[#f87171]/20 text-[#f87171] border border-[#f87171]/30'
                                : 'bg-[#1a1f2e] text-[#94a3b8] border border-[#1e2433] hover:text-[#e2e8f0]'
                                }`}
                        >
                            <Zap className="w-3 h-3" />
                            Chaos
                        </button>
                    )}
                </div>

                {/* Divider */}
                <div className="w-px h-6 bg-[#1e2433] mx-1" />

                {/* Live Stats */}
                <div className="flex items-center gap-3 text-xs font-mono">
                    <div className="flex items-center gap-1 text-[#4ade80] relative group cursor-default" title="Requests Per Second — Total HTTP requests handled by your system every second">
                        <Activity className="w-3 h-3" />
                        <span>{rps} RPS</span>
                        <div className="stat-tooltip">
                            <strong>Requests Per Second</strong><br />Total HTTP requests your system handles every second. Higher means more traffic.
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-[#fbbf24] relative group cursor-default" title="Latency — Average response time in milliseconds for each request">
                        <Clock className="w-3 h-3" />
                        <span>{latency}ms</span>
                        <div className="stat-tooltip">
                            <strong>Latency</strong><br />Average response time in milliseconds. Lower is better. &lt;50ms is excellent.
                        </div>
                    </div>
                    {errorCount > 0 && (
                        <div className="flex items-center gap-1 text-[#f87171] relative group cursor-default animate-[fadeIn_0.2s_ease]" title="Errors — Number of failed requests caused by node failures in chaos mode">
                            <AlertTriangle className="w-3 h-3" />
                            <span>{errorCount}</span>
                            <div className="stat-tooltip">
                                <strong>Errors</strong><br />Failed requests from node failures in chaos mode.
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right — GitHub */}
            <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-md text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#1a1f2e] transition-all"
            >
                <Github className="w-4 h-4" />
            </a>
        </nav>
    );
}

function NavButton({ icon, label, onClick, variant }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${variant === 'danger'
                ? 'text-[#94a3b8] hover:text-[#f87171] hover:bg-[#f87171]/10'
                : 'text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#1a1f2e]'
                }`}
            title={label}
        >
            {icon}
            <span className="hidden lg:inline">{label}</span>
        </button>
    );
}
