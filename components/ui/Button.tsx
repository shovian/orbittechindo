import { ButtonHTMLAttributes } from "react";

export function Button({ children, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
      <button
        className={`rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }