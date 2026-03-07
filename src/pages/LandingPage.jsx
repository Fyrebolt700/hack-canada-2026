import { useAuth0 } from "@auth0/auth0-react";

export default function LandingPage() {
    const { loginWithRedirect } = useAuth0();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-red-700 text-white">
            <h1 className="text-5xl font-bold mb-4">🍁 NewStart Canada</h1>
            <p className="text-xl mb-8 opacity-90">Your personalized guide to settling in Canada.</p>
            <button
                onClick={() => loginWithRedirect()}
                className="bg-white text-red-700 px-8 py-3 rounded-xl font-semibold text-lg hover:bg-red-50"
            >
                Get Started
            </button>
        </div>
    );
}