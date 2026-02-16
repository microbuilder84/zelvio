interface GridProps {
    children: React.ReactNode;
    cols?: number;
    mdCols?: number;
    lgCols?: number;
    gap?: string;
    className?: string;
}

export default function Grid({
    children,
    cols = 1,
    mdCols = 2,
    lgCols = 3,
    gap = "gap-6",
    className = "",
}: GridProps) {
    return (
        <div
            className={`
          grid
          grid-cols-${cols}
          md:grid-cols-${mdCols}
          lg:grid-cols-${lgCols}
          ${gap}
          ${className}
        `}
        >
            {children}
        </div>
    );
}