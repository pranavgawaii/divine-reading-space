"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Copy, Check, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BorderTrail } from "@/components/ui/border-trail";

export function ContactSection() {
    const [copied, setCopied] = useState(false);

    const handleCopyAddress = () => {
        const address = "B-1' Rajgrah, Near Jalna Hospital, Ambad Crossroad, Satkar Nagar, Jalna, Maharashtra 431213";
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section id="location" className="py-24 bg-background border-t border-border/20 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px] pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container relative z-10 mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="block text-xs font-mono text-muted-foreground tracking-widest uppercase mb-4"
                    >
                        Coordinates
                    </motion.span>
                    <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="font-display text-4xl md:text-5xl font-medium tracking-tight text-foreground"
                    >
                        Physical Interface
                    </motion.h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">

                    {/* Address Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        onClick={handleCopyAddress}
                        className="group relative cursor-pointer overflow-hidden rounded-xl border border-border/50 bg-secondary/5 p-8 transition-all hover:bg-secondary/10 hover:border-primary/20 md:col-span-1"
                    >
                        <BorderTrail
                            style={{
                                boxShadow: '0px 0px 60px 30px rgb(255 255 255 / 50%), 0 0 100px 60px rgb(0 0 0 / 50%), 0 0 140px 90px rgb(0 0 0 / 50%)'
                            }}
                            size={100}
                        />
                        <div className="absolute top-4 right-4 text-muted-foreground/50 transition-colors group-hover:text-primary">
                            {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                        </div>
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <MapPin className="h-6 w-6" />
                        </div>
                        <h4 className="mb-2 font-mono text-sm tracking-widest uppercase text-muted-foreground">Location</h4>
                        <p className="font-light leading-relaxed text-foreground">
                            B-1' Rajgrah, Near Jalna Hospital,<br />
                            Ambad Crossroad, Satkar Nagar,<br />
                            Jalna, Maharashtra 431213
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-xs font-mono text-primary opacity-0 transition-opacity group-hover:opacity-100">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                            {copied ? "COPIED TO CLIPBOARD" : "CLICK TO COPY"}
                        </div>
                    </motion.div>

                    {/* Contact Channels */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col gap-6 md:col-span-1"
                    >
                        {/* Phone */}
                        <a
                            href="tel:+919422723926"
                            className="group relative overflow-hidden flex flex-1 flex-col justify-center rounded-xl border border-border/50 bg-secondary/5 p-8 transition-all hover:bg-secondary/10 hover:border-primary/20"
                        >
                            <BorderTrail
                                style={{
                                    boxShadow: '0px 0px 60px 30px rgb(255 255 255 / 50%), 0 0 100px 60px rgb(0 0 0 / 50%), 0 0 140px 90px rgb(0 0 0 / 50%)'
                                }}
                                size={100}
                            />
                            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Phone className="h-5 w-5" />
                            </div>
                            <h4 className="mb-1 font-mono text-xs tracking-widest uppercase text-muted-foreground">Voice Line</h4>
                            <p className="text-xl font-medium text-foreground group-hover:text-primary transition-colors">
                                +91 94227 23926
                            </p>
                        </a>

                        {/* Email */}
                        <a
                            href="mailto:gbg2613@gmail.com"
                            className="group relative overflow-hidden flex flex-1 flex-col justify-center rounded-xl border border-border/50 bg-secondary/5 p-8 transition-all hover:bg-secondary/10 hover:border-primary/20"
                        >
                            <BorderTrail
                                style={{
                                    boxShadow: '0px 0px 60px 30px rgb(255 255 255 / 50%), 0 0 100px 60px rgb(0 0 0 / 50%), 0 0 140px 90px rgb(0 0 0 / 50%)'
                                }}
                                size={100}
                            />
                            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Mail className="h-5 w-5" />
                            </div>
                            <h4 className="mb-1 font-mono text-xs tracking-widest uppercase text-muted-foreground">Digital Mail</h4>
                            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors break-all">
                                gbg2613@gmail.com
                            </p>
                        </a>
                    </motion.div>

                    {/* Map Action */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="group relative overflow-hidden rounded-xl border border-border/50 bg-secondary/5 p-8 md:col-span-1 flex flex-col justify-between hover:bg-secondary/10 hover:border-primary/20 transition-all"
                    >
                        <BorderTrail
                            style={{
                                boxShadow: '0px 0px 60px 30px rgb(255 255 255 / 50%), 0 0 100px 60px rgb(0 0 0 / 50%), 0 0 140px 90px rgb(0 0 0 / 50%)'
                            }}
                            size={100}
                        />

                        <div className="relative z-10">
                            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <ArrowUpRight className="h-5 w-5" />
                            </div>
                            <h4 className="mb-1 font-mono text-xs tracking-widest uppercase text-muted-foreground">Intelligence Map</h4>
                            <p className="text-sm font-medium text-foreground mb-8 text-muted-foreground/80 leading-relaxed">
                                Navigate to the physical interface via satellite positioning.
                            </p>
                        </div>

                        <a
                            href="https://www.google.com/maps/dir//B-1'+Rajgrah,+Near+Jalna+hospital,+Ambad+Crossroad,+Satkar+Nagar,+Jalna,+Maharashtra+431213/@18.4815797,74.0274044,14z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3bda5717e5736bb5:0xcb1d4ac657d17c5!2m2!1d75.8833429!2d19.8234723?entry=ttu&g_ep=EgoyMDI2MDExMy4wIKXMDSoKLDEwMDc5MjA2N0gBUAM%3D"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative z-10 flex items-center justify-center gap-2 w-full py-3 bg-foreground hover:bg-foreground/90 text-background text-xs font-bold uppercase tracking-widest rounded transition-colors"
                        >
                            <span>Open Navigation</span>
                            <ArrowUpRight className="h-4 w-4" />
                        </a>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
