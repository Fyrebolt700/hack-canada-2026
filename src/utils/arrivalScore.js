export function calculateArrivalScore(tasks) {
    if (!tasks || tasks.length === 0) return 0;

    const weights = {
        "Urgent": 20,
        "First Week": 10,
        "First Month": 5,
        "First 6 Months": 2,
    };

    let totalPoints = 0;
    let earnedPoints = 0;

    tasks.forEach(task => {
        const weight = weights[task.category] || 2;
        totalPoints += weight;
        if (task.done) earnedPoints += weight;
    });

    return Math.round((earnedPoints / totalPoints) * 100);
}

export function getScoreLabel(score) {
    if (score <= 30) return { label: "Your Journey Begins", color: "#A50E06" };
    if (score <= 60) return { label: "You're Making Progress", color: "#c45c12" };
    if (score <= 85) return { label: "You're Thriving", color: "#b07d2a" };
    if (score <= 99) return { label: "Almost Settled", color: "#4a7c59" };
    return { label: "You've Made It", color: "#2d5a3d" };
}

export function getTopRecommendations(tasks, limit = 3) {
    const weights = {
        "Urgent": 20,
        "First Week": 10,
        "First Month": 5,
        "First 6 Months": 2,
    };

    return tasks
        .filter(t => !t.done)
        .sort((a, b) => (weights[b.category] || 2) - (weights[a.category] || 2))
        .slice(0, limit)
        .map(t => ({ ...t, points: weights[t.category] || 2 }));
}