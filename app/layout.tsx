import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { Outfit, Space_Grotesk } from 'next/font/google'
import type { Metadata } from 'next'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"


const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' })

export const metadata: Metadata = {
  title: 'Divine Reading Space - Premium Study Rooms',
  description: 'Book your quiet study space in a premium reading environment',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${outfit.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
          <div className="noise-bg" />
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
