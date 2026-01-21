'use client'

import { SignUp } from '@clerk/nextjs'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'



export default function SignUpPage() {
    return (
        <div className="dark min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans bg-zinc-950 text-white selection:bg-white selection:text-zinc-950">

            <div className="absolute top-6 left-6 z-50">
                <Link href="/" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                    <span className="text-xs font-mono tracking-widest uppercase">Back</span>
                </Link>
            </div>

            <div className="noise-bg opacity-30 pointer-events-none fixed inset-0" />

            {/* Widened Container */}
            <div className="relative z-10 w-full max-w-[500px] mx-auto px-6 pb-24 md:pb-0">
                <div className="flex flex-col items-center justify-center p-6 md:p-10 border border-zinc-800 bg-zinc-900/50 backdrop-blur-md rounded-none">

                    {/* Compact Header */}
                    <div className="flex flex-col items-center text-center mb-8 md:mb-10 w-full">
                        <div className="w-4 h-4 bg-white rounded-full animate-pulse mb-4 shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                        <h1 className="text-lg md:text-xl font-display font-bold tracking-tight text-white uppercase mb-1">Divine Reading Space</h1>
                        <p className="text-[10px] font-mono text-zinc-500 tracking-[0.3em] uppercase">
                            New Member
                        </p>
                    </div>

                    {/* Clerk Form */}
                    <div className="w-full">
                        <SignUp
                            appearance={{
                                layout: {
                                    socialButtonsPlacement: 'bottom',
                                    showOptionalFields: false,
                                },
                                variables: {
                                    colorPrimary: 'white',
                                    colorBackground: 'transparent',
                                    colorText: 'white',
                                    colorTextSecondary: '#a1a1aa',
                                    colorInputBackground: 'transparent',
                                    colorInputText: 'white',
                                    borderRadius: '0',
                                    fontSize: '13px',
                                },
                                elements: {
                                    rootBox: "w-full",
                                    card: "!shadow-none !border-none !bg-transparent !p-0 gap-6",
                                    header: "hidden",
                                    footer: "hidden",
                                    navbar: "hidden",

                                    navbar: "hidden",

                                    // Use specific styling for the divider to prevent overlap
                                    dividerRow: "my-4 md:my-6 relative w-full max-w-[85%] mx-auto bg-transparent",
                                    dividerLine: "bg-zinc-800 h-[1px]",
                                    dividerText: "text-zinc-500 font-mono text-[10px] uppercase tracking-widest bg-[#0a0a0a] px-3 relative z-10",

                                    // Social CSS
                                    socialButtonsBlockButton: "!bg-white !text-black hover:!bg-white/90 !border-none !shadow-none h-10 rounded-none uppercase font-mono text-xs tracking-widest",
                                    socialButtonsBlockButtonText: "!font-bold",
                                    socialButtonsBlockButtonArrow: "hidden",

                                    // Form Labels
                                    formFieldLabel: "text-[10px] uppercase tracking-widest font-mono text-zinc-400 mb-2 font-bold",
                                    formFieldInput: "!bg-zinc-900/50 !border !border-zinc-800 !text-white focus:!border-white transition-colors !shadow-none !rounded-none",
                                    formButtonPrimary: "!bg-white !text-black hover:!bg-white/90 uppercase tracking-widest font-mono text-xs h-10 rounded-none !shadow-none !mt-4",

                                    // Footer
                                    footerActionLink: "hidden",
                                    identityPreviewText: "text-zinc-400 font-mono text-xs",
                                    formFieldInputShowPasswordButton: "text-zinc-400 hover:text-white",
                                }
                            }}
                        />
                    </div>

                    {/* Custom Footer */}
                    <div className="mt-10 pt-6 border-t border-zinc-800 w-full text-center">
                        <a
                            href="/sign-in"
                            className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5"
                        >
                            Existing Access? Login
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
