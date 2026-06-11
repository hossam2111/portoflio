"use client";

import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

export function ConfirmDialog({
  open,
  title = "Confirm Action",
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  danger = true,
}: ConfirmDialogProps) {
  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <div
        className="bg-[#0E141D] border border-[#1E293B] rounded-2xl p-6 w-full max-w-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {danger && (
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
            )}
            <h3 className="text-base font-semibold text-[#F1F5F9]">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-[#64748B] hover:text-[#F1F5F9] hover:bg-[#101722] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message */}
        <p className="text-sm text-[#94A3B8] mb-6 leading-relaxed">{message}</p>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-[#101722] text-[#94A3B8] hover:text-[#F1F5F9] border border-[#1E293B] hover:border-[#334155] transition-all cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => { onConfirm(); }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
              danger
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-[#F59E0B] hover:bg-[#D97706] text-[#05070A]"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook to easily use the confirm dialog
import { useState, useCallback } from "react";

interface UseConfirmOptions {
  title?: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
}

export function useConfirm() {
  const [state, setState] = useState<{
    open: boolean;
    options: UseConfirmOptions;
    resolve: ((value: boolean) => void) | null;
  }>({
    open: false,
    options: { message: "" },
    resolve: null,
  });

  const confirm = useCallback((options: UseConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({ open: true, options, resolve });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    state.resolve?.(true);
    setState((s) => ({ ...s, open: false, resolve: null }));
  }, [state]);

  const handleCancel = useCallback(() => {
    state.resolve?.(false);
    setState((s) => ({ ...s, open: false, resolve: null }));
  }, [state]);

  const Dialog = (
    <ConfirmDialog
      open={state.open}
      title={state.options.title}
      message={state.options.message}
      confirmLabel={state.options.confirmLabel}
      danger={state.options.danger ?? true}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );

  return { confirm, Dialog };
}
