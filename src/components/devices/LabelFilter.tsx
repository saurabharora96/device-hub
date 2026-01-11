import { useState, useMemo } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

interface LabelFilterProps {
  labelKey: string;
  values: string[];
  selectedValue: string | null;
  onSelect: (value: string | null) => void;
}

export function LabelFilter({ labelKey, values, selectedValue, onSelect }: LabelFilterProps) {
  const [open, setOpen] = useState(false);

  const uniqueValues = useMemo(() => {
    return [...new Set(values.filter(Boolean))].sort();
  }, [values]);

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between min-w-[160px] h-9"
          >
            <span className="flex items-center gap-2">
              <span className="text-muted-foreground text-xs font-medium uppercase">
                {labelKey}
              </span>
              {selectedValue && (
                <Badge variant="secondary" className="font-normal">
                  {selectedValue}
                </Badge>
              )}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0 z-50 bg-popover" align="start">
          <Command>
            <CommandInput placeholder={`Filter ${labelKey}...`} />
            <CommandList>
              <CommandEmpty>No values found.</CommandEmpty>
              <CommandGroup>
                {uniqueValues.map((value) => (
                  <CommandItem
                    key={value}
                    value={value}
                    onSelect={() => {
                      onSelect(selectedValue === value ? null : value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedValue === value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {value}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedValue && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onSelect(null)}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
