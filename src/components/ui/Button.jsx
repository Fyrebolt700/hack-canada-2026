export default function Button({ children, onClick, variant = "primary" }) {
    const base = "px-4 py-2 rounded-lg font-medium transition-colors";
    const styles = {
        primary: "bg-red-700 text-white hover:bg-red-800",
        secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    };
    return (
        <button onClick={onClick} className={`${base} ${styles[variant]}`}>
            {children}
        </button>
    );
}
