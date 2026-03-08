import { calculateArrivalScore, getScoreLabel, getTopRecommendations } from "../utils/arrivalScore";

function CircularGauge({ score }) {
    const radius = 100;
    const stroke = 12;
    const normalizedRadius = radius - stroke / 2;
    const circumference = Math.PI * normalizedRadius;
    const progress = circumference - (score / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <svg width="260" height="150" viewBox="0 0 260 150">
                <path
                    d={`M ${stroke} ${radius + 10} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${260 - stroke} ${radius + 10}`}
                    fill="none"
                    stroke="#e8e4d9"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                />
                <path
                    d={`M ${stroke} ${radius + 10} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${260 - stroke} ${radius + 10}`}
                    fill="none"
                    stroke="#A50E06"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={score === 0 ? circumference + 1 : progress}
                    style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                />
                <text
                    x="130"
                    y="118"
                    textAnchor="middle"
                    style={{ fontFamily: 'Jost, sans-serif', fontSize: '52px', fontWeight: '300', fill: '#1a1a1a' }}
                >
                    {score}
                </text>
                <text
                    x="130"
                    y="142"
                    textAnchor="middle"
                    style={{ fontFamily: 'Jost, sans-serif', fontSize: '13px', fontWeight: '300', fill: '#9ca3af', letterSpacing: '0.1em' }}
                >
                    OUT OF 100
                </text>
            </svg>
            <p style={{ color: getScoreLabel(score).color }} className="text-base font-light tracking-widest uppercase text-center mt-2">
                {getScoreLabel(score).label}
            </p>
        </div>
    );
}

export default function ArrivalScore({ tasks }) {
    const score = calculateArrivalScore(tasks);
    const recommendations = getTopRecommendations(tasks);

    return (
        <div
            style={{ border: '1px solid #e8e4d9', backgroundColor: '#FAF9F2' }}
            className="rounded-3xl px-10 py-10 flex flex-col gap-8 w-full"
        >
            {/* Header */}
            <div className="flex flex-col items-center gap-1">
                <h2 style={{ color: '#1a1a1a' }} className="text-2xl font-light tracking-wide">
                    Arrival Score
                </h2>
                <p style={{ color: '#9ca3af' }} className="text-sm font-light tracking-wide">
                    Based on your settlement progress
                </p>
            </div>

            {/* Gauge — centered */}
            <div className="flex justify-center">
                <CircularGauge score={score} />
            </div>

            {/* Divider */}
            <div style={{ backgroundColor: '#e8e4d9' }} className="w-full h-px" />

            {/* Recommendations */}
            <div className="flex flex-col gap-4">
                <p style={{ color: '#6b6b6b' }} className="text-xs font-light tracking-widest uppercase">
                    Complete these to improve your score
                </p>
                {recommendations.length === 0 ? (
                    <p style={{ color: '#4a7c59' }} className="text-base font-light">
                        🎉 All top tasks completed!
                    </p>
                ) : (
                    recommendations.map(task => (
                        <div
                            key={task.id}
                            style={{ border: '1px solid #e8e4d9' }}
                            className="flex justify-between items-center px-5 py-4 rounded-2xl"
                        >
                            <span style={{ color: '#1a1a1a' }} className="text-base font-light">
                                {task.title}
                            </span>
                            <span style={{ color: '#A50E06' }} className="text-base font-light tracking-wide ml-4 flex-shrink-0">
                                +{task.points} pts
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}