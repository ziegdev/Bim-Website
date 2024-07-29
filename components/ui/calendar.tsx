'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  DayPicker,
  DayClickEventHandler,
} from 'react-day-picker';
import { usePathname } from 'next/navigation';
import { format } from 'date-fns';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import {
  CaptionProps,
  useNavigation,
} from 'react-day-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Import date-fns locales
import { enUS, fr, de, it, es, lb } from 'date-fns/locale';

export type CalendarProps = React.ComponentProps<
  typeof DayPicker
> & {
  onDateSelect?: (
    date: Date,
    formattedDate: string,
  ) => void;
};

const locales = {
  en: enUS,
  fr: fr,
  de: de,
  it: it,
  es: es,
  lb: lb, // Use your custom Luxembourgish locale
};

export function formatDate(
  date: Date | string | undefined,
  currentLang: string,
) {
  if (!date) return '';

  const dateObject =
    typeof date === 'string' ? new Date(date) : date;

  if (
    !(dateObject instanceof Date) ||
    isNaN(dateObject.getTime())
  ) {
    return '';
  }

  const localeFormat = {
    en: 'MM/dd/yyyy',
    fr: 'dd/MM/yyyy',
    de: 'dd.MM.yyyy',
    it: 'dd/MM/yyyy',
    es: 'dd/MM/yyyy',
    lb: 'dd.MM.yyyy',
  };

  return format(
    dateObject,
    localeFormat[
      currentLang as keyof typeof localeFormat
    ] || 'dd/MM/yyyy',
    {
      locale: locales[currentLang as keyof typeof locales],
    },
  );
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  onDateSelect,
  ...props
}: CalendarProps) {
  const pathname = usePathname();
  const currentLang = pathname.split('/')[1];
  const locale =
    locales[currentLang as keyof typeof locales] || enUS;

  const handleDayClick: DayClickEventHandler = (
    day,
    modifiers,
  ) => {
    if (!modifiers.disabled && onDateSelect) {
      const formattedDate = formatDate(day, currentLang);
      onDateSelect(day, formattedDate);
    }
  };

  function CustomCaption({ displayMonth }: CaptionProps) {
    const { goToMonth, nextMonth, previousMonth } =
      useNavigation();

    const months = React.useMemo(
      () =>
        Array.from({ length: 12 }).map((_, i) =>
          new Date(2021, i, 1).toLocaleString(currentLang, {
            month: 'long',
          }),
        ),
      [currentLang],
    );

    const years = Array.from(
      { length: props.toYear! - props.fromYear! + 1 },
      (_, i) => props.fromYear! + i,
    );

    return (
      <div className="flex justify-center space-x-2">
        <Select
          value={displayMonth.getMonth().toString()}
          onValueChange={(value) => {
            const newMonth = new Date(displayMonth);
            newMonth.setMonth(parseInt(value));
            goToMonth(newMonth);
          }}
        >
          <SelectTrigger className="w-[110px]">
            <SelectValue>
              {months[displayMonth.getMonth()]}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {months.map((month, index) => (
              <SelectItem
                key={month}
                value={index.toString()}
              >
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={displayMonth.getFullYear().toString()}
          onValueChange={(value) => {
            const newMonth = new Date(displayMonth);
            newMonth.setFullYear(parseInt(value));
            goToMonth(newMonth);
          }}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue>
              {displayMonth.getFullYear()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem
                key={year}
                value={year.toString()}
              >
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <DayPicker
      locale={locale}
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months:
          'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption:
          'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell:
          'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
        ),
        day_range_end: 'day-range-end',
        day_selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        day_today: 'bg-accent text-accent-foreground',
        day_outside:
          'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => (
          <ChevronLeft className="h-4 w-4" />
        ),
        IconRight: ({ ...props }) => (
          <ChevronRight className="h-4 w-4" />
        ),
        Caption: CustomCaption,
      }}
      onDayClick={handleDayClick}
      {...props}
    />
  );
}

Calendar.displayName = 'Calendar';

export { Calendar };
