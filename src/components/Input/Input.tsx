import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface InputProps extends React.PropsWithChildren {
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  register?: UseFormRegisterReturn;
  type: "text" | "email" | "password" | "number";
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
  const effectiveError = disabled ? undefined : error;

  return (
    <div className="relative flex flex-col gap-2">
      {label && (
        <label htmlFor={name} className="text-base font-normal leading-[1.4] text-[#1e1e1e]">
          {label}
        </label>
      )}
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register}
        value={value}
        onBlur={onBlur}
        onChange={onChange}
        disabled={disabled}
        onKeyDown={onKeyDown}
        className={`h-10 w-full rounded-lg border bg-white px-4 py-3 outline-none ${
          effectiveError ? "border-[#900B09]" : ""
        } ${className}`}
      />
      {effectiveError && (
        <p className="text-base font-normal leading-[1.4] text-[#900B09]">
          {effectiveError.message}
        </p>
      )}
    </div>
  );
}
