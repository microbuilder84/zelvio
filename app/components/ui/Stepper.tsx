interface StepperProps {
    steps: string[];
    currentStep: number; // 1-based index
}

export default function Stepper({ steps, currentStep }: StepperProps) {
    return (
        <div className="w-full flex items-center justify-between gap-4 mb-10 overflow-x-auto px-2">
            {steps.map((label, index) => {
                const stepNumber = index + 1;

                const isCompleted = stepNumber < currentStep;
                const isActive = stepNumber === currentStep;

                return (
                    <div
                        key={index}
                        className="min-w-[90px] flex flex-col items-center flex-shrink-0"
                    >
                        {/* Cerchio */}
                        <div
                            className={`
                                w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium
                                transition-all duration-200
                                ${isCompleted
                                    ? "bg-[var(--color-primary)] text-white"
                                    : isActive
                                        ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)] border border-[var(--color-primary)]"
                                        : "bg-gray-200 text-gray-500"
                                }
                            `}
                        >
                            {stepNumber}
                        </div>

                        {/* Label */}
                        <span
                            className={`
                                mt-2 text-[11px] md:text-xs text-center whitespace-nowrap
                                ${isActive
                                    ? "text-[var(--color-primary)] font-semibold"
                                    : "text-gray-500"
                                }
                            `}
                        >
                            {label}
                        </span>

                        {/* Linea di collegamento (solo se non è l’ultimo step) */}
                        {index < steps.length - 1 && (
                            <div
                                className={`
                                    h-[2px] w-full mt-4
                                    ${isCompleted
                                        ? "bg-[var(--color-primary)]"
                                        : "bg-gray-300"
                                    }
                                `}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}