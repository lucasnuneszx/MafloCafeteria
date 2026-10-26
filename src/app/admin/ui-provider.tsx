"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, TriangleAlert, X } from "lucide-react";

const easeOut = [0.22, 1, 0.36, 1] as const;

// ==================== TOAST ====================

type ToastKind = "success" | "error" | "info";

interface ToastItem {
  id: number;
  message: string;
  kind: ToastKind;
}

const TOAST_ICON: Record<ToastKind, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  info: TriangleAlert,
};

const TOAST_STYLE: Record<ToastKind, string> = {
  success: "border-emerald-200 bg-white text-[#352B28]",
  error: "border-red-200 bg-white text-[#352B28]",
  info: "border-[#E8E2DD] bg-white text-[#352B28]",
};

const TOAST_ICON_COLOR: Record<ToastKind, string> = {
  success: "text-emerald-600",
  error: "text-red-600",
  info: "text-[#C58B66]",
};

interface ToastContextValue {
  showToast: (message: string, kind?: ToastKind) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within AdminUIProvider");
  return ctx.showToast;
}

// ==================== CONFIRM ====================

interface ConfirmOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

type ConfirmContextValue = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within AdminUIProvider");
  return ctx;
}

// ==================== PROVIDER ====================

export default function AdminUIProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastIdRef = useRef(0);

  const showToast = useCallback((message: string, kind: ToastKind = "success") => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, message, kind }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const [confirmState, setConfirmState] = useState<
    (ConfirmOptions & { resolve: (value: boolean) => void }) | null
  >(null);

  const confirmAction = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setConfirmState({ ...options, resolve });
    });
  }, []);

  function handleConfirmResult(value: boolean) {
    confirmState?.resolve(value);
    setConfirmState(null);
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      <ConfirmContext.Provider value={confirmAction}>
        {children}

        {/* Toast stack */}
        <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
          <AnimatePresence>
            {toasts.map((toast) => {
              const Icon = TOAST_ICON[toast.kind];
              return (
                <motion.div
                  key={toast.id}
                  layout
                  initial={{ opacity: 0, y: 16, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 40, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: easeOut }}
                  className={`pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 shadow-[0_16px_40px_rgba(53,43,40,0.15)] min-w-[260px] max-w-sm ${TOAST_STYLE[toast.kind]}`}
                >
                  <Icon size={18} className={`shrink-0 ${TOAST_ICON_COLOR[toast.kind]}`} strokeWidth={1.75} />
                  <p className="font-sans text-sm flex-1">{toast.message}</p>
                  <button
                    onClick={() => dismissToast(toast.id)}
                    className="text-[rgba(53,43,40,0.35)] hover:text-[#352B28] transition-colors duration-200"
                    aria-label="Fechar"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Confirm modal */}
        <AnimatePresence>
          {confirmState && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 px-4"
              onClick={() => handleConfirmResult(false)}
            >
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.96 }}
                transition={{ duration: 0.25, ease: easeOut }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-[0_30px_80px_rgba(0,0,0,0.25)]"
              >
                <div className="flex flex-col gap-2">
                  <div
                    className={`flex items-center justify-center w-11 h-11 rounded-full ${
                      confirmState.danger ? "bg-red-50 text-red-600" : "bg-[#C58B66]/10 text-[#C58B66]"
                    }`}
                  >
                    <TriangleAlert size={20} strokeWidth={1.75} />
                  </div>
                  <h2 className="font-heading text-xl text-[#352B28] mt-2">{confirmState.title}</h2>
                  {confirmState.description && (
                    <p className="font-sans text-sm text-[rgba(53,43,40,0.65)]">
                      {confirmState.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleConfirmResult(true)}
                    className={`flex-1 justify-center font-sans text-sm font-medium tracking-wide uppercase px-5 py-2.5 rounded-md text-white transition-colors duration-300 ${
                      confirmState.danger
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-[#C58B66] hover:bg-[#A86F4B]"
                    }`}
                  >
                    {confirmState.confirmLabel ?? "Confirmar"}
                  </motion.button>
                  <button
                    onClick={() => handleConfirmResult(false)}
                    className="flex-1 font-sans text-sm text-[rgba(53,43,40,0.65)] hover:text-[#352B28] border border-[#E8E2DD] rounded-md transition-colors duration-300"
                  >
                    {confirmState.cancelLabel ?? "Cancelar"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </ConfirmContext.Provider>
    </ToastContext.Provider>
  );
}
