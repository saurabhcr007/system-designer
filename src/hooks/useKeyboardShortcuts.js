import { useEffect } from 'react';
import useDesignStore from '../store/useDesignStore';
import { exportToJSON } from '../utils/exportImport';

export default function useKeyboardShortcuts() {
    const { undo, redo, deleteSelected, selectAll, nodes, edges, isSimulating, startSimulation, stopSimulation, clearSelection } = useDesignStore();

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Don't trigger shortcuts when typing in inputs
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            // Delete / Backspace — delete selected
            if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault();
                deleteSelected();
                return;
            }

            // Escape — deselect
            if (e.key === 'Escape') {
                clearSelection();
                return;
            }

            // Ctrl+Z — undo
            if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                undo();
                return;
            }

            // Ctrl+Y or Ctrl+Shift+Z — redo
            if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
                e.preventDefault();
                redo();
                return;
            }

            // Ctrl+A — select all
            if (e.ctrlKey && e.key === 'a') {
                e.preventDefault();
                selectAll();
                return;
            }

            // Ctrl+E — export
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                exportToJSON(nodes, edges);
                return;
            }

            // Ctrl+Shift+S — toggle simulation
            if (e.ctrlKey && e.shiftKey && e.key === 'S') {
                e.preventDefault();
                if (isSimulating) {
                    stopSimulation();
                } else {
                    startSimulation();
                }
                return;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo, deleteSelected, selectAll, clearSelection, nodes, edges, isSimulating, startSimulation, stopSimulation]);
}
