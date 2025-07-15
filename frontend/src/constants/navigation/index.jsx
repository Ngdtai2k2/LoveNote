import {
  UserCircleIcon,
  PowerIcon,
  AdjustmentsHorizontalIcon,
  UsersIcon,
  LockClosedIcon,
} from '@heroicons/react/24/solid';

import ROUTES from '../routes';

export const navbar = [
  { label: 'home', href: ROUTES.HOME },
  { label: 'tasks', href: ROUTES.TASKS },
  { label: 'reward', href: ROUTES.REWARD },
  { label: 'about', href: ROUTES.ABOUT },
  { label: 'contact', href: ROUTES.CONTACTS },
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
    label: 'change_password',
    icon: LockClosedIcon,
    href: ROUTES.AUTH.CHANGE_PASSWORD,
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
