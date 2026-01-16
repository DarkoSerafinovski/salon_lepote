import React from "react";

const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  accentColor = "pink",
  required = false,
  defaultOption = "",
}) => {
  const focusColors = {
    pink: "focus:border-pink-300 focus:ring-pink-100",
    gold: "focus:border-amber-300 focus:ring-amber-100",
  };

  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-2 ml-1">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`
                    w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-xl 
                    appearance-none cursor-pointer transition-all outline-none
                    focus:bg-white focus:ring-4
                    ${focusColors[accentColor] || focusColors.pink}
                `}
      >
        {defaultOption && (
          <option value="" disabled>
            {defaultOption}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormSelect;
