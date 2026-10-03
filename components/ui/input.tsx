import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="form-group">
      {label && <label className="label">{label}</label>}
      <input className={`input ${className}`} {...props} />
      {error && <p className="text-secondary" style={{ color: "var(--color-danger)" }}>{error}</p>}
    </div>
  );
}
