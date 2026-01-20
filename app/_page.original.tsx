'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Wind, Wifi, Zap, ShieldCheck, Users, Star, Menu, X, ArrowUpRight } from 'lucide-react'
import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import { Pricing } from '@/components/blocks/pricing'
import { HeroScroll } from '@/components/blocks/hero-scroll'

// --- COMPONENTS ---

function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="fixed w-full z-50 px-6 py-6 flex justify-between items-center mix-blend-exclusion text-white bg-transparent pointer-events-none">
            <div className="pointer-events-auto">
                <Link href="/" className="text-xs font-mono tracking-widest uppercase opacity-80 hover:opacity-100 transition-opacity flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    DIVINE SPACE © 2026
                </Link>
            </div>

            <div className="pointer-events-auto hidden md:flex items-center gap-8">
                <NavLink href="#features">Index</NavLink>
                <NavLink href="#pricing">Membership</NavLink>
                <NavLink href="#location">Contact</NavLink>
                <Link
                    href="/sign-up"
                    className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase opacity-60 hover:opacity-100 transition-opacity"
                >
                    <span className="w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Reserve
                </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden pointer-events-auto p-2 text-white mix-blend-difference">
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
        </nav>
    )
}

function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <a href={href} className="group flex items-center gap-2 text-xs font-mono tracking-widest uppercase opacity-60 hover:opacity-100 transition-opacity">
            <span className="w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
            {children}
        </a>
    )
}

// --- MAIN PAGE ---

export default function LandingPage() {
    return (
        <div className="min-h-screen font-sans bg-background text-foreground selection:bg-foreground selection:text-background">
            <Navbar />

            {/* HERO SCROLL ANIMATION */}
            <HeroScroll />

            {/* INTRO SECTION */}
            <section className="relative z-10 bg-background pt-0 pb-24 border-t border-border/20">
                <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                        <div className="md:col-span-4">
                            <span className="block text-xs font-mono text-muted-foreground tracking-widest uppercase mb-4">The Methodology</span>
                            <h3 className="font-display text-3xl font-medium tracking-tight leading-tight">
                                Crafting silence in a <br />
                                noisy world.
                            </h3>
                        </div>
                        <div className="md:col-span-8 flex flex-col gap-8">
                            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl">
                                We build environments that feel inevitable. By merging rigorous acoustic engineering with avant-garde aesthetics, we create workspaces that are not just functional, but silent. Divine Space exists at the intersection of precision and focus.
                            </p>
                            <div className="flex flex-wrap gap-4 mt-4">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-secondary/30 text-xs font-mono text-muted-foreground">
                                    <Wind className="h-3 w-3" /> Climate Control
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-secondary/30 text-xs font-mono text-muted-foreground">
                                    <ShieldCheck className="h-3 w-3" /> Acoustic Isolation
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-secondary/30 text-xs font-mono text-muted-foreground">
                                    <Users className="h-3 w-3" /> Curated Community
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BENTO GRID FEATURES */}
            <section id="features" className="px-6 pb-32 bg-background">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-end justify-between mb-16 border-b border-border/20 pb-6">
                        <h2 className="font-display text-4xl md:text-6xl font-medium tracking-tighter">Architecture</h2>
                        <span className="hidden md:block text-xs font-mono text-muted-foreground tracking-widest uppercase">EST. 2024</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">

                        {/* Feature 1 */}
                        <article className="group relative cursor-pointer">
                            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-secondary mb-6 border border-border/10">
                                <div className="absolute inset-0 bg-gradient-to-br from-background/0 to-background/50 z-10" />
                                <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                                    <Wind className="h-32 w-32 text-muted-foreground/10 group-hover:text-foreground/80 transition-colors duration-500" />
                                </div>
                                <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                    <div className="w-10 h-10 bg-foreground rounded-full flex items-center justify-center text-background">
                                        <ArrowUpRight className="h-5 w-5" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-display font-medium mb-1 group-hover:text-primary transition-colors">Atmospheric Control</h3>
                                    <p className="text-sm text-muted-foreground font-mono">HVAC / Air Quality / 24°C Constant</p>
                                </div>
                            </div>
                        </article>

                        {/* Feature 2 */}
                        <article className="group relative cursor-pointer md:mt-24">
                            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-secondary mb-6 border border-border/10">
                                <div className="absolute inset-0 bg-gradient-to-br from-background/0 to-background/50 z-10" />
                                <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                                    <Wifi className="h-32 w-32 text-muted-foreground/10 group-hover:text-foreground/80 transition-colors duration-500" />
                                </div>
                                <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                    <div className="w-10 h-10 bg-foreground rounded-full flex items-center justify-center text-background">
                                        <ArrowUpRight className="h-5 w-5" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-display font-medium mb-1 group-hover:text-primary transition-colors">Digital Backbone</h3>
                                    <p className="text-sm text-muted-foreground font-mono">Fiber Optic / Low Latency / Redundant</p>
                                </div>
                            </div>
                        </article>

                        {/* Feature 3 */}
                        <article className="group relative cursor-pointer">
                            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-secondary mb-6 border border-border/10">
                                <div className="absolute inset-0 bg-gradient-to-br from-background/0 to-background/50 z-10" />
                                <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                                    <ShieldCheck className="h-32 w-32 text-muted-foreground/10 group-hover:text-foreground/80 transition-colors duration-500" />
                                </div>
                                <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                    <div className="w-10 h-10 bg-foreground rounded-full flex items-center justify-center text-background">
                                        <ArrowUpRight className="h-5 w-5" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-display font-medium mb-1 group-hover:text-primary transition-colors">Acoustic Sanctity</h3>
                                    <p className="text-sm text-muted-foreground font-mono">sound_dampening_v2 / Silence Enforced</p>
                                </div>
                            </div>
                        </article>

                        {/* Feature 4 */}
                        <article className="group relative cursor-pointer md:mt-24">
                            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-secondary mb-6 border border-border/10">
                                <div className="absolute inset-0 bg-gradient-to-br from-background/0 to-background/50 z-10" />
                                <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                                    <Star className="h-32 w-32 text-muted-foreground/10 group-hover:text-foreground/80 transition-colors duration-500" />
                                </div>
                                <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                    <div className="w-10 h-10 bg-foreground rounded-full flex items-center justify-center text-background">
                                        <ArrowUpRight className="h-5 w-5" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-display font-medium mb-1 group-hover:text-primary transition-colors">Ergonomic Form</h3>
                                    <p className="text-sm text-muted-foreground font-mono">Orthopedic Seating / Spacious Desk</p>
                                </div>
                            </div>
                        </article>

                    </div>
                </div>
            </section>

            {/* PRICING */}
            <section id="pricing" className="py-24 bg-background border-t border-border/20">
                <Pricing
                    title="Access Protocols"
                    description={"Select your engagement tier.\nFull amenities included within all clearance levels."}
                    plans={[
                        {
                            name: "MONTHLY",
                            price: "800",
                            yearlyPrice: "800",
                            period: "month",
                            packagePeriod: "month",
                            features: [
                                "Dedicated personal seat",
                                "15hr Access (07:00 - 22:00)",
                                "Gigabit Network",
                            ],
                            description: "Standard Entry Protocol",
                            buttonText: "Initiate",
                            href: "/sign-up",
                            isPopular: false,
                        },
                        {
                            name: "QUARTERLY",
                            price: "733",
                            yearlyPrice: "2200",
                            period: "month",
                            packagePeriod: "3 months",
                            features: [
                                "All Standard Protocol Features",
                                "Priority Seat Allocation",
                                "Locker Encryption (Usage)",
                            ],
                            description: "Optimized for extended deep work",
                            buttonText: "Engage",
                            href: "/sign-up",
                            isPopular: true,
                        },
                        {
                            name: "HALF-YEARLY",
                            price: "700",
                            yearlyPrice: "4200",
                            period: "month",
                            packagePeriod: "6 months",
                            features: [
                                "All Extended Protocol Features",
                                "Guaranteed Retention",
                                "Guest Access Token (1/mo)",
                            ],
                            description: "Maximum efficiency structure",
                            buttonText: "Commit",
                            href: "/sign-up",
                            isPopular: false,
                        }
                    ]}
                />
            </section>

            {/* FOOTER */}
            <footer className="border-t border-border/20 bg-background pb-12 pt-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                        <div>
                            <h4 className="font-display text-2xl font-medium tracking-tight overflow-hidden">
                                <span className="block">Divine Reading Space.</span>
                            </h4>
                            <p className="text-muted-foreground mt-2 text-sm font-mono tracking-wide">Designed for excellence.</p>
                        </div>
                        <div className="flex gap-8">
                            {['Instagram', 'Twitter', 'Email'].map((link) => (
                                <a key={link} href="#" className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest">
                                    {link}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
