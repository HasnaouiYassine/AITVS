"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="absolute inset-0 z-50 flex min-h-screen items-center justify-center bg-navy/40 p-4"
      onClick={onClose}
    >
      <div className="card w-full max-w-lg p-0" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="text-lg font-bold text-ink">{title}</h2>
          <Button variant="ghost" size="sm" icon={<X size={18} />} onClick={onClose} aria-label="Close" />
        </div>
        <div className="p-6">{children}</div>
        {footer ? <div className="border-t border-line px-6 py-4">{footer}</div> : null}
      </div>
    </div>
  );
}
