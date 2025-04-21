import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface InputProps extends React.PropsWithChildren {
  register: UseFormRegisterReturn;
  type: "text" | "email" | "password" | "number";
  name: string;
  label?: string;
  placeholder: string;
  error: FieldError | undefined;
  disabled?: boolean;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

export default function Input({
  register,
  type,
  name,
  label,
  placeholder,
  error,
  disabled,
  onKeyDown,
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
        disabled={disabled}
        onKeyDown={onKeyDown}
        className={`h-10 w-full rounded-lg bg-white px-4 py-3 outline-none ${effectiveError && "border-[#900B09]"} border`}
      />
      {effectiveError && (
        <p className="text-base font-normal leading-[1.4] text-[#900B09]">
          {effectiveError.message}
        </p>
      )}
    </div>
  );
}
