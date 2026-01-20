"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function HeroScroll() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    // Split Text Animations
    // Move "DIVINE" Up
    const yTop = useTransform(scrollYProgress, [0, 0.4], ["0%", "-100%"]);
    const opacityTop = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

    // Move "READING" Down
    const yBottom = useTransform(scrollYProgress, [0, 0.4], ["0%", "100%"]);
    const opacityBottom = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

    // Reveal "SPACE"
    const scaleCenter = useTransform(scrollYProgress, [0.1, 0.5], [0.8, 1]);
    const opacityCenter = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);
    const blurCenter = useTransform(scrollYProgress, [0.1, 0.4], [20, 0]);

    return (
        <div ref={containerRef} className="relative h-[200vh] z-0">
            <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center items-center bg-background">

                {/* Reveal Layer (Background) */}
                <motion.div
                    style={{
                        scale: scaleCenter,
                        opacity: opacityCenter,
                        filter: useTransform(blurCenter, (v) => `blur(${v}px)`),
                    }}
                    className="absolute inset-0 flex flex-col items-center justify-center z-0 pointer-events-none"
                >
                    <h1 className="font-display text-[15vw] leading-none font-bold tracking-tighter text-foreground mix-blend-difference">
                        SPACE
                    </h1>
                    <p className="font-mono text-sm md:text-lg text-muted-foreground tracking-[0.5em] mt-8 uppercase">
                        Sanctuary for Focus
                    </p>
                </motion.div>

                {/* Split Text Layer (Foreground) */}
                <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none mix-blend-difference">
                    <motion.h2
                        style={{ y: yTop, opacity: opacityTop }}
                        className="font-display text-[12vw] leading-[0.85] font-medium tracking-tighter text-foreground will-change-transform"
                    >
                        DIVINE
                    </motion.h2>
                    <motion.h2
                        style={{ y: yBottom, opacity: opacityBottom }}
                        className="font-display text-[12vw] leading-[0.85] font-medium tracking-tighter text-foreground will-change-transform"
                    >
                        READING
                    </motion.h2>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                >
                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Scroll</span>
                    <div className="w-[1px] h-12 bg-muted-foreground/50 overflow-hidden">
                        <div className="w-full h-1/2 bg-foreground animate-accordion-down" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
