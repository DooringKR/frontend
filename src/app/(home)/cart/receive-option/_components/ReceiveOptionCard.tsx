interface ReceiveOptionCardProps {
  icon: string;
  alt: string;
  title: string;
  description: string;
  onClick: () => void;
}

export default function ReceiveOptionCard({
  icon,
  alt,
  title,
  description,
  onClick,
}: ReceiveOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-5 rounded-xl border border-gray-200 px-5 py-4"
    >
      <img src={icon} alt={alt} className="h-10 w-10" />
      <div className="flex flex-col items-start gap-1">
        <div className="text-[17px] font-600">{title}</div>
        <p className="text-left font-400 text-gray-500">{description}</p>
      </div>
    </button>
  );
}
