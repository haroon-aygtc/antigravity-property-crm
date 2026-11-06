import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionTemplate } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ParallaxCardProps {
    children: React.ReactNode;
    className?: string;
    image: string;
    title: string;
    subtitle?: string;
}

export function ParallaxCard({ children, className, image, title, subtitle }: ParallaxCardProps) {
    const ref = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [-50, 50]);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    // Mouse move effect
    const mouseX = useSpring(0, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(0, { stiffness: 500, damping: 100 });

    function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    const maskImage = useMotionTemplate`radial-gradient(240px at ${mouseX}px ${mouseY}px, white, transparent)`;
    const style = { maskImage, WebkitMaskImage: maskImage };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={cn(
                "group relative overflow-hidden rounded-xl border bg-background shadow-xl transition-all hover:shadow-2xl",
                className
            )}
            onMouseMove={onMouseMove}
        >
            <div className="relative h-64 overflow-hidden">
                <motion.img
                    style={{ y }}
                    src={image}
                    alt={title}
                    className="h-[120%] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{title}</h3>
                    {subtitle && <p className="text-sm text-white/80">{subtitle}</p>}
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 bg-background">
                {children}
            </div>

            {/* Hover Reveal Effect */}
            <motion.div
                className="pointer-events-none absolute inset-0 z-20 bg-primary/5 transition-opacity duration-500 group-hover:opacity-100 opacity-0"
                style={style}
            />
        </motion.div>
    );
}
