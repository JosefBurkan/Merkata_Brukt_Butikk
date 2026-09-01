"use client";

import { useState, type ReactNode } from "react";
import Modal from "./Modal";

type Product = {
    id: number;
    name: string;
    age: number;
    description: string;
    price: number;
};

type ModalButtonProps = {
    product: Product;
    children: ReactNode;
};

export default function ModalButton({
    product,
    children,
}: ModalButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div
                className="cursor-pointer"
                onClick={() => {
                    console.log("KLIKK!");
                    setIsOpen(true);
                }}
            >
                {children}
            </div>

            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <div className="text-black">
                    <h2 className="text-2xl font-bold">
                        {product.name}
                    </h2>

                    <p>
                        Alder: {product.age} år
                    </p>

                    <p>
                        Beskrivelse: {product.description}
                    </p>

                    <p>
                        Pris: {product.price},-
                    </p>
                </div>
            </Modal>
        </>
    );
}