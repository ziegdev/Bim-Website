import { CheckIcon, ChevronsUpDown } from 'lucide-react';

import * as React from 'react';

import * as RPNInput from 'react-phone-number-input';

import flags from 'react-phone-number-input/flags';
import { E164Number } from 'libphonenumber-js';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input, InputProps } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';

type PhoneInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> &
  Omit<
    RPNInput.Props<typeof RPNInput.default>,
    'onChange'
  > & {
    onChange?: (value: RPNInput.Value) => void;
  };

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> =
  React.forwardRef<
    React.ElementRef<typeof RPNInput.default>,
    PhoneInputProps
  >(({ className, onChange, ...props }, ref) => {
    return (
      <RPNInput.default
        ref={ref}
        className={cn('flex', className)}
        flagComponent={FlagComponent}
        countrySelectComponent={(props) => (
          <CountrySelect
            {...props}
            disabled={props.disabled}
          />
        )}
        inputComponent={InputComponent}
        onChange={(value) =>
          onChange?.(value || ('' as E164Number))
        }
        {...props}
      />
    );
  });
PhoneInput.displayName = 'PhoneInput';

const InputComponent = React.forwardRef<
  HTMLInputElement,
  InputProps
>(({ className, ...props }, ref) => (
  <Input
    className={cn('rounded-e-lg rounded-s-none', className)}
    {...props}
    ref={ref}
  />
));
InputComponent.displayName = 'InputComponent';

type CountrySelectOption = {
  label: string;
  value: RPNInput.Country;
};

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: CountrySelectOption[];
};
const topCountries = ['FR', 'GB', 'DE', 'IT', 'ES', 'LU'];
const CountrySelect = ({
  disabled,
  value,
  onChange,
  options,
}: CountrySelectProps) => {
  if (!options || options.length === 0) {
    return null;
  }

  const handleSelect = React.useCallback(
    (country: RPNInput.Country) => {
      onChange(country);
    },
    [onChange],
  );

  const sortedOptions = [...options].sort((a, b) => {
    if (
      topCountries.includes(a.value) &&
      !topCountries.includes(b.value)
    )
      return -1;
    if (
      !topCountries.includes(a.value) &&
      topCountries.includes(b.value)
    )
      return 1;
    return a.label.localeCompare(b.label);
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={'outline'}
          className={cn(
            'flex gap-1 rounded-e-none rounded-s-lg px-3',
          )}
          disabled={disabled}
        >
          <FlagComponent
            country={value}
            countryName={value}
          />
          <span className="text-sm">
            +{RPNInput.getCountryCallingCode(value)}
          </span>
          <ChevronsUpDown
            className={cn(
              '-mr-2 h-4 w-4 opacity-50',
              disabled ? 'hidden' : 'opacity-100',
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[300px] p-0"
        sideOffset={5}
      >
        <Command className="max-h-[300px] overflow-y-auto">
          <CommandList>
            <ScrollArea className="h-72">
              <CommandInput placeholder="Search country..." />
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {sortedOptions
                  .filter((x) => x.value)
                  .map((option) => (
                    <CommandItem
                      className="gap-2"
                      key={option.value}
                      onSelect={() =>
                        handleSelect(option.value)
                      }
                    >
                      <FlagComponent
                        country={option.value}
                        countryName={option.label}
                      />
                      <span className="flex-1 text-sm">
                        {option.label}
                      </span>
                      <span className="text-sm text-foreground/50">
                        +
                        {RPNInput.getCountryCallingCode(
                          option.value,
                        )}
                      </span>
                      <CheckIcon
                        className={cn(
                          'ml-auto h-4 w-4',
                          option.value === value
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const FlagComponent = ({
  country,
  countryName,
}: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};
FlagComponent.displayName = 'FlagComponent';

export { PhoneInput };
