export default function Button({
    children,
    variant = "primary",
    disabled = false,
    onClick,
    type = "button",
}: {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "ghost";
    disabled?: boolean;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
}) {
    const base = `
      px-4 py-2
      font-medium
      rounded-[var(--radius-md)]
      transition-all
      duration-150
      text-sm
    `;

    const variants = {
        primary: `
        bg-[var(--color-primary)]
        text-white
        hover:bg-[var(--color-primary-dark)]
        disabled:opacity-60
        disabled:cursor-not-allowed
      `,
        secondary: `
        bg-white
        text-[var(--color-text)]
        border border-[var(--color-border)]
        hover:bg-[var(--color-bg-subtle)]
        disabled:opacity-60
        disabled:cursor-not-allowed
      `,
        ghost: `
        bg-transparent
        text-[var(--color-primary)]
        hover:bg-[var(--color-primary-soft)]
        disabled:opacity-60
        disabled:cursor-not-allowed
      `,
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${base} ${variants[variant]}`}
        >
            {children}
        </button>
    );
}