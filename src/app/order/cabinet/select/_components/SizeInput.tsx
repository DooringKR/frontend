import Input from "@/components/Input/Input";

interface SizeInputProps {
  label: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

function SizeInput({ label, name, placeholder, value, onChange }: SizeInputProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <label className="text-base font-medium">{label}</label>
      <div className="flex items-center gap-2">
        <div className="flex-grow">
          <Input
            type="number"
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={e => onChange(e.target.value.replace(/\D/g, ""))}
          />
        </div>
        <span className="mr-2">mm</span>
      </div>
    </div>
  );
}

export default SizeInput;
