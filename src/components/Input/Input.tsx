import { useState } from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface InputProps extends React.PropsWithChildren {
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  register?: UseFormRegisterReturn;
  type: "text" | "email" | "password" | "number" | "tel";
  name: string;
  label?: string;
  placeholder: string;
  error?: FieldError | undefined;
  disabled?: boolean;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  className?: string;
}

export default function Input({
  register,
  value,
  onChange,
  onBlur,
  type,
  name,
  label,
  placeholder,
  error,
  disabled,
  onKeyDown,
  className = "",
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const effectiveError = disabled ? undefined : error;

  // const labelColor = effectiveError
  //   ? "text-red-500"
  //   : isFocused
  //     ? "text-brand-500"
  //     : "text-gray-200";
  const labelColor = "text-gray-600";

  const borderColor = effectiveError
    ? "border-red-500"
    : isFocused
      ? "border-brand-500"
      : "border-gray-200";

  const textColor = "text-[#1e1e1e]";

  return (
    <div className="relative flex flex-col gap-2">
      {label && (
        <label htmlFor={name} className={`text-sm font-normal leading-[1.4] ${labelColor}`}>
          {label}
        </label>
      )}
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register}
        value={value}
        onBlur={e => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        onFocus={() => setIsFocused(true)}
        onChange={onChange}
        disabled={disabled}
        onKeyDown={onKeyDown}
        className={`h-auto w-full rounded-xl border bg-white px-4 py-3 outline-none transition-colors duration-200 ${textColor} ${borderColor} ${className}`}
      />

      {effectiveError && <p className="text-sm text-red-500">{effectiveError.message}</p>}
    </div>
  );
}
