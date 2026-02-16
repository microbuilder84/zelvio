import React from "react";
import Button from "./Button";

interface ModalProps {
    open: boolean;
    title?: string;
    children: React.ReactNode;
    onClose: () => void;
    onConfirm?: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
}

export default function Modal({
    open,
    title,
    children,
    onClose,
    onConfirm,
    confirmLabel = "Conferma",
    cancelLabel = "Annulla",
}: ModalProps) {
    if (!open) return null;

    return (
        <div
            className="
        fixed inset-0
        bg-black/40
        backdrop-blur-sm
        flex items-center justify-center
        z-50
      "
        >
            <div
                className="
          bg-white
          rounded-[var(--radius-lg)]
          shadow-xl
          w-full max-w-md
          p-6
        "
            >
                {title && (
                    <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">
                        {title}
                    </h2>
                )}

                <div className="mb-6">{children}</div>

                <div className="flex justify-end gap-3">
                    <Button variant="ghost" onClick={onClose}>
                        {cancelLabel}
                    </Button>

                    {onConfirm && (
                        <Button variant="primary" onClick={onConfirm}>
                            {confirmLabel}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}