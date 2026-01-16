import React from "react";

const Alert = ({
  type = "error",
  variant = "message",
  message,
  description,
  className = "",
  showIcon = true,
}) => {
  const themes = {
    error: {
      bg: "bg-red-50",
      border: "border-red-400",
      text: "text-red-800",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    success: {
      bg: "bg-green-50",
      border: "border-green-400",
      text: "text-green-800",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  };

  const currentTheme = themes[type] || themes.error;

  const variantStyles =
    variant === "panel"
      ? `flex-col items-center text-center p-10 border-2 border-dashed rounded-3xl`
      : `flex-row items-start p-4 border-l-4 rounded-r-xl shadow-sm`;

  if (!message && !description) return null;

  return (
    <div
      className={`flex ${variantStyles} ${currentTheme.bg} ${currentTheme.border} ${currentTheme.text} ${className}`}
    >
      {showIcon && (
        <div
          className={`${
            variant === "panel" ? "mb-4 scale-150" : "mr-3 mt-0.5"
          } flex-shrink-0`}
        >
          {currentTheme.icon}
        </div>
      )}

      <div>
        {message && (
          <p
            className={`text-sm font-bold ${
              variant === "panel" ? "text-lg mb-2" : description ? "mb-1" : ""
            }`}
          >
            {message}
          </p>
        )}
        {description && (
          <p
            className={`text-sm opacity-90 leading-relaxed ${
              variant === "panel" ? "max-w-md" : "italic"
            }`}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default Alert;
