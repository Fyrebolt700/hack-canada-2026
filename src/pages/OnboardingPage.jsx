import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { STEPS } from "../data/quizSteps";
import Question from "../components/ui/Question";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function OnboardingPage() {
    const { logout, user } = useAuth0();
    const navigate = useNavigate();
    const [answers, setAnswers] = useState({});
    const [step, setStep] = useState(0);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const checkIfDone = async () => {
            if (!user) return;
            const snap = await getDoc(doc(db, "users", user.sub));
            if (snap.exists()) {
                navigate("/dashboard");
            } else {
                setChecking(false);
            }
        };
        checkIfDone();
    }, [user]);

    if (checking) return (
        <div style={{ backgroundColor: '#FAF9F2' }} className="min-h-screen flex items-center justify-center">
            <p style={{ color: '#9ca3af' }} className="font-light tracking-wide">Loading...</p>
        </div>
    );

    const visibleSteps = STEPS.filter((s) => {
        if (!s.dependsOn) return true;
        return answers[s.dependsOn.key] === s.dependsOn.value;
    });
    const current = visibleSteps[step];
    const progress = Math.min(((step + 1) / visibleSteps.length) * 100, 100);
    const isLast = step === visibleSteps.length - 1;
    const currentValue = answers[current?.key];
    const hasAnswer = current?.type === "multiselect"
        ? Array.isArray(currentValue) && currentValue.length > 0
        : currentValue !== undefined && currentValue !== "";

    const handleChange = (value) => {
        setAnswers((prev) => ({ ...prev, [current.key]: value }));
    };

    const handleSubmit = async () => {
        try {
            await setDoc(doc(db, "users", user.sub), {
                ...answers,
                completedAt: new Date().toISOString(),
            });
            navigate("/dashboard");
        } catch (err) {
            console.error("Firestore save failed:", err);
        }
    };

    return (
        <div style={{ backgroundColor: '#FAF9F2' }} className="min-h-screen flex items-center justify-center px-6">
            <div style={{ border: '1px solid #e8e4d9', backgroundColor: '#FAF9F2' }} className="w-full max-w-xl rounded-3xl p-10 flex flex-col gap-8">

                {/* Header */}
                <div className="flex flex-col gap-2">
                    <h1 style={{ color: '#1a1a1a' }} className="text-3xl font-light">
                        Let's get to know you.
                    </h1>
                    <p style={{ color: '#9ca3af' }} className="text-sm font-light tracking-wide">
                        Question {step + 1} of {visibleSteps.length}
                    </p>
                </div>

                {/* Progress bar */}
                <div style={{ backgroundColor: '#e8e4d9' }} className="w-full h-1 rounded-full">
                    <div
                        style={{ backgroundColor: '#A50E06', width: `${progress}%` }}
                        className="h-1 rounded-full transition-all duration-300"
                    />
                </div>

                {/* Question */}
                <div className="flex flex-col gap-4">
                    <Question step={current} value={currentValue} onChange={handleChange} />
                </div>

                {/* Navigation buttons */}
                <div className="flex justify-between items-center pt-2">
                    <button
                        onClick={() => setStep((s) => s - 1)}
                        disabled={step === 0}
                        style={{ color: '#6b6b6b' }}
                        className="text-sm font-light tracking-wide hover:opacity-50 transition-opacity disabled:opacity-20"
                    >
                        ← Back
                    </button>
                    <button
                        onClick={() => isLast ? handleSubmit() : setStep((s) => s + 1)}
                        disabled={!hasAnswer}
                        style={{ backgroundColor: '#A50E06', color: '#FAF9F2' }}
                        className="px-8 py-3 rounded-2xl text-sm font-light tracking-widest uppercase hover:opacity-80 transition-opacity disabled:opacity-30"
                    >
                        {isLast ? "Submit" : "Next →"}
                    </button>
                </div>

                {/* Logout */}
                <button
                    onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                    style={{ color: '#9ca3af' }}
                    className="text-xs font-light tracking-wide hover:opacity-50 transition-opacity text-center"
                >
                    Log out
                </button>

            </div>
        </div>
    );
}