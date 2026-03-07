import { useState, useEffect } from "react";
import { useUserData } from "../hooks/useUserData";
import { generateTasks } from "../data/checklistTasks";
import TaskCard from "../components/ui/TaskCard";
import ProgressBar from "../components/ui/ProgressBar";
import SectionHeader from "../components/ui/SectionHeader";

export default function ChecklistPage() {
    const { userData, loading } = useUserData();
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        if (userData) setTasks(generateTasks(userData));
    }, [userData]);

    const toggle = (id) => setTasks(prev =>
        prev.map(t => t.id === id ? { ...t, done: !t.done } : t)
    );

    const completed = tasks.filter(t => t.done).length;
    const categories = [...new Set(tasks.map(t => t.category))];

    if (loading) return <p className="text-gray-500">Loading your checklist...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-1">Your Settlement Checklist</h1>
            <p className="text-gray-500 mb-4">Complete these tasks to get settled in Canada.</p>
            <ProgressBar completed={completed} total={tasks.length} />
            {tasks.length === 0 ? (
                <p className="text-gray-400 mt-8 text-center">No tasks yet — complete the onboarding quiz first!</p>
            ) : (
                categories.map(cat => (
                    <div key={cat}>
                        <SectionHeader title={cat} />
                        {tasks.filter(t => t.category === cat).map(task => (
                            <TaskCard key={task.id} task={task} onToggle={toggle} />
                        ))}
                    </div>
                ))
            )}
        </div>
    );
}