import React, { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  isHoverable?: boolean;
  className?: string;
}

export default function Card({
  children,
  header,
  footer,
  isHoverable = false,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-900 rounded-lg shadow-sm transition-all duration-300 ${
        isHoverable ? "hover:shadow-md hover:border-gray-200 dark:hover:border-gray-800 hover:-translate-y-0.5" : ""
      } ${className}`}
      {...props}
    >
      {header && (
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-900/50 flex flex-row items-center justify-between">
          <div className="text-sm font-semibold tracking-tight text-gray-900 dark:text-gray-50">
            {header}
          </div>
        </div>
      )}
      <div className="p-5">
        {children}
      </div>
      {footer && (
        <div className="px-5 py-3.5 bg-gray-50/50 dark:bg-gray-900/20 border-t border-gray-100 dark:border-gray-900/50 rounded-b-lg text-xs font-medium text-gray-500">
          {footer}
        </div>
      )}
    </div>
  );
}
