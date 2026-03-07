import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useUserData } from "../hooks/useUserData";
import FeatureCard from "../components/ui/FeatureCard";

const features = [
    { title: "My Checklist", description: "Track your settlement tasks step by step.", icon: "✅", path: "/checklist" },
    { title: "Ask the Chatbot", description: "Get help navigating in your language.", icon: "💬", path: "/chatbot" },
    { title: "Find Services", description: "Discover nearby services on a map.", icon: "📍", path: "/map" },
];

export default function DashboardPage() {
    const { user } = useAuth0();
    const { userData, loading } = useUserData();
    const navigate = useNavigate();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-1">
                Welcome to Canada, {user?.given_name || "Friend"}! 🍁
            </h1>
            <p className="text-gray-500 mb-2">What do you need help with today?</p>
            {!loading && userData?.province && (
                <p className="text-sm text-gray-400 mb-8">Province: <strong>{userData.province}</strong></p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {features.map(f => (
                    <FeatureCard key={f.path} {...f} onClick={() => navigate(f.path)} />
                ))}
            </div>
        </div>
    );
}
