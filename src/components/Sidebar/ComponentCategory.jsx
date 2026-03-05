import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function ComponentCategory({ category }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="mb-0.5">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[11px] font-semibold text-white/40 hover:text-white/80 hover:bg-white/[0.04] rounded-lg transition-all duration-200 cursor-pointer group"
            >
                <span className="text-sm grayscale group-hover:grayscale-0 transition-all duration-300">{category.icon}</span>
                <span className="flex-1 text-left tracking-[0.15em] uppercase">{category.label}</span>
                <span className="text-[10px] text-white/15 font-mono mr-1 group-hover:text-white/30 transition-colors">
                    {category.components.length}
                </span>
                <ChevronDown
                    className={`w-3 h-3 text-white/20 group-hover:text-white/40 transition-all duration-300 ${isOpen ? 'rotate-0' : '-rotate-90'}`}
                />
            </button>

            <div
                className="overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{
                    maxHeight: isOpen ? `${category.components.length * 40}px` : '0px',
                    opacity: isOpen ? 1 : 0,
                }}
            >
                <div className="px-1.5 py-0.5 space-y-0.5">
                    {category.components.map((comp, i) => (
                        <DraggableItem key={comp.id} component={comp} index={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function DraggableItem({ component, index }) {
    const onDragStart = (e) => {
        e.dataTransfer.setData('application/reactflow-type', JSON.stringify(component));
        e.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div
            className="draggable-component flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-white/70 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] transition-all duration-200 group cursor-grab active:cursor-grabbing"
            draggable
            onDragStart={onDragStart}
            style={{ animationDelay: `${index * 20}ms` }}
        >
            <span className="text-sm opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200">{component.icon}</span>
            <span className="flex-1 truncate font-medium">{component.label}</span>
            <div
                className="w-2 h-2 rounded-full opacity-30 group-hover:opacity-80 group-hover:shadow-[0_0_8px] transition-all duration-300"
                style={{ backgroundColor: component.color, boxShadow: 'none', '--tw-shadow-color': component.color }}
            />
        </div>
    );
}
