"use client";

import * as React from "react";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";

type SelectSearchProps<T> = {
  options: T[];
  useRecents: boolean;
  recentsStorageKey: string;
  value?: T | null;
  onChange?: (value: T) => void;
  placeholder?: string;
  name?: string;
  className?: string; // applied to PopoverContent
  triggerClassName?: string; // optional: separate style for the trigger
  getLabel?: (value: T) => string;
  getValue?: (value: T) => string | number;
  popoverProps?: React.ComponentProps<typeof Popover>;
  maxRecents?: number;
};

export function SelectSearch<T>({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  name,
  className, // PopoverContent class
  triggerClassName,
  getLabel = (v) => `${v}`,
  getValue = (v) => `${v}`,
  popoverProps,
  maxRecents = 5,
  useRecents,
  recentsStorageKey,
}: SelectSearchProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState<T | null>(
    value ?? null
  );
  const [recents, setRecents] = React.useState<T[]>([]);
  const [optionsWithoutRecents, setOptionsWithoutRecents] =
    React.useState<T[]>(options);
  const currentValue = value ?? selectedValue;

  // Load from localStorage if persistence is desired
  React.useEffect(() => {
    if (!useRecents || !recentsStorageKey) return;
    try {
      const raw = localStorage.getItem(recentsStorageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        setRecents(parsed);
        const filteredOptions = options.filter(
          (option) =>
            !parsed.some((recent: T) => getValue(recent) === getValue(option))
        );
        setOptionsWithoutRecents(filteredOptions);
      }
    } catch {
      // fail silently
    }
  }, [useRecents, selectedValue]);

  // Add selection to recents list
  const handleSelect = (option: T) => {
    setSelectedValue(option);
    setOpen(false);
    onChange?.(option);

    if (!useRecents) return;

    setRecents((prev) => {
      const existing = prev.filter(
        (item) => getValue(item) !== getValue(option)
      );
      const updated = [option, ...existing].slice(0, maxRecents ?? 5);
      if (recentsStorageKey) {
        localStorage.setItem(recentsStorageKey, JSON.stringify(updated));
      }
      return updated;
    });
  };

  return (
    <Popover modal={true} open={open} onOpenChange={setOpen} {...popoverProps}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between", triggerClassName)}
        >
          {currentValue ? getLabel(currentValue) : placeholder}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-[200px] p-0", className)}>
        <Command>
          <CommandInput placeholder="Search..." />

          <ScrollArea className="max-h-[300px] h-[300px]">
            {recents.length > 0 && (
              <CommandGroup heading="Recent">
                {recents.map((option, i) => {
                  const label = getLabel(option);
                  return (
                    <CommandItem
                      key={`recent-${i}`}
                      value={label}
                      tabIndex={0}
                      className="hover:bg-muted focus:bg-accent"
                      onSelect={() => {
                        handleSelect(option);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSelect(option);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          currentValue &&
                            getValue(currentValue) === getValue(option)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}

            <CommandGroup heading="All Options">
              {optionsWithoutRecents.map((option, i) => {
                const label = getLabel(option);
                return (
                  <CommandItem
                    tabIndex={0}
                    className="hover:bg-muted focus:bg-accent focus:outline-none"
                    key={`option-${i}`}
                    value={label}
                    onSelect={() => {
                      handleSelect(option);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSelect(option);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        currentValue &&
                          getValue(currentValue) === getValue(option)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </ScrollArea>
        </Command>
      </PopoverContent>

      {name && currentValue !== null && (
        <input type="hidden" name={name} value={getValue(currentValue)} />
      )}
    </Popover>
  );
}
