import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function LandingPage() {
    const { loginWithRedirect, isAuthenticated, isLoading, user } = useAuth0();
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            if (!isLoading && isAuthenticated) {
                console.log("user.sub:", user.sub);
                const ref = doc(db, "users", user.sub);
                const snap = await getDoc(ref);
                console.log("snap.exists:", snap.exists());
                if (snap.exists()) {
                    navigate("/dashboard");
                } else {
                    navigate("/onboarding");
                }
            }
        };
        checkUser();
    }, [isAuthenticated, isLoading]);

    if (isLoading || isAuthenticated) return null;

    return (
        <div style={{ backgroundColor: '#FAF9F2' }} className="min-h-screen flex flex-col items-center justify-center px-6">
            <div className="flex flex-col items-center max-w-xl w-full gap-8 text-center">

                {/* iMessage bubble */}
                <div style={{ backgroundColor: '#B8C5D0' }} className="px-12 py-8 rounded-3xl rounded-tl-sm inline-block">
                    <p style={{ color: '#1a1a1a' }} className="text-4xl font-semibold tracking-wide">
                        Just landed.
                    </p>
                </div>

                {/* Tagline */}
                <p style={{ color: '#6b6b6b' }} className="text-xl font-light leading-relaxed">
                    Your personalized guide to settling in Canada.
                </p>

                {/* CTA Button */}
                <button
                    onClick={() => loginWithRedirect()}
                    style={{ backgroundColor: '#A50E06' }}
                    className="px-10 py-4 rounded-2xl text-white font-light tracking-widest text-sm uppercase hover:opacity-90 transition-opacity"
                >
                    Get Started
                </button>

            </div>
        </div>
    );
}