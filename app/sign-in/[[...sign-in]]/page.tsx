import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50">
            <div className="w-full max-w-md">
                <SignIn
                    appearance={{
                        elements: {
                            rootBox: "mx-auto",
                            card: "shadow-2xl rounded-2xl border border-gray-100",
                            headerTitle: "text-2xl font-bold",
                            headerSubtitle: "text-gray-600",
                            socialButtonsBlockButton: "border-2 hover:bg-gray-50 transition-all",
                            formButtonPrimary: "bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600",
                            footerActionLink: "text-blue-600 hover:text-blue-700"
                        }
                    }}
                    routing="path"
                    path="/sign-in"
                    signUpUrl="/sign-up"
                    redirectUrl="/dashboard"
                />
            </div>
        </div>
    )
}
