import { UserCircleIcon, Cog6ToothIcon, PowerIcon } from '@heroicons/react/24/solid';

export const navbar = [
  { label: 'home', href: '/' },
  { label: 'about', href: '#' },
  { label: 'contact', href: '#' },
  { label: 'help', href: '#' },
];

export const profileMenu = [
  {
    label: 'profile',
    icon: UserCircleIcon,
  },
  {
    label: 'settings',
    icon: Cog6ToothIcon,
  },
  {
    label: 'logout',
    icon: PowerIcon,
  },
];
