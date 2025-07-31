import React from "react";

import Button from "../Button/Button";

interface BottomButtonProps {
  type: "1button" | "2buttons" | "textcombo+button";
  button1Text?: string;
  button2Text?: string;
  textComboText?: { title: string; subtitle: string };
  onButton1Click?: () => void;
  onButton2Click?: () => void;
  className?: string;
  children?: React.ReactNode;
  button1Type?:
  | "Brand"
  | "GrayLarge"
  | "OutlinedLarge"
  | "BrandInverse"
  | "GrayMedium"
  | "OutlinedMedium";
  button2Type?:
  | "Brand"
  | "GrayLarge"
  | "OutlinedLarge"
  | "BrandInverse"
  | "GrayMedium"
  | "OutlinedMedium";
  button1Disabled?: boolean;
}

const BottomButton: React.FC<BottomButtonProps> = ({
  type,
  button1Text,
  button2Text,
  textComboText,
  onButton1Click,
  onButton2Click,
  className = "",
  children,
  button1Type = "Brand",
  button2Type = "Brand",
  button1Disabled = false,
}) => {
  return (
    <div>
      {type === "1button" && (
        <div className={`pt-5 ${className}`} style={{
          background: 'linear-gradient(to top, white 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)',
          zIndex: 9999
        }}>
          {children && <div>{children}</div>}
          <Button
            disabled={button1Disabled}
            type={button1Type}
            text={button1Text || ""}
            onClick={onButton1Click}
          />
        </div>
      )}
      {type === "2buttons" && (
        <div className={`flex gap-3 p-5 ${className}`} style={{
          background: 'linear-gradient(to top, white 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)',
          zIndex: 9999
        }}>
          <Button
            disabled={button1Disabled}
            type={button1Type}
            text={button1Text || ""}
            onClick={onButton1Click}
          />
          <Button
            disabled={false}
            type={button2Type}
            text={button2Text || ""}
            onClick={onButton2Click}
          />
        </div>
      )}
      {type === "textcombo+button" && (
        <div className={`justify-bewteen flex items-center gap-3 p-5 ${className}`} style={{
          background: 'linear-gradient(to top, white 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)',
          zIndex: 9999
        }}>
          <div className="flex-1">
            <div className="flex flex-col">
              <span className="text-[17px] font-600 text-gray-700">{textComboText?.title}</span>
              <span className="text-[14px] font-500 text-gray-400">{textComboText?.subtitle}</span>
            </div>
          </div>
          <div className="flex-1">
            <Button
              disabled={button1Disabled}
              type={button1Type}
              text={button1Text || ""}
              onClick={onButton1Click}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BottomButton;
