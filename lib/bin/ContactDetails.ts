// ContactDetails.ts

import phoneContactDetails from '../../public/icons/phone-contact-details.svg';
import emailContactDetails from '../../public/icons/email-contact-details.svg';
import locationContactDetails from '../../public/icons/location-contact-details.svg';
import { Dictionary } from '@/lib/types/dictionary';

export type ContactDetailItem = {
  id: string;
  nameKey: keyof Dictionary['contact']['details'];
  href: string;
  valueKey: keyof Dictionary['contact']['details'];
};
export const ContactDetails: ContactDetailItem[] = [
  {
    id: '1',
    nameKey: 'callUs',
    href: phoneContactDetails.src,
    valueKey: 'phoneNumber',
  },
  {
    id: '2',
    nameKey: 'email',
    href: emailContactDetails.src,
    valueKey: 'emailAddress',
  },
  {
    id: '3',
    nameKey: 'location',
    href: locationContactDetails.src,
    valueKey: 'address',
  },
];
