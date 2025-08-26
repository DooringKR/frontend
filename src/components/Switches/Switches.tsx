import React, { useState } from "react";

interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange, disabled }) => {
  const [internalChecked, setInternalChecked] = useState(checked ?? false);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  const handleToggle = () => {
    if (disabled) return;
    if (!isControlled) setInternalChecked(!isChecked);
    onChange?.(!isChecked);
  };

  return (
    <button
      type="button"
      className={`flex h-[24px] w-[40px] items-center rounded-full p-[2px] transition-colors duration-200 focus:outline-none overflow-hidden ${disabled ? "bg-gray-200" : isChecked ? "bg-brand-500" : "bg-gray-300"} ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      onClick={handleToggle}
      aria-checked={isChecked}
      disabled={disabled}
      role="switch"
    >
      <span
        className={`h-[20px] w-[20px] rounded-full bg-white transition-transform duration-200 ${isChecked ? "translate-x-[16px]" : "translate-x-0"}`}
        style={{
          filter: "drop-shadow(0px 2px 10px rgba(3, 7, 18, 0.20))",
        }}
      />
    </button>
  );
};

// 데모용 예시 컴포넌트
const SwitchDemo = () => {
  const [on, setOn] = useState(true);
  return (
    <div className="flex flex-col gap-4">
      <Switch checked={on} onChange={setOn} />
      <div>disabled</div>
      <Switch checked={false} disabled />{" "}
    </div>
  );
};

export default SwitchDemo;
