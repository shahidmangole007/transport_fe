import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SelectComboBoxProps<T> {
  items: T[];
  value?: T | null;

  onChange: (item: T | null) => void;

  getLabel: (item: T) => string;
  getValue: (item: T) => string | number;

  placeholder?: string;
  searchPlaceholder?: string;

  onSearch?: (search: string) => void;
}

export function SelectComboBox<T>({
  items,
  value,
  onChange,
  getLabel,
  getValue,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  onSearch,
}: SelectComboBoxProps<T>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!onSearch) return;

    const timer = setTimeout(() => {
      onSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, onSearch]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={" w-full"} asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? getLabel(value) : placeholder}
          

          <ChevronsUpDown className=" ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="start"
        sideOffset={4}
        className="w-[var(--radix-popover-trigger-width)] p-0"
      >
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            value={search}
            onValueChange={setSearch}
          />

          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup>
              {items.map((item) => {
                const itemValue = getValue(item);
                const selectedValue = value
                  ? getValue(value)
                  : null;

                return (
                  <CommandItem
                    key={String(itemValue)}
                    value={getLabel(item)}
                    onSelect={() => {
                      onChange(item);
                      setOpen(false);
                    }}
                  >
                    {getLabel(item)}

                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedValue === itemValue
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}