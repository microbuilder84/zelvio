interface BadgeProps {
    children: React.ReactNode;
    variant?: "default" | "success" | "warning" | "danger";
    className?: string;
}

export default function Badge({
    children,
    variant = "default",
    className = "",
}: BadgeProps) {
    const variants = {
        default: `
        bg-[var(--color-primary-soft)]
        text-[var(--color-primary)]
      `,
        success: `
        bg-green-100
        text-green-700
      `,
        warning: `
        bg-yellow-100
        text-yellow-700
      `,
        danger: `
        bg-red-100
        text-red-700
      `,
    };

    return (
        <span
            className={`
          inline-flex
          items-center
          px-2 py-1
          text-xs
          font-medium
          rounded-[var(--radius-md)]
          ${variants[variant]}
          ${className}
        `}
        >
            {children}
        </span>
    );
}