import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useUserData } from "../hooks/useUserData";
import { generateTasks } from "../data/checklistTasks";
import ArrivalScore from "../components/ArrivalScore";

const features = [
    { title: "Checklist", path: "/checklist" },
    { title: "Chatbot", path: "/chatbot" },
    { title: "Service Map", path: "/map" },
];

export default function DashboardPage() {
    const { user } = useAuth0();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);

    const testUserData = {
        name: "Suhaani",
        nationality: "Indian",
        province: "Ontario",
        purpose: "study",
        status: "temp_resident",
        language: "en",
        religion: "hinduism",
        children: true,
        childrenDetails: [{ level: "elementary" }],
        housing: true,
        personal: {
            daycare: true,
            nursing_homes: false,
            settlement: true,
            legal: true
        }
    };

    useEffect(() => {
        setTasks(generateTasks(testUserData));
    }, []);

    const city = testUserData?.province || "Canada";
    const firstName = user?.given_name || user?.name?.split(" ")[0] || "there";

    return (
        <div className="flex flex-col gap-10">
            {/* Welcome */}
            <div className="flex flex-col gap-3">
                <h1 style={{ color: '#1a1a1a' }} className="text-6xl font-light leading-tight">
                    Welcome to {city},<br />{firstName}.
                </h1>
                <p style={{ color: '#6b6b6b' }} className="text-lg font-light tracking-wide">
                    What can we help you with today?
                </p>
            </div>

            {/* Arrival Score — full width horizontal */}
            <ArrivalScore tasks={tasks} />

            {/* Feature buttons */}
            <div className="flex flex-row gap-4">
                {features.map(f => (
                    <button
                        key={f.path}
                        onClick={() => navigate(f.path)}
                        style={{
                            backgroundColor: '#A50E06',
                            color: '#FAF9F2',
                        }}
                        className="px-10 py-5 rounded-2xl text-sm font-light tracking-widest uppercase hover:opacity-80 transition-all"
                    >
                        {f.title}
                    </button>
                ))}
            </div>
        </div>
    );
}