import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function NotificationToast() {
  const { toasts, removeToast } = useApp();

  const iconTypes = {
    success: <CheckCircle className="w-4 h-4 text-emerald-500" />,
    info: <Info className="w-4 h-4 text-blue-500" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-500" />,
    error: <AlertCircle className="w-4 h-4 text-red-500" />
  };

  const borderColors = {
    success: "border-emerald-500/10 bg-white dark:bg-gray-950",
    info: "border-blue-500/10 bg-white dark:bg-gray-950",
    warning: "border-amber-500/10 bg-white dark:bg-gray-950",
    error: "border-red-500/10 bg-white dark:bg-gray-950"
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-start gap-3 p-4 border rounded-lg shadow-lg ${borderColors[toast.type]} backdrop-blur-md`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {iconTypes[toast.type]}
            </div>
            <div className="flex-1 flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-gray-900 dark:text-gray-50 uppercase tracking-wider">
                {toast.title}
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
