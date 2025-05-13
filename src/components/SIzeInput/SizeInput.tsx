import Input from "@/components/Input/Input";

interface SizeInputProps {
  label?: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

function SizeInput({ label, name, placeholder, value, onChange }: SizeInputProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-grow">
        <Input
          label={label}
          type="number"
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value.replace(/\D/g, ""))}
        />
      </div>
      <span className="mr-2 mt-6">mm</span>
    </div>
  );
}

export default SizeInput;
