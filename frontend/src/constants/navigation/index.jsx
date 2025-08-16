import {
  AdjustmentsHorizontalIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  LinkIcon,
  LockClosedIcon,
  PowerIcon,
  ReceiptPercentIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  UsersIcon,
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
  { label: 'voucher', href: ROUTES.ADMIN.VOUCHER, icon: ReceiptPercentIcon },
  { label: 'shortener_provider', href: ROUTES.ADMIN.SHORTENER_PROVIDER, icon: LinkIcon },
  { label: 'feedbacks', href: ROUTES.ADMIN.CONTACTS, icon: ChatBubbleLeftRightIcon },
  { label: 'logs', href: ROUTES.ADMIN.LOGS, icon: DocumentTextIcon },
];

export const profileMenu = [
  {
    label: 'admin_dashboard',
    icon: ShieldCheckIcon,
    href: ROUTES.ADMIN.DASHBOARD,
    role: 1,
  },
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
  { label: 'my_transaction', value: '1' },
];
