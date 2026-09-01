"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
};

export default function Modal({
    isOpen,
    onClose,
    children,
}: ModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !isOpen) {
        return null;
    }

    return createPortal(
        <div
            className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50"
            onClick={onClose}
        >
            <div
                className="relative w-[500px] max-w-[90%] rounded-xl bg-white p-8"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 text-black"
                >
                    X
                </button>

                {children}
            </div>
        </div>,
        document.body
    );
}