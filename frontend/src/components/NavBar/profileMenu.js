import React, { createElement, useState } from 'react';
import {
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from '@material-tailwind/react';
import { ChevronDownIcon, ArrowRightEndOnRectangleIcon, PlusIcon } from '@heroicons/react/24/solid';

import { profileMenu } from '@constants/navbar';
import { useTranslation } from 'react-i18next';

export function ProfileMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  //data for authentication status
  const auth = true;

  const { t } = useTranslation('navbar');
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 md:ml-auto"
        >
          <Avatar
            variant="circular"
            size="sm"
            alt="tania andrew"
            className="border border-gray-300 p-0.5"
            src={{}}
          />
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 text-white dark:text-gray-300 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-1 dark:bg-gray-900 bg-blue-800 dark:border-gray-700">
        {auth ? (
          profileMenu.map(({ label, icon }, key) => {
            return (
              <MenuItem
                key={key}
                onClick={closeMenu}
                className="flex items-center gap-2 rounded hover:bg-light-blue-900 
              active:bg-light-blue-900 focus:bg-light-blue-900 dark:hover:bg-gray-700 dark:active:bg-gray-700 dark:focus:bg-gray-700"
              >
                {createElement(icon, {
                  className: 'h-4 w-4 text-white dark:text-gray-300',
                  strokeWidth: 2,
                })}
                <Typography
                  as="span"
                  variant="small"
                  className="font-normal text-white dark:text-gray-300"
                >
                  {t(label)}
                </Typography>
              </MenuItem>
            );
          })
        ) : (
          <>
            <MenuItem onClick={closeMenu} className="flex items-center gap-2 rounded">
              <ArrowRightEndOnRectangleIcon className="h-4 w-4" />
              <Typography as="span" variant="small" className="font-normal" color="inherit">
                {t('login')}
              </Typography>
            </MenuItem>
            <MenuItem onClick={closeMenu} className="flex items-center gap-2 rounded">
              <PlusIcon className="h-4 w-4" />
              <Typography as="span" variant="small" className="font-normal" color="inherit">
                {t('register')}
              </Typography>
            </MenuItem>
          </>
        )}
      </MenuList>
    </Menu>
  );
}
