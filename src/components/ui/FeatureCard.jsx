export default function FeatureCard({ title, description, icon, onClick }) {
    return (
        <div
            onClick={onClick}
            className="bg-white border border-gray-200 rounded-xl p-6 cursor-pointer hover:shadow-md transition-shadow"
        >
            <span className="text-4xl">{icon}</span>
            <h3 className="text-xl font-semibold mt-3 mb-1">{title}</h3>
            <p className="text-gray-500 text-sm">{description}</p>
        </div>
    );
}