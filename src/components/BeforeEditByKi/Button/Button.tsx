import { getButtonStyle } from "./buttonStyles";

interface ButtonProps {
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const Button = ({
  type = "button",
  onClick,
  disabled = false,
  selected = false,
  loading = false,
  children,
  className = "",
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`h-12 ${getButtonStyle({ disabled, selected, loading })} ${className}`}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-1">
          <span className="animate-pulse">•</span>
          <span className="animate-pulse delay-100">•</span>
          <span className="animate-pulse delay-200">•</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
