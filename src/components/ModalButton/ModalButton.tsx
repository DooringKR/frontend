import Image from "next/image";

interface ModalButtonProps {
  value?: string;
  label?: string;
  placeholder: string;
  className?: string;
  onClick: () => void;
}

function ModalButton({ value, label, placeholder, onClick, className }: ModalButtonProps) {
  const isSelected = !!value;

  return (
    <div className="relative flex flex-col gap-1">
      {label && (
        <label htmlFor={label} className="text-sm font-normal leading-[1.4] text-gray-300">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={onClick}
        className={`flex h-8 w-full items-center justify-between border-b-[2px] pr-4 text-start ${
          isSelected ? "text-black" : "text-gray-400"
        } ${className}`}
      >
        <p>{isSelected ? value : placeholder}</p>
        <Image src="/icons/Arrow_Bottom.svg" alt="드롭다운 아이콘" width={15} height={7.5} />
      </button>
    </div>
  );
}

export default ModalButton;
