"use client";

import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import confetti from "canvas-confetti";
import NumberFlow from "@number-flow/react";

interface PricingPlan {
    name: string;
    price: string;
    yearlyPrice: string;
    period: string; // Used for "per month"
    packagePeriod?: string; // Used for "per 3 months" etc
    features: string[];
    description: string;
    buttonText: string;
    href: string;
    isPopular: boolean;
}

interface PricingProps {
    plans: PricingPlan[];
    title?: string;
    description?: string;
}

export function Pricing({
    plans,
    title = "Choose Your Perfect Study Plan",
    description = "Flexible pricing for every student need\nAll plans include AC environment, WiFi, and your personal dedicated seat",
}: PricingProps) {
    const [isMonthly, setIsMonthly] = useState(true); // "Monthly" view means "Effective Monthly Price" (Toggle OFF)
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const switchRef = useRef<HTMLButtonElement>(null);

    const handleToggle = (checked: boolean) => {
        setIsMonthly(!checked);
        if (checked && switchRef.current) {
            const rect = switchRef.current.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            confetti({
                particleCount: 50,
                spread: 60,
                origin: {
                    x: x / window.innerWidth,
                    y: y / window.innerHeight,
                },
                colors: [
                    "hsl(var(--primary))",
                    "hsl(var(--accent))",
                    "hsl(var(--secondary))",
                    "hsl(var(--muted))",
                ],
                ticks: 200,
                gravity: 1.2,
                decay: 0.94,
                startVelocity: 30,
                shapes: ["circle"],
            });
        }
    };

    return (
        <div className="container py-20">
            <div className="text-center space-y-4 mb-12">
                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                    {title}
                </h2>
                <p className="text-muted-foreground text-lg whitespace-pre-line">
                    {description}
                </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 mb-24">
                <div className="flex items-center gap-4">
                    <span className={cn("text-sm font-medium transition-colors", isMonthly ? "text-foreground" : "text-muted-foreground")}>Monthly</span>
                    <Switch
                        ref={switchRef as any}
                        checked={!isMonthly}
                        onCheckedChange={handleToggle}
                        className="data-[state=checked]:bg-primary"
                    />
                    <span className={cn("text-sm font-medium transition-colors", !isMonthly ? "text-foreground" : "text-muted-foreground")}>Yearly</span>
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                    Long-term plans <span className="text-primary font-bold">(Better savings)</span>
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
                {plans.map((plan, index) => (
                    <motion.div
                        key={index}
                        initial={{ y: 50, opacity: 1 }}
                        whileInView={
                            isDesktop
                                ? {
                                    y: plan.isPopular ? -20 : 0,
                                    opacity: 1,
                                    scale: plan.isPopular ? 1.05 : 1.0,
                                }
                                : {}
                        }
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.6,
                            type: "spring",
                            stiffness: 100,
                            damping: 30,
                            delay: index * 0.1,
                        }}
                        className={cn(
                            `rounded-[2rem] border p-8 bg-background text-center flex flex-col relative shadow-lg hover:shadow-xl transition-shadow duration-300`,
                            plan.isPopular ? "border-primary/50 shadow-primary/10 ring-1 ring-primary/20" : "border-border",
                        )}
                    >
                        {plan.isPopular && (
                            <div className="absolute top-0 right-0 left-0 bg-primary/90 text-primary-foreground py-1.5 rounded-t-[2rem] text-sm font-semibold tracking-wide uppercase">
                                Most Popular
                            </div>
                        )}

                        <div className={cn("flex-1 flex flex-col", plan.isPopular && "mt-4")}>
                            <h3 className="text-xl font-bold text-foreground">
                                {plan.name}
                            </h3>

                            <div className="mt-6 flex flex-col items-center justify-center gap-1 min-h-[100px]">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-extrabold tracking-tight text-foreground">
                                        <NumberFlow
                                            value={
                                                isMonthly ? Number(plan.price) : Number(plan.yearlyPrice)
                                            }
                                            format={{
                                                style: "currency",
                                                currency: "INR",
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0,
                                            }}
                                            transformTiming={{
                                                duration: 500,
                                                easing: "ease-out",
                                            }}
                                            willChange
                                            className="font-variant-numeric: tabular-nums"
                                        />
                                    </span>
                                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                        / {isMonthly ? plan.period : (plan.packagePeriod || plan.period)}
                                    </span>
                                </div>
                                {/* Secondary price context */}
                                <p className="text-sm font-medium text-muted-foreground/80 h-5">
                                    {isMonthly && plan.yearlyPrice !== plan.price && `Pay ₹${Number(plan.yearlyPrice).toLocaleString()} total`}
                                    {!isMonthly && plan.yearlyPrice !== plan.price && `≈ ₹${Number(plan.price).toLocaleString()}/month`}
                                </p>
                            </div>

                            <div className="my-6 space-y-4 flex-1">
                                {/* Divider */}
                                <div className="h-px w-full bg-border/50"></div>

                                <ul className="space-y-4 text-left">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                                <Check className="h-3 w-3 text-primary" />
                                            </div>
                                            <span className="text-sm text-muted-foreground leading-relaxed">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-auto pt-6">
                                <Link
                                    href={plan.href}
                                    className={cn(
                                        buttonVariants({
                                            size: "lg",
                                        }),
                                        "w-full rounded-xl text-lg font-bold h-14 transition-all duration-300",
                                        plan.isPopular
                                            ? "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                                            : "bg-background border-2 border-border text-foreground hover:border-primary hover:text-primary hover:bg-primary/5"
                                    )}
                                >
                                    {plan.buttonText}
                                </Link>
                                <p className="mt-4 text-xs font-medium text-slate-400">
                                    {plan.description}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
