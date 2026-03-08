import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { STEPS } from "../data/quizSteps";
import Question from "../components/ui/Question";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function OnboardingPage() {
  const { logout, user } = useAuth0();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">Question {step + 1} of {visibleSteps.length}</span>
          <span className="text-sm text-blue-600">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full mb-6">
          <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        <Question step={current} value={currentValue} onChange={handleChange} />

        <div className="flex justify-between mt-8">
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-30"
          >
            ← Back
          </button>
          <button
            onClick={() => isLast ? handleSubmit() : setStep((s) => s + 1)}
            disabled={!hasAnswer}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-40"
          >
            {isLast ? "Submit" : "Next →"}
          </button>
        </div>

        <button
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          className="mt-6 text-xs text-gray-400 underline"
        >
          Log out
        </button>
      </div>
    </div>
  );
}