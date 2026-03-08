import langs from "langs";
import { useState } from "react";

const formatLabel = (str) =>
  str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function Question({ step, value, onChange }) {
  if (!step) return null;

  if (step.type === "text") {
    return (
      <div>
        <p className="text-lg font-semibold text-gray-800 mb-4">{step.question}</p>
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#A50E06]"
          placeholder="Type your answer..."
        />
      </div>
    );
  }

  if (step.type === "boolean") {
    return (
      <div>
        <p className="text-lg font-semibold text-gray-800 mb-4">{step.question}</p>
        <div className="flex gap-4">
          {[true, false].map((option) => (
            <button
              key={String(option)}
              type="button"
              onClick={() => onChange(option)}
              className={`px-6 py-3 rounded-xl border-2 text-sm font-medium transition-all
                ${value === option
                  ? "border-blue-600 text-[#A50E06] text-blue-700"
                  : "border-gray-200 bg-white text-gray-700 hover:border-[#A50E06]"}`}
            >
              {option ? "Yes" : "No"}
            </button>
          ))}
        </div>
      </div>
    );
  }

if (step.type === "select" || step.type === "multiselect") {
    const isMulti = step.type === "multiselect";
    const isSearchable = true;
    const [search, setSearch] = useState("");

    const filtered = isSearchable
    ? step.key === "language"
        ? step.options
            .map((code) => ({ code, name: langs.where("1", code)?.name || code }))
            .filter((l) => l.name.toLowerCase().includes(search.toLowerCase()))
        : step.options.filter((o) => o.toLowerCase().includes(search.toLowerCase()))
    : step.options;

    const handleSelect = (option) => {
      if (isMulti) {
        const current = Array.isArray(value) ? value : [];
        const updated = current.includes(option)
          ? current.filter((v) => v !== option)
          : [...current, option];
        onChange(updated);
      } else {
        onChange(option);
      }
    };
    const isSelected = (option) =>
      isMulti ? Array.isArray(value) && value.includes(option) : value === option;

    return (
      <div>
        <p className="text-lg font-semibold text-gray-800 mb-4">{step.question}</p>
        

        {isSearchable && (
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:border-[#A50E06] "
            />
            )}
            <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">

            {filtered.map((option) => {
                const display = step.key === "language" ? option.name : formatLabel(option);
                const value = step.key === "language" ? option.code : option;
                return (
                    <button
                    key={value}
                    type="button"
                    onClick={() => handleSelect(value)}
                    className={`px-4 py-3 rounded-xl border-2 text-left text-sm font-medium transition-all
                        ${isSelected(value)
                        ? "border-[#A50E06] text-[#A50E06] text-blue-700"
                        : "border-gray-200 bg-white text-gray-700 hover:border-[#A50E06]"}`}
                    >
                    {display}
                    </button>
                );
            })}
        </div>
        {isMulti && <p className="text-xs text-gray-400 mt-2">Select all that apply</p>}
      </div>
    );
  }

  return null;
}