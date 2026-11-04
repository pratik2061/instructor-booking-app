import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
    warning: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback(
        (message: string, type: ToastType = "info") => {
            const id = Math.random().toString(36).substring(2, 9);
            setToasts((prev) => [...prev, { id, message, type }]);

            setTimeout(() => {
                removeToast(id);
            }, 4000);
        },
        [removeToast]
    );

    const success = useCallback((msg: string) => showToast(msg, "success"), [showToast]);
    const error = useCallback((msg: string) => showToast(msg, "error"), [showToast]);
    const info = useCallback((msg: string) => showToast(msg, "info"), [showToast]);
    const warning = useCallback((msg: string) => showToast(msg, "warning"), [showToast]);

    return (
        <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
            {children}

            {/* Fixed Toast Container */}
            <div
                aria-live="assertive"
                className="fixed bottom-5 right-5 z-50 flex max-w-md flex-col gap-2.5 pointer-events-none"
            >
                {toasts.map((toast) => {
                    const isSuccess = toast.type === "success";
                    const isError = toast.type === "error";
                    const isWarning = toast.type === "warning";
                    const isInfo = toast.type === "info";

                    return (
                        <div
                            key={toast.id}
                            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-xl px-4 py-3 shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
                                isSuccess
                                    ? "bg-slate-900 text-white border border-emerald-500/30"
                                    : isError
                                    ? "bg-red-950 text-white border border-red-500/40"
                                    : isWarning
                                    ? "bg-amber-950 text-white border border-amber-500/40"
                                    : "bg-slate-900 text-white border border-slate-700"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                {isSuccess && (
                                    <CheckCircle2 size={19} className="text-emerald-400 shrink-0" />
                                )}
                                {isError && (
                                    <AlertCircle size={19} className="text-red-400 shrink-0" />
                                )}
                                {isWarning && (
                                    <AlertTriangle size={19} className="text-amber-400 shrink-0" />
                                )}
                                {isInfo && (
                                    <Info size={19} className="text-indigo-400 shrink-0" />
                                )}

                                <p className="text-sm font-medium leading-snug">{toast.message}</p>
                            </div>

                            <button
                                onClick={() => removeToast(toast.id)}
                                className="text-slate-400 hover:text-white transition ml-2 shrink-0"
                                aria-label="Close notification"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}

