import React from "react";

interface CardProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export default function Card({ title, children, className = "" }: CardProps) {
    return (
        <div
            className={`
        bg-white
        border border-[var(--color-border)]
        rounded-[var(--radius-lg)]
        shadow-[0_10px_25px_rgba(15,23,42,0.04)]
        p-4
        ${className}
      `}
        >
            {title && (
                <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
                    {title}
                </h2>
            )}

            <div>{children}</div>
        </div>
    );
}