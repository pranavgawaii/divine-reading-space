"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { BookOpen, Coffee, Lamp, Glasses, Bookmark, PenTool, Library, GraduationCap, Lightbulb, Feather } from "lucide-react";

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

    // Icon fade out on scroll
    const iconOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    return (
        <div ref={containerRef} className="relative h-[200vh] z-0">
            <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center items-center bg-background">

                {/* Decorative Icons - Scattered Across Hero */}
                <motion.div
                    style={{ opacity: iconOpacity }}
                    className="absolute inset-0 hidden lg:block z-20 pointer-events-none"
                >
                    {/* Book - Top Left */}
                    <motion.div
                        animate={{ y: [0, -15, 0], rotate: [-5, 5, -5] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[15%] left-[8%] opacity-40 hover:opacity-70 transition-opacity"
                    >
                        <BookOpen className="w-16 h-16 text-foreground/60" strokeWidth={1.5} />
                    </motion.div>

                    {/* Lamp - Left Middle */}
                    <motion.div
                        animate={{ y: [0, 20, 0], rotate: [5, -5, 5] }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        className="absolute top-[45%] left-[12%] opacity-30 hover:opacity-60 transition-opacity"
                    >
                        <Lamp className="w-14 h-14 text-foreground/50" strokeWidth={1.5} />
                    </motion.div>

                    {/* Coffee - Bottom Left */}
                    <motion.div
                        animate={{ y: [0, -10, 0], rotate: [-3, 3, -3] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-[20%] left-[6%] opacity-35 hover:opacity-65 transition-opacity"
                    >
                        <Coffee className="w-12 h-12 text-foreground/55" strokeWidth={1.5} />
                    </motion.div>

                    {/* Glasses - Top Right */}
                    <motion.div
                        animate={{ y: [0, 15, 0], rotate: [5, -5, 5] }}
                        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                        className="absolute top-[20%] right-[10%] opacity-40 hover:opacity-70 transition-opacity"
                    >
                        <Glasses className="w-14 h-14 text-foreground/60" strokeWidth={1.5} />
                    </motion.div>

                    {/* Bookmark - Right Middle */}
                    <motion.div
                        animate={{ y: [0, -18, 0], rotate: [-4, 4, -4] }}
                        transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                        className="absolute top-[50%] right-[8%] opacity-35 hover:opacity-65 transition-opacity"
                    >
                        <Bookmark className="w-12 h-12 text-foreground/55" strokeWidth={1.5} />
                    </motion.div>

                    {/* Pen - Bottom Right */}
                    <motion.div
                        animate={{ y: [0, 12, 0], rotate: [3, -3, 3] }}
                        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                        className="absolute bottom-[25%] right-[12%] opacity-30 hover:opacity-60 transition-opacity"
                    >
                        <PenTool className="w-13 h-13 text-foreground/50" strokeWidth={1.5} />
                    </motion.div>

                    {/* Library - Top Center Left */}
                    <motion.div
                        animate={{ y: [0, -12, 0], rotate: [2, -2, 2] }}
                        transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                        className="absolute top-[12%] left-[25%] opacity-25 hover:opacity-55 transition-opacity"
                    >
                        <Library className="w-11 h-11 text-foreground/45" strokeWidth={1.5} />
                    </motion.div>

                    {/* GraduationCap - Top Center Right */}
                    <motion.div
                        animate={{ y: [0, 14, 0], rotate: [-2, 2, -2] }}
                        transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                        className="absolute top-[10%] right-[28%] opacity-28 hover:opacity-58 transition-opacity"
                    >
                        <GraduationCap className="w-13 h-13 text-foreground/48" strokeWidth={1.5} />
                    </motion.div>

                    {/* Lightbulb - Bottom Center Left */}
                    <motion.div
                        animate={{ y: [0, -16, 0], rotate: [4, -4, 4] }}
                        transition={{ duration: 6.3, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
                        className="absolute bottom-[15%] left-[22%] opacity-32 hover:opacity-62 transition-opacity"
                    >
                        <Lightbulb className="w-12 h-12 text-foreground/52" strokeWidth={1.5} />
                    </motion.div>

                    {/* Feather - Bottom Center Right */}
                    <motion.div
                        animate={{ y: [0, 10, 0], rotate: [-3, 3, -3] }}
                        transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                        className="absolute bottom-[18%] right-[26%] opacity-27 hover:opacity-57 transition-opacity"
                    >
                        <Feather className="w-11 h-11 text-foreground/47" strokeWidth={1.5} />
                    </motion.div>
                </motion.div>

                {/* Reveal Layer (Background) */}
                <motion.div
                    style={{
                        scale: scaleCenter,
                        opacity: opacityCenter,
                        filter: useTransform(blurCenter, (v) => `blur(${v}px)`),
                    }}
                    className="absolute inset-0 flex flex-col items-center justify-center z-0 pointer-events-none"
                >
                    <h1 className="font-display text-[15vw] leading-none font-bold tracking-tighter text-foreground">
                        SPACE
                    </h1>
                    <p className="font-mono text-sm md:text-lg text-foreground/80 tracking-[0.5em] mt-8 uppercase">
                        Sanctuary for Readers
                    </p>
                </motion.div>

                {/* Split Text Layer (Foreground) */}
                <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none mix-blend-difference">
                    <motion.h2
                        style={{ y: yTop, opacity: opacityTop }}
                        className="font-display text-[12vw] leading-[0.85] font-medium tracking-tighter text-white will-change-transform"
                    >
                        DIVINE
                    </motion.h2>
                    <motion.h2
                        style={{ y: yBottom, opacity: opacityBottom }}
                        className="font-display text-[12vw] leading-[0.85] font-medium tracking-tighter text-white will-change-transform"
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
