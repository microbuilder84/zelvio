"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface AnimatedSectionProps {
    children: React.ReactNode;
    className?: string;
}

export default function AnimatedSection({ children, className = "" }: AnimatedSectionProps) {
    const controls = useAnimation();
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.2, // attiva quando il 20% della sezione è visibile
    });

    useEffect(() => {
        if (inView) {
            controls.start("visible");
        }
    }, [inView, controls]);

    return (
        <motion.section
            ref={ref}
            className={className}
            initial="hidden"
            animate={controls}
            variants={{
                hidden: {
                    opacity: 0,
                    y: 10, // ultra‑leggero, premium
                },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 0.45,
                        ease: "easeOut",
                    },
                },
            }}
        >
            {children}
        </motion.section>
    );
}