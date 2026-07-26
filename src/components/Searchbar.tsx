import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

type SearchbarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  resultCount?: number;
};

export function Searchbar({
  value,
  onChange,
  placeholder = "Search...",
  resultCount,
}: SearchbarProps) {
  return (
    <InputGroup className="w-full">
      <InputGroupInput
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />

      <InputGroupAddon>
        <Search className="h-4 w-4" />
      </InputGroupAddon>

      {resultCount !== undefined && (
        <InputGroupAddon align="inline-end">
          {resultCount} results
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}