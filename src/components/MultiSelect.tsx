import { useRef, useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { ChevronDown } from "lucide-react";

interface MultiSelectProps {
  optionValue?: string;
  optionLabel?: string;
  options: any[];
  value: string[];
  onChange: (newValue: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function MultiSelect({
  optionValue = "value",
  optionLabel = "label",
  options,
  value,
  onChange,
  placeholder = "Select options...",
  disabled,
}: MultiSelectProps) {
  const [panelWidth, setPanelWidth] = useState<number>(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const toggle = (v: string) => {
    if (value.includes(v)) {
      onChange(value.filter((item) => item !== v));
    } else {
      onChange([...value, v]);
    }
  };

  useEffect(() => {
    setPanelWidth(triggerRef.current?.offsetWidth);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={disabled} className="block w-full focus:outline-none" ref={triggerRef}>
        <div className="relative">
          <Input
            placeholder={placeholder}
            className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus:bg-accent focus:text-accent-foreground"
            value={value?.length > 0
              ? options.filter(o => value.includes(o[optionValue])).map(o => o[optionLabel]).join(", ")
              : placeholder}
            readOnly
            disabled={disabled}
          />
          <ChevronDown className="h-4 w-4 opacity-50 absolute top-[50%] translate-y-[-50%] right-3" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" style={{ width: panelWidth }}>
        {options.map((opt) => (
          <DropdownMenuCheckboxItem
            key={opt[optionValue]}
            checked={value.includes(opt[optionValue])}
            onSelect={(e) => e.preventDefault()}
            onCheckedChange={() => toggle(opt[optionValue])}
          >
            {opt[optionLabel]}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>    
  );
}
