import Input from "@/components/Input/Input";

interface CompartmentCountProps {
  compartmentCount: string;
  setCompartmentCount: (value: string) => void;
}

function Open({ compartmentCount, setCompartmentCount }: CompartmentCountProps) {
  return (
    <div className="w-full">
      <Input
        label="구성 칸 수"
        type="number"
        name="구성 칸 수"
        placeholder="구성 칸 수를 입력해주세요"
        value={compartmentCount}
        onChange={e => setCompartmentCount(e.target.value.replace(/\D/g, ""))}
      />
    </div>
  );
}

export default Open;
