import { InputHTMLAttributes } from "react";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
    return (
      <input
        className={`w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none ${className}`}
        {...props}
      />
    );
  }
  