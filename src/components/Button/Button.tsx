import { getButtonStyle, getSizeClasses } from "./buttonStyles";

interface ButtonProps {
  type?: "button" | "submit";
  size?: "small" | "large";
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const Button = ({
  type = "button",
  size = "large",
  onClick,
  disabled = false,
  children,
  className = "",
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${getButtonStyle(disabled)} ${size === "large" ? getSizeClasses("large") : getSizeClasses("small")} ${className} `}
    >
      {children}
    </button>
  );
};

export default Button;
