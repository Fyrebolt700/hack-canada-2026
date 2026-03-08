import { useState, useEffect } from "react";
import { useUserData } from "../hooks/useUserData";
import { generateTasks } from "../data/checklistTasks";
import TaskCard from "../components/ui/TaskCard";
import ProgressBar from "../components/ui/ProgressBar";
import SectionHeader from "../components/ui/SectionHeader";

const CATEGORY_ORDER = ["Urgent", "First Week", "First Month", "First 6 Months"];
const CATEGORY_LABELS = {
    "Urgent": "Urgent — Day 1-2",
    "First Week": "First Week",
    "First Month": "First Month",
    "First 6 Months": "First 6 Months",
};

export default function ChecklistPage() {
    const { userData, loading, saveCompletedTasks } = useUserData();
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        if (userData) {
            const generated = generateTasks(userData);
            const completedIds = userData.completedTasks || [];
            const withCompletion = generated.map(t => ({
                ...t,
                done: completedIds.includes(t.id)
            }));
            setTasks(withCompletion);
        }
    }, [userData]);

    const toggle = async (id) => {
        const updated = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
        setTasks(updated);
        const completedIds = updated.filter(t => t.done).map(t => t.id);
        await saveCompletedTasks(completedIds);
    };

    const completed = tasks.filter(t => t.done).length;

    if (loading) return (
        <p style={{ color: '#9ca3af' }} className="font-light">
            Loading your checklist...
        </p>
    );

    return (
        <div>
            <h1 style={{ color: '#1a1a1a' }} className="text-5xl font-light mb-2">
                Your Settlement Checklist
            </h1>
            <p style={{ color: '#6b6b6b' }} className="text-base font-light tracking-wide">
                Complete these tasks to get settled in Canada.
            </p>
            <ProgressBar completed={completed} total={tasks.length} />
            {tasks.length === 0 ? (
                <p style={{ color: '#9ca3af' }} className="mt-12 text-center font-light">
                    No tasks yet — complete the onboarding quiz first!
                </p>
            ) : (
                CATEGORY_ORDER.map(cat => {
                    const categoryTasks = tasks.filter(t => t.category === cat);
                    if (categoryTasks.length === 0) return null;
                    return (
                        <div key={cat}>
                            <SectionHeader title={CATEGORY_LABELS[cat]} />
                            {categoryTasks.map(task => (
                                <TaskCard key={task.id} task={task} onToggle={toggle} />
                            ))}
                        </div>
                    );
                })
            )}
        </div>
    );
}