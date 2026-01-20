'use client'

import { SignUp } from '@clerk/nextjs'

import { ModeToggle } from '@/components/mode-toggle'

export default function SignUpPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-sans bg-background text-foreground selection:bg-foreground selection:text-background">

            <div className="absolute top-6 right-6 z-50">
                <ModeToggle />
            </div>

            <div className="noise-bg opacity-30 pointer-events-none fixed inset-0" />

            {/* Widened Container */}
            <div className="relative z-10 w-full max-w-[500px] mx-auto px-6">
                <div className="flex flex-col items-center justify-center p-10 border border-zinc-800 bg-zinc-900/50 backdrop-blur-md rounded-none">

                    {/* Compact Header */}
                    <div className="flex flex-col items-center text-center mb-10 w-full">
                        <div className="w-4 h-4 bg-white rounded-full animate-pulse mb-4 shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                        <h1 className="text-xl font-display font-bold tracking-tight text-white uppercase mb-1">Divine Reading Space</h1>
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
                                    colorInputBackground: 'white',
                                    colorInputText: 'black',
                                    borderRadius: '0',
                                    fontSize: '13px',
                                },
                                elements: {
                                    rootBox: "w-full",
                                    card: "w-full p-0 shadow-none bg-transparent gap-6",
                                    header: "hidden",
                                    footer: "hidden",
                                    navbar: "hidden",

                                    // Social CSS handled globally

                                    // Form Labels
                                    formFieldLabel: "text-[10px] uppercase tracking-widest font-mono text-zinc-400 mb-2 font-bold",

                                    // Footer
                                    footerActionLink: "hidden",
                                    identityPreviewText: "text-zinc-400 font-mono text-xs",
                                    formFieldInputShowPasswordButton: "text-zinc-400 hover:text-black",
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
