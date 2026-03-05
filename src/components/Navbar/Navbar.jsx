import { useRef, useState } from 'react';
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
    Menu,
    MoreVertical,
    X,
} from 'lucide-react';
import useDesignStore from '../../store/useDesignStore';
import { exportToJSON, importFromJSON } from '../../utils/exportImport';
import { copyShareLink } from '../../utils/shareLink';
import { starterTemplate } from '../../data/starterTemplate';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export default function Navbar() {
    const fileInputRef = useRef(null);
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        toggleSidebar,
    } = useDesignStore();
    const actualStats = useDesignStore((s) => s.actualStats) || { rps: 0, latency: 0, errorCount: 0 };
    const { rps, latency, errorCount } = actualStats;

    const handleExport = () => { exportToJSON(nodes, edges); setIsMenuOpen(false); };
    const handleImport = () => { fileInputRef.current?.click(); };
    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const data = await importFromJSON(file);
            loadDesign(data);
            setIsMenuOpen(false);
        } catch (err) { alert(err.message); }
        e.target.value = '';
    };

    const handleShare = () => {
        const success = copyShareLink(nodes, edges);
        if (success) alert('Share link copied to clipboard!');
        setIsMenuOpen(false);
    };

    const handleClear = () => {
        if (nodes.length === 0 && edges.length === 0) return;
        if (confirm('Clear the entire canvas? This cannot be undone.')) {
            clearCanvas();
            setIsMenuOpen(false);
        }
    };

    const handleLoadTemplate = () => {
        if (nodes.length > 0) {
            if (!confirm('This will replace your current design with a sample template. Continue?')) return;
        }
        loadDesign(starterTemplate);
        setIsMenuOpen(false);
    };

    return (
        <>
            <nav className="h-12 flex items-center justify-between px-4 border-b border-[#1e2433] bg-[#0a0d18] relative z-50">
                {/* Left - Logo & Mobile Switch */}
                <div className="flex items-center gap-3">
                    {isMobile && (
                        <button
                            onClick={toggleSidebar}
                            className="p-1.5 rounded-lg bg-white/[0.04] text-white/60 hover:text-white transition-colors"
                        >
                            <Menu className="w-4 h-4" />
                        </button>
                    )}
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#818cf8] to-[#c084fc] flex items-center justify-center">
                            <Activity className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-mono font-bold text-sm tracking-wider text-[#e2e8f0]">
                            FlowForge
                        </span>
                    </div>
                </div>

                {/* Center / Right Controls */}
                <div className="flex items-center gap-2">
                    {isMobile ? (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={isSimulating ? stopSimulation : startSimulation}
                                className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all ${isSimulating
                                    ? 'bg-[#f87171]/10 text-[#f87171] border border-[#f87171]/20'
                                    : 'bg-[#818cf8]/10 text-[#818cf8] border border-[#818cf8]/20'
                                    }`}
                            >
                                {isSimulating ? <Square className="w-3.5 h-3.5" fill="currentColor" /> : <Play className="w-3.5 h-3.5" fill="currentColor" />}
                            </button>
                            <button
                                onClick={() => setIsMenuOpen(true)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.04] text-white/60 hover:text-white"
                            >
                                <MoreVertical className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            {/* File Controls */}
                            <div className="flex items-center gap-1 mr-3">
                                <NavButton icon={<LayoutTemplate className="w-3.5 h-3.5" />} label="Template" onClick={handleLoadTemplate} />
                                <NavButton icon={<Download className="w-3.5 h-3.5" />} label="Export" onClick={handleExport} />
                                <NavButton icon={<Upload className="w-3.5 h-3.5" />} label="Import" onClick={handleImport} />
                                <NavButton icon={<Share2 className="w-3.5 h-3.5" />} label="Share" onClick={handleShare} />
                                <NavButton icon={<Trash2 className="w-3.5 h-3.5" />} label="Clear" onClick={handleClear} variant="danger" />
                                <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileChange} className="hidden" />
                            </div>

                            <div className="w-px h-6 bg-[#1e2433] mx-1" />

                            {/* Simulation Controls */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={isSimulating ? stopSimulation : startSimulation}
                                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${isSimulating
                                        ? 'bg-[#f87171]/10 text-[#f87171] border border-[#f87171]/20'
                                        : 'bg-[#818cf8]/10 text-[#818cf8] border border-[#818cf8]/20'
                                        }`}
                                >
                                    {isSimulating ? <Square className="w-3 h-3" fill="currentColor" /> : <Play className="w-3 h-3" fill="currentColor" />}
                                    {isSimulating ? 'Stop' : 'Start Sim'}
                                </button>

                                <div className="flex items-center gap-1.5 text-xs text-[#94a3b8]">
                                    <span className="font-mono">{simulationSpeed.toFixed(1)}x</span>
                                    <input
                                        type="range" min="0.5" max="3" step="0.5"
                                        value={simulationSpeed}
                                        onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
                                        className="w-16 h-1 accent-[#818cf8] cursor-pointer"
                                    />
                                </div>

                                {isSimulating && (
                                    <button
                                        onClick={toggleChaosMode}
                                        className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${chaosMode ? 'bg-[#f87171]/20 text-[#f87171] border border-[#f87171]/30' : 'bg-[#1a1f2e] text-[#94a3b8] border border-[#1e2433]'
                                            }`}
                                    >
                                        <Zap className="w-3 h-3" />
                                        <span className="hidden xl:inline">Chaos</span>
                                    </button>
                                )}
                            </div>

                            <div className="w-px h-6 bg-[#1e2433] mx-1" />

                            {/* Live Stats */}
                            <div className="flex items-center gap-3 text-xs font-mono">
                                <div className="flex items-center gap-1 text-[#4ade80]" title="Requests Per Second">
                                    <Activity className="w-3 h-3" />
                                    <span>{rps} RPS</span>
                                </div>
                                <div className="flex items-center gap-1 text-[#fbbf24]" title="Latency">
                                    <Clock className="w-3 h-3" />
                                    <span>{latency}ms</span>
                                </div>
                                {errorCount > 0 && (
                                    <div className="flex items-center gap-1 text-[#f87171]">
                                        <AlertTriangle className="w-3 h-3" />
                                        <span>{errorCount}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {!isMobile && (
                        <a
                            href="https://github.com/saurabhcr007/system-designer" target="_blank" rel="noopener noreferrer"
                            className="p-1.5 rounded-md text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#1a1f2e] transition-all ml-1"
                        >
                            <Github className="w-4 h-4" />
                        </a>
                    )}
                </div>
            </nav>

            {/* Mobile Bottom Sheet Menu */}
            {isMobile && isMenuOpen && (
                <div className="fixed inset-0 z-[100] flex flex-col justify-end">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease]"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    <div className="relative bg-[#0a0d18] border-t border-white/[0.1] rounded-t-3xl p-6 shadow-2xl animate-[slideUp_0.3s_ease-out]">
                        <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-6" />

                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-bold text-white/90 uppercase tracking-widest">Controls</h3>
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 -mr-2 text-white/40"><X className="w-5 h-5" /></button>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-3 mb-8">
                            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-center">
                                <Activity className="w-4 h-4 text-[#4ade80] mx-auto mb-1.5" />
                                <div className="text-[10px] text-white/40 uppercase mb-0.5">RPS</div>
                                <div className="text-xs font-bold text-white font-mono">{rps}</div>
                            </div>
                            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-center">
                                <Clock className="w-4 h-4 text-[#fbbf24] mx-auto mb-1.5" />
                                <div className="text-[10px] text-white/40 uppercase mb-0.5">Latency</div>
                                <div className="text-xs font-bold text-white font-mono">{latency}ms</div>
                            </div>
                            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-center">
                                <AlertTriangle className="w-4 h-4 text-[#f87171] mx-auto mb-1.5" />
                                <div className="text-[10px] text-white/40 uppercase mb-0.5">Errors</div>
                                <div className="text-xs font-bold text-white font-mono">{errorCount}</div>
                            </div>
                        </div>

                        {/* Simulation Settings */}
                        <div className="space-y-6 mb-8">
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider">Sim Speed</span>
                                    <span className="text-xs font-mono text-[#818cf8]">{simulationSpeed.toFixed(1)}x</span>
                                </div>
                                <input
                                    type="range" min="0.5" max="3" step="0.5"
                                    value={simulationSpeed}
                                    onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
                                    className="w-full h-2 accent-[#818cf8] bg-white/5 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                            <button
                                onClick={toggleChaosMode}
                                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${chaosMode ? 'bg-[#f87171]/10 border-[#f87171]/30 text-[#f87171]' : 'bg-white/[0.03] border-white/5 text-white/60'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Zap className="w-4 h-4" />
                                    <span className="text-xs font-semibold">Chaos Mode</span>
                                </div>
                                <div className={`w-10 h-5 rounded-full relative transition-colors ${chaosMode ? 'bg-[#f87171]' : 'bg-white/10'}`}>
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${chaosMode ? 'right-1' : 'left-1'}`} />
                                </div>
                            </button>
                        </div>

                        {/* File Actions */}
                        <div className="grid grid-cols-2 gap-3 pb-4">
                            <NavButtonMobile icon={<LayoutTemplate className="w-4 h-4" />} label="Sample Template" onClick={handleLoadTemplate} />
                            <NavButtonMobile icon={<Download className="w-4 h-4" />} label="Export JSON" onClick={handleExport} />
                            <NavButtonMobile icon={<Upload className="w-4 h-4" />} label="Import JSON" onClick={handleImport} />
                            <NavButtonMobile icon={<Share2 className="w-4 h-4" />} label="Share Link" onClick={handleShare} />
                            <NavButtonMobile icon={<Trash2 className="w-4 h-4" />} label="Clear Canvas" onClick={handleClear} variant="danger" />
                            <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileChange} className="hidden" />
                        </div>
                    </div>
                </div>
            )}
        </>
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

function NavButtonMobile({ icon, label, onClick, variant }) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all ${variant === 'danger'
                ? 'bg-[#f87171]/5 border-[#f87171]/20 text-[#f87171]/80 hover:bg-[#f87171]/10'
                : 'bg-white/[0.03] border-white/5 text-white/70 hover:bg-white/[0.06]'
                }`}
        >
            {icon}
            <span className="text-[10px] font-semibold">{label}</span>
        </button>
    );
}
