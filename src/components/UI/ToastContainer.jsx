import { useEffect } from 'react';
import useDesignStore from '../../store/useDesignStore';
import { AlertTriangle, Info, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function ToastContainer() {
    const { toasts, removeToast } = useDesignStore();

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
                ))}
            </AnimatePresence>
        </div>
    );
}

function ToastItem({ toast, onRemove }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onRemove();
        }, 5000); // Auto dismiss after 5 seconds
        return () => clearTimeout(timer);
    }, [onRemove]);

    const isWarning = toast.type === 'warning';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border min-w-[300px] max-w-sm backdrop-blur-xl ${isWarning
                    ? 'bg-[#ef4444]/10 border-[#ef4444]/30 text-[#fca5a5]'
                    : 'bg-[#111827]/90 border-[#1e2433] text-[#e2e8f0]'
                }`}
        >
            <div className={`mt-0.5 shrink-0 ${isWarning ? 'text-[#ef4444]' : 'text-[#818cf8]'}`}>
                {isWarning ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
            </div>

            <div className="flex-1 pr-2">
                <p className="text-sm font-medium leading-relaxed">{toast.message}</p>
            </div>

            <button
                onClick={onRemove}
                className="shrink-0 p-1 -mr-2 -mt-1 rounded-md opacity-50 hover:opacity-100 transition-opacity"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
}
