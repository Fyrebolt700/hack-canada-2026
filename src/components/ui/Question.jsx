import langs from "langs";
import { useState } from "react";

const formatLabel = (str) =>
  str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function Question({ step, value, onChange }) {
  const [search, setSearch] = useState("");

  if (!step) return null;

  if (step.type === "text") {
    return (
      <div className="flex flex-col gap-3">
        <p style={{ color: '#1a1a1a' }} className="text-lg font-light">{step.question}</p>
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          style={{ border: '1px solid #e8e4d9', backgroundColor: '#FAF9F2', color: '#1a1a1a' }}
          className="w-full rounded-2xl px-4 py-3 text-sm font-light focus:outline-none"
          placeholder="Type your answer..."
        />
      </div>
    );
  }

  if (step.type === "boolean") {
    return (
      <div className="flex flex-col gap-4">
        <p style={{ color: '#1a1a1a' }} className="text-lg font-light">{step.question}</p>
        <div className="flex gap-4">
          {[true, false].map((option) => (
            <button
              key={String(option)}
              type="button"
              onClick={() => onChange(option)}
              style={{
                border: `1px solid ${value === option ? '#A50E06' : '#e8e4d9'}`,
                color: value === option ? '#A50E06' : '#6b6b6b',
                backgroundColor: '#FAF9F2',
              }}
              className="px-8 py-3 rounded-2xl text-sm font-light tracking-wide transition-all hover:border-red-800"
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

    const filtered = step.key === "language"
      ? step.options
        .map((code) => ({ code, name: langs.where("1", code)?.name || code }))
        .filter((l) => l.name.toLowerCase().includes(search.toLowerCase()))
      : step.options.filter((o) => o.toLowerCase().includes(search.toLowerCase()));

    const handleSelect = (option) => {
      if (isMulti) {
        const current = Array.isArray(value) ? value : [];
        const updated = current.includes(option)
          ? current.filter((v) => v !== option)
          : [...current, option];
        onChange(updated);
      } else {
        onChange(option);
        setSearch(""); // clear search on selection for single select
      }
    };

    const isSelected = (option) =>
      isMulti ? Array.isArray(value) && value.includes(option) : value === option;

    return (
      <div className="flex flex-col gap-3">
        <p style={{ color: '#1a1a1a' }} className="text-lg font-light">{step.question}</p>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          style={{ border: '1px solid #e8e4d9', backgroundColor: '#FAF9F2', color: '#1a1a1a' }}
          className="w-full rounded-2xl px-4 py-3 text-sm font-light focus:outline-none"
        />

        <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
          {filtered.map((option) => {
            const display = step.key === "language" ? option.name : formatLabel(option);
            const val = step.key === "language" ? option.code : option;
            return (
              <button
                key={val}
                type="button"
                onClick={() => handleSelect(val)}
                style={{
                  border: `1px solid ${isSelected(val) ? '#A50E06' : '#e8e4d9'}`,
                  color: isSelected(val) ? '#A50E06' : '#6b6b6b',
                  backgroundColor: '#FAF9F2',
                }}
                className="px-4 py-3 rounded-2xl text-left text-sm font-light transition-all hover:border-red-800"
              >
                {display}
              </button>
            );
          })}
        </div>

        {isMulti && (
          <p style={{ color: '#9ca3af' }} className="text-xs font-light tracking-wide">
            Select all that apply
          </p>
        )}
      </div>
    );
  }

  return null;
}