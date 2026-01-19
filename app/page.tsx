'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Wind, Wifi, Coffee, Zap, ShieldCheck, Users, Star, Menu, X, CheckCircle2 } from 'lucide-react'
import { clsx } from 'clsx'
import { motion, AnimatePresence } from 'framer-motion' // Note: You might need to install framer-motion, but for now I will use standard CSS classes if framer is not present. Actually, let's stick to pure Tailwind for reliability without extra installs.

// --- COMPONENTS ---

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-lg shadow-slate-900/20 group-hover:scale-105 transition-transform duration-300">
              <Wind className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Divine Space</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
            <NavLink href="#location">Location</NavLink>
            <div className="h-4 w-px bg-slate-200"></div>
            <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition">Log in</Link>
            <Link
              href="/signup"
              className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-slate-600">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className={clsx("md:hidden absolute w-full bg-white border-b border-slate-100 transition-all duration-300 overflow-hidden", isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0")}>
        <div className="px-6 py-4 space-y-4">
          <MobileNavLink href="#features">Features</MobileNavLink>
          <MobileNavLink href="#pricing">Pricing</MobileNavLink>
          <MobileNavLink href="#location">Location</MobileNavLink>
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <Link href="/login" className="block text-center font-semibold text-slate-600">Log in</Link>
            <Link href="/signup" className="block text-center bg-slate-900 text-white py-3 rounded-lg font-semibold">Get Started</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <a href={href} className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
      {children}
    </a>
  )
}

function MobileNavLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <a href={href} className="block text-lg font-medium text-slate-600 hover:text-slate-900">
      {children}
    </a>
  )
}

// --- MAIN PAGE ---

export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans bg-slate-50 text-slate-900 selection:bg-orange-100 selection:text-orange-900">
      <Navbar />

      {/* HERO SECTION */}
      <main className="pt-32 pb-16 lg:pt-48 lg:pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wide mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            Limited Seats Available
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-slate-900 mb-8 max-w-4xl mx-auto leading-[1.1] animate-fade-in-up delay-100">
            Silence is the <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Ultimate Luxury.</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-light animate-fade-in-up delay-200">
            Divine Reading Space offers a premium, distraction-free environment engineered for deep work and serious aspirants.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-300">
            <Link
              href="/sign-up"
              className="group h-14 px-8 flex items-center gap-2 bg-slate-900 text-white rounded-full font-semibold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl hover:shadow-2xl hover:shadow-slate-900/20"
            >
              Reserve Your Desk <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#pricing"
              className="h-14 px-8 flex items-center justify-center bg-white border border-slate-200 text-slate-600 rounded-full font-semibold text-lg hover:border-slate-300 hover:bg-slate-50 transition-all"
            >
              View Membership
            </a>
          </div>

          {/* Social Proof */}
          <div className="mt-16 flex items-center justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Just mockup logos or text */}
            <span className="text-sm font-semibold tracking-widest uppercase">Trusted by 500+ Aspirants</span>
          </div>
        </div>
      </main>

      {/* BENTO GRID FEATURES */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need to focus.</h2>
            <p className="text-slate-500 text-lg">We handled the environment so you can handle the syllabus.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">

            {/* Card 1: AC - Large */}
            <div className="md:col-span-2 rounded-3xl bg-slate-100 p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
                <Wind className="h-64 w-64" />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <Wind className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Climate Controlled</h3>
                  <p className="text-slate-500">Maintained at perfect 24°C all year round. Breathe clean, fresh air while you master your craft.</p>
                </div>
              </div>
            </div>

            {/* Card 2: Wifi */}
            <div className="rounded-3xl bg-slate-900 text-white p-8 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950" />
              <div className="absolute bottom-0 right-0 opacity-20"><Wifi className="h-40 w-40 translate-x-10 translate-y-10" /></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="h-12 w-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Gigabit WiFi</h3>
                  <p className="text-slate-400 text-sm">Dedicated fiber line for interruption-free lectures.</p>
                </div>
              </div>
            </div>

            {/* Card 3: Silence */}
            <div className="rounded-3xl border border-slate-200 p-8 flex flex-col justify-between hover:border-orange-200 hover:bg-orange-50/30 transition-colors">
              <div className="h-12 w-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Pin-drop Silence</h3>
                <p className="text-slate-500 text-sm">Strictly enforced silent zones. No calls, no whispers.</p>
              </div>
            </div>

            {/* Card 4: Community */}
            <div className="rounded-3xl border border-slate-200 p-8 flex flex-col justify-between hover:border-blue-200 hover:bg-blue-50/30 transition-colors">
              <div className="h-12 w-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Serious Peers</h3>
                <p className="text-slate-500 text-sm">Surround yourself with disciplined aspirants.</p>
              </div>
            </div>

            {/* Card 5: Comfort */}
            <div className="md:col-span-1 rounded-3xl bg-orange-500 text-white p-8 relative overflow-hidden">
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="h-12 w-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Ergonomic Comfort</h3>
                  <p className="text-orange-100 text-sm">Spacious desks (4ft wide) and orthopedic chairs for long sessions.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200">
            <div className="grid lg:grid-cols-2">
              <div className="p-12 lg:p-16 flex flex-col justify-center">
                <h2 className="text-3xl font-bold mb-6">Simple Membership</h2>
                <p className="text-slate-500 mb-8">No hidden fees. No contracts. Just a pure monthly subscription to fuel your success.</p>

                <div className="space-y-4">
                  {['06:00 AM - 10:00 PM Access', 'Your Own Reserved Desk', 'Locker Facility Available', 'High Speed Wifi & AC'].map(item => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                      <span className="text-slate-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 text-white p-12 lg:p-16 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <div className="text-slate-400 font-medium uppercase tracking-widest mb-2">Monthly Pass</div>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-6xl font-bold tracking-tight">₹800</span>
                    <span className="text-slate-400">/mo</span>
                  </div>
                  <p className="text-slate-400 mb-8 text-sm border-t border-white/10 pt-4">
                    + ₹200 one-time registration fee for new members.
                  </p>
                  <Link
                    href="/signup"
                    className="w-full block py-4 bg-orange-500 hover:bg-orange-600 text-white text-center rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-orange-500/25 active:scale-95"
                  >
                    Secure Your Seat
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white pt-24 pb-12 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            <div className="flex items-center gap-2">
              <div className="bg-slate-900 text-white p-2 rounded-lg">
                <Wind className="h-4 w-4" />
              </div>
              <span className="font-bold text-lg">Divine Space</span>
            </div>
            <div className="flex gap-8 text-sm font-medium text-slate-500">
              <a href="#" className="hover:text-slate-900">Instagram</a>
              <a href="#" className="hover:text-slate-900">Twitter</a>
              <a href="#" className="hover:text-slate-900">Email</a>
            </div>
          </div>
          <div className="text-center md:text-left text-xs text-slate-400">
            &copy; 2024 Divine Reading Space. Designed for excellence.
          </div>
        </div>
      </footer>

    </div>
  )
}
