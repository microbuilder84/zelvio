import React from "react";

interface InputProps {
    label?: string;
    error?: string;
    placeholder?: string;
    type?: string;
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
}

export default function Input({
    label,
    error,
    placeholder,
    type = "text",
    value,
    onChange,
    disabled = false,
}: InputProps) {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <label className="text-sm font-medium text-[var(--color-text)]">
                    {label}
                </label>
            )}

            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`
          w-full
          rounded-[var(--radius-md)]
          border border-[var(--color-border)]
          bg-white
          px-3 py-2
          text-[var(--color-text)]
          text-sm
          transition-all
          duration-150
          focus:border-[var(--color-primary)]
          focus:shadow-[0_0_0_3px_rgba(37,99,235,0.25)]
          disabled:opacity-60
          disabled:cursor-not-allowed
        `}
            />

            {error && (
                <p className="text-sm text-[var(--color-error)] mt-1">{error}</p>
            )}
        </div>
    );
}