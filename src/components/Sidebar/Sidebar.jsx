import { Search, Sparkles, X } from 'lucide-react';
import { useState, useMemo } from 'react';
import { componentCategories } from '../../data/components';
import ComponentCategory from './ComponentCategory';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import useDesignStore from '../../store/useDesignStore';

export default function Sidebar() {
    const [search, setSearch] = useState('');
    const isMobile = useMediaQuery('(max-width: 768px)');
    const sidebarOpen = useDesignStore((s) => s.sidebarOpen);
    const setSidebarOpen = useDesignStore((s) => s.setSidebarOpen);

    const filteredCategories = useMemo(() => {
        if (!search.trim()) return componentCategories;
        const q = search.toLowerCase();
        return componentCategories
            .map((cat) => ({
                ...cat,
                components: cat.components.filter(
                    (c) =>
                        c.label.toLowerCase().includes(q) ||
                        c.id.toLowerCase().includes(q)
                ),
            }))
            .filter((cat) => cat.components.length > 0);
    }, [search]);

    const totalComponents = componentCategories.reduce((sum, c) => sum + c.components.length, 0);

    return (
        <>
            {/* Mobile Backdrop */}
            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside className={`
                ${isMobile ? 'fixed inset-y-0 left-0 z-50 w-[85%] max-w-[320px] shadow-2xl transition-transform duration-300 ease-out' : 'w-[300px] relative'}
                ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
                h-full flex flex-col bg-[#0a0e19]/95 backdrop-blur-xl border-r border-white/[0.06] shrink-0 sidebar-glass
            `}>
                {/* Header */}
                <div className="p-4 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#818cf8] to-[#c084fc] flex items-center justify-center">
                            <Sparkles className="w-3 h-3 text-white" />
                        </div>
                        <h2 className="text-[11px] font-bold text-white/50 tracking-[0.2em] uppercase">
                            Components
                        </h2>
                        {isMobile ? (
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="ml-auto w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.04] text-white/40 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        ) : (
                            <span className="ml-auto text-[10px] text-white/20 font-mono">{totalComponents}</span>
                        )}
                    </div>
                    <div className="relative group mt-2">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#818cf8] transition-colors duration-300 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search components..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs text-white/90 placeholder-white/30 focus:outline-none focus:border-[#818cf8]/40 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(129,140,248,0.08)] transition-all duration-300"
                        />
                    </div>
                </div>

                {/* Component List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1 sidebar-scroll">
                    {filteredCategories.map((category) => (
                        <ComponentCategory key={category.id} category={category} />
                    ))}
                    {filteredCategories.length === 0 && (
                        <div className="text-center text-xs text-white/20 py-12 px-4">
                            <div className="text-2xl mb-2 opacity-40">🔍</div>
                            No components match "{search}"
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-white/[0.04]">
                    <p className="text-[10px] text-white/15 text-center font-mono tracking-wider">
                        {isMobile ? 'Tap component to place' : 'Drag to canvas • Right-click for menu'}
                    </p>
                </div>
            </aside>
        </>
    );
}
