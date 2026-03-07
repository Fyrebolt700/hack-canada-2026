export default function TaskCard({ task, onToggle }) {
    return (
        <div className={`flex items-start gap-3 p-4 rounded-lg border mb-2 transition-colors ${task.done ? "bg-green-50 border-green-200" : "bg-white border-gray-200"}`}>
            <input
                type="checkbox"
                checked={task.done}
                onChange={() => onToggle(task.id)}
                className="mt-1 w-4 h-4 accent-red-700 cursor-pointer"
            />
            <div>
                <h4 className={`font-medium ${task.done ? "line-through text-gray-400" : "text-gray-800"}`}>
                    {task.title}
                </h4>
                <p className="text-sm text-gray-500 mt-0.5">{task.description}</p>
            </div>
        </div>
    );
}