import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import DesignCanvas from './components/Canvas/DesignCanvas';
import NodeInspector from './components/Inspector/NodeInspector';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import useSimulation from './hooks/useSimulation';
import useDesignStore from './store/useDesignStore';
import ToastContainer from './components/UI/ToastContainer';
import { PanelRightOpen } from 'lucide-react';
import { useMediaQuery } from './hooks/useMediaQuery';

export default function App() {
  useKeyboardShortcuts();
  useSimulation();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const { inspectorOpen, toggleInspector } = useDesignStore();

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#07090f]">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Center Canvas */}
        <DesignCanvas />

        {/* Right Inspector */}
        <NodeInspector />

        {/* Inspector Toggle (Desktop Only or when hidden on mobile) */}
        {!inspectorOpen && (
          <button
            onClick={toggleInspector}
            className={`
              absolute right-4 top-4 z-40 p-3 rounded-2xl bg-[#111827]/90 backdrop-blur-md border border-white/[0.06] text-white/40 hover:text-white hover:border-[#818cf8]/50 shadow-2xl transition-all cursor-pointer
              ${isMobile ? 'scale-90 opacity-80' : ''}
            `}
            title="Open Inspector"
          >
            <PanelRightOpen className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
}
