import {
  UserCircleIcon,
  Cog6ToothIcon,
  PowerIcon,
  AdjustmentsHorizontalIcon,
  UsersIcon,
} from '@heroicons/react/24/solid';

import ROUTES from '../routes';

export const navbar = [
  { label: 'home', href: ROUTES.HOME },
  { label: 'about', href: ROUTES.ABOUT },
  { label: 'contact', href: ROUTES.CONTACTS },
  { label: 'help', href: '#' },
];

export const tabbar = [
  {
    label: 'dashboard',
    href: ROUTES.ADMIN.DASHBOARD,
    icon: AdjustmentsHorizontalIcon,
  },
  { label: 'users', href: ROUTES.ADMIN.USERS, icon: UsersIcon },
];

export const profileMenu = [
  {
    label: 'profile',
    icon: UserCircleIcon,
    href: ROUTES.USER.ME,
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

export const profileTabMenu = [
  { label: 'my_website', value: '0' },
  { label: 'my_order', value: '1' },
];
