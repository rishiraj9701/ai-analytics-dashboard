import { InputHTMLAttributes, ReactNode, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  helperText,
  error,
  leftIcon,
  className = "",
  type = "text",
  id,
  ...props
}, ref) => {
  const generatedId = id || "input_" + Math.random().toString(36).substring(2, 9);
  
  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <label 
          htmlFor={generatedId} 
          className="text-xs font-semibold tracking-tight text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 text-gray-400 dark:text-gray-500 pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}
        <input
          id={generatedId}
          type={type}
          ref={ref}
          className={`w-full font-sans text-sm rounded-md border py-2 px-3 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed ${
            leftIcon ? "pl-10" : "pl-3"
          } ${
            error 
              ? "border-red-500 dark:border-red-500/50 bg-red-50/10 focus:border-red-500" 
              : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50 focus:border-blue-500 focus:ring-blue-500/10"
          }`}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs font-medium text-red-500 mt-0.5">
          {error}
        </span>
      )}
      {!error && helperText && (
        <span className="text-xs text-gray-500 mt-0.5">
          {helperText}
        </span>
      )}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
