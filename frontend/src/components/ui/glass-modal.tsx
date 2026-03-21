"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface GlassModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function GlassModal({ open, onClose, title, children }: GlassModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="fixed inset-0 z-50 m-auto max-w-lg w-full rounded-xl p-0 backdrop:bg-secondary/30 backdrop:backdrop-blur-sm"
    >
      <div className="glass-strong rounded-xl shadow-elevated p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          {title && <h2 className="headline-md text-on-surface">{title}</h2>}
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-surface-low transition-smooth cursor-pointer"
          >
            <X className="h-4 w-4 text-on-surface-variant" />
          </button>
        </div>

        {children}
      </div>
    </dialog>
  );
}
