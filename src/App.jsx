import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import DesignCanvas from './components/Canvas/DesignCanvas';
import NodeInspector from './components/Inspector/NodeInspector';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import useSimulation from './hooks/useSimulation';
import useDesignStore from './store/useDesignStore';
import ToastContainer from './components/UI/ToastContainer';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';

export default function App() {
  useKeyboardShortcuts();
  useSimulation();

  const { inspectorOpen, toggleInspector } = useDesignStore();

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#07090f]">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Center Canvas */}
        <DesignCanvas />

        {/* Right Inspector */}
        <NodeInspector />

        {/* Inspector Toggle (when collapsed) */}
        {!inspectorOpen && (
          <button
            onClick={toggleInspector}
            className="absolute right-3 top-16 z-40 p-2 rounded-lg bg-[#111827] border border-[#1e2433] text-[#94a3b8] hover:text-[#e2e8f0] hover:border-[#818cf8]/50 transition-all cursor-pointer"
            title="Open Inspector"
          >
            <PanelRightOpen className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
}
