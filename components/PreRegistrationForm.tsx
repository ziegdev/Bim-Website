'use client';

import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import {
  Calendar,
  formatDate,
} from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Typography } from './Typography';
import CustomButton from './CustomButton';
import { useParams } from 'next/navigation';
import { Languages } from '@/lib/types/languages';
import { useDictionary } from '@/hooks/useDictionary';
import { Checkbox } from './ui/checkbox';
import { countries } from 'countries-list';

import { GB } from './ui/flags/GB';
import { FR } from './ui/flags/FR';
import { LU } from './ui/flags/LU';
import { IT } from './ui/flags/IT';
import { ES } from './ui/flags/ES';
import { DE } from './ui/flags/DE';
import Image from 'next/image';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { PhoneInput } from './PhoneInput';

const FormSchema = z.object({
  name: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Invalid email address.',
  }),
  phone: z
    .string()
    .refine(isValidPhoneNumber, {
      message: 'Invalid phone number',
    })
    .or(z.literal('')),
  dob: z.date({
    required_error: 'A date of birth is required.',
  }),
  TOC: z.boolean({
    required_error:
      'You must accept the terms and conditions.',
  }),
});
const topCountryCodes = [
  { value: '+44', label: 'United Kingdom', flag: GB },
  { value: '+33', label: 'France', flag: FR },
  { value: '+352', label: 'Luxembourg', flag: LU },
  { value: '+39', label: 'Italy', flag: IT },
  { value: '+34', label: 'Spain', flag: ES },
  { value: '+49', label: 'Germany', flag: DE },
];

function PreRegistrationForm() {
  const params = useParams();
  const lang = params.lang as Languages;
  const dict = useDictionary(lang);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const getCountryFlag = (code: string) => {
    const topCountry = topCountryCodes.find(
      (c) => c.value === code,
    );
    if (topCountry) {
      const FlagComponent = topCountry.flag;
      return <FlagComponent className="mr-2 h-4 w-6" />;
    } else {
      const country = allCountries.find(
        (c) => c.value === code,
      );
      if (country) {
        return (
          <Image
            src={`https://flagsapi.com/${country.flag.toUpperCase()}/flat/64.png`}
            // src={`https://flagcdn.com/w20/${country.flag.toLowerCase()}.png`}
            alt={country.label}
            width={24}
            height={16}
            className="mr-2 object-contain"
          />
        );
      }
    }
    return null;
  };

  const allCountries = useMemo(() => {
    return Object.entries(countries)
      .map(([code, country]) => ({
        value: `+${country.phone}`,
        label: country.name,
        flag: code, // We'll use this to display flags
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      dob: undefined,
      TOC: false,
    },
  });

  async function onSubmit(
    data: z.infer<typeof FormSchema>,
  ) {
    if (data.TOC === false) {
      toast({
        title: 'You must accept the terms and conditions.',
        description:
          'Please accept the terms and conditions.',
        variant: 'destructive',
      });
      return;
    }

    if (data.phone.length < 10) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Please enter a valid phone number.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/pre-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
        }),
      });

      if (!response.ok) {
        throw new Error(
          'Failed to submit pre-registration',
        );
      }

      toast({
        title:
          dict?.preRegister.form.submitToast.success.title,
        description:
          dict?.preRegister.form.submitToast.success
            .description,
      });

      form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title:
          dict?.preRegister.form.submitToast.error.title,
        description:
          dict?.preRegister.form.submitToast.error
            .description,
        variant: 'destructive',
      });
    }
  }

  if (!dict) {
    return null;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-6 px-4 sm:px-0"
      >
        <Typography
          variant="Bim1"
          className="mb-8 text-center text-xl text-[#D10062] sm:text-3xl"
        >
          {dict.preRegister.content.title}
        </Typography>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <Typography
                  variant="Bim4Regular"
                  className="text-start text-sm font-thin sm:text-base"
                >
                  {dict?.preRegister.form.name.label}
                </Typography>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={
                    dict?.preRegister.form.name.placeholder
                  }
                  {...field}
                  className="text-sm sm:text-base"
                />
              </FormControl>
              <FormMessage className="text-xs sm:text-sm" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <Typography
                  variant="Bim4Regular"
                  className="text-start text-sm font-thin sm:text-base"
                >
                  {dict?.preRegister.form.email.label}
                </Typography>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={
                    dict?.preRegister.form.email.placeholder
                  }
                  {...field}
                  className="text-sm sm:text-base"
                />
              </FormControl>
              <FormMessage className="text-xs sm:text-sm" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormControl className="w-full">
                <PhoneInput
                  placeholder={
                    dict?.preRegister.form.phone
                      .placeholder || 'Enter a phone number'
                  }
                  value={field.value}
                  onChange={field.onChange}
                  defaultCountry="FR"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Typography
                variant="Bim4Regular"
                className="text-start text-sm font-thin sm:text-base"
              >
                {dict?.preRegister.form.dob.label}
              </Typography>
              <FormLabel></FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full pl-3 text-left text-sm font-normal sm:text-base',
                        !field.value &&
                          'text-muted-foreground',
                      )}
                    >
                      {field.value ? (
                        formatDate(field.value, lang)
                      ) : (
                        <span>
                          {
                            dict?.preRegister.form.dob
                              .placeholder
                          }
                        </span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={
                      field.value
                        ? new Date(field.value)
                        : undefined
                    }
                    onDateSelect={(date, formattedDate) => {
                      field.onChange(date);
                      // You can use formattedDate here if needed
                    }}
                    disabled={(date) =>
                      date > new Date() ||
                      date >
                        new Date(
                          new Date().setFullYear(
                            new Date().getFullYear() - 18,
                          ),
                        )
                    }
                    initialFocus
                    fromYear={1900}
                    toYear={new Date().getFullYear() - 18}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage className="text-xs sm:text-sm" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="TOC"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-0 sm:p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="flex flex-wrap items-start text-left sm:text-center">
                  <Typography
                    variant="Bim4Regular"
                    className="ms-2 text-left text-sm font-thin sm:ms-0 sm:text-base"
                  >
                    {dict?.preRegister.form.TOS.label}
                  </Typography>
                  <Dialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Typography
                        variant="Bim4Regular"
                        className="cursor-pointer text-left text-sm font-semibold text-pink sm:text-base"
                      >
                        &nbsp;{' '}
                        {dict?.preRegister.form.TOS.link}
                      </Typography>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>
                          {dict?.preRegister.TOS.title ||
                            'Terms and Conditions'}
                        </DialogTitle>
                      </DialogHeader>
                      <DialogDescription>
                        {dict?.preRegister.TOS
                          .description ||
                          'Your Terms and Conditions text goes here.'}
                      </DialogDescription>
                      <DialogClose asChild>
                        <Button
                          type="button"
                          variant="secondary"
                        >
                          Close
                        </Button>
                      </DialogClose>
                    </DialogContent>
                  </Dialog>
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        <div className="flex w-full flex-col items-center pt-4 sm:pt-8">
          <CustomButton
            variant="tertiary"
            className="w-full bg-[#d10062] py-3 text-lg text-white sm:w-2/3"
            text={dict?.preRegister.form.submit || 'Submit'}
          />
        </div>
      </form>
    </Form>
  );
}

export default PreRegistrationForm;
