import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

interface Option {
  value: string
  label: string
}

interface SearchableSelectProps {
  name: string
  label: string
  options: Option[]
  placeholder?: string
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  name,
  label,
  options,
  placeholder,
}) => {
  const { control } = useFormContext()
  const [searchParams, setSearchParams] = useState('')

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchParams.toLowerCase()),
  )

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    'w-[380px] justify-between',
                    !field.value && 'text-muted-foreground',
                  )}
                >
                  {field.value?.label || placeholder || 'Select an option'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[380px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search..."
                  value={searchParams}
                  onValueChange={setSearchParams}
                />
                <CommandList>
                  {filteredOptions.length ? (
                    <CommandGroup>
                      {filteredOptions.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.label}
                          onSelect={() => field.onChange(option)}
                        >
                          {option.label}
                          <Check
                            className={cn(
                              'ml-auto',
                              option.value === field.value?.value
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ) : (
                    <CommandEmpty>No options found.</CommandEmpty>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
