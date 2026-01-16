import React from "react";

const FormInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  className = "",
  accentColor = "pink",
}) => {
  const focusClasses = {
    pink: "focus:border-pink-300 focus:ring-pink-100",
    gold: "focus:border-amber-300 focus:ring-amber-100",
    blue: "focus:border-blue-300 focus:ring-blue-100",
    gray: "focus:border-gray-400 focus:ring-gray-200",
  };

  const starColors = {
    pink: "text-pink-500",
    gold: "text-amber-500",
    blue: "text-blue-500",
    gray: "text-gray-600",
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-2 ml-1"
        >
          {label}{" "}
          {required && (
            <span className={starColors[accentColor] || starColors.pink}>
              *
            </span>
          )}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`
            w-full px-5 py-3.5 bg-gray-50 border rounded-xl transition-all outline-none
            ${
              error
                ? "border-red-400 focus:ring-4 focus:ring-red-50"
                : `border-transparent focus:bg-white focus:ring-4 ${
                    focusClasses[accentColor] || focusClasses.pink
                  }`
            }
        `}
      />

      {error && (
        <p className="mt-1.5 ml-1 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
};

export default FormInput;
