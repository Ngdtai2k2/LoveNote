import React, { createElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

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

import { profileMenu } from '@constants/navigation';
import { useCurrentUser } from '@hooks/useCurrentUser';
import { useAxios } from '@hooks/useAxiosJWT';
import { signOut } from '@api/auth';
import ROUTES from '@constants/routes';
import CONSTANTS from '@constants';

export function ProfileMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation('navbar');
  const { axiosJWT } = useAxios(i18n.language);

  const user = useCurrentUser();

  const handleNavigate = path => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const renderMenuItem = (label, Icon, path) => (
    <MenuItem
      onClick={() => handleNavigate(path)}
      className="flex items-center gap-2 rounded hover:bg-gray-300 
            active:bg-gray-300 focus:bg-gray-300 dark:hover:bg-gray-700 
            dark:active:bg-gray-700 dark:focus:bg-gray-700"
    >
      <Icon className="h-4 w-4 text-gray-900 dark:text-gray-200" />
      <Typography
        as="span"
        variant="small"
        className="font-normal text-gray-900 dark:text-gray-200"
      >
        {t(label)}
      </Typography>
    </MenuItem>
  );

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="gray"
          className="flex border-none items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 md:ml-auto"
        >
          <Avatar
            variant="circular"
            size="sm"
            alt="User Avatar"
            className="border border-gray-300 p-0.5"
            src={user?.avatar ? user.avatar : CONSTANTS.DEFAULT_AVATAR}
          />
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 text-gray-700 dark:text-gray-200 transition-transform ${
              isMenuOpen ? 'rotate-180' : ''
            }`}
          />
        </Button>
      </MenuHandler>

      <MenuList className="p-1 dark:bg-gray-900 bg-white dark:border-gray-700">
        {user ? (
          profileMenu.map(({ label, icon }, key) => (
            <MenuItem
              key={key}
              onClick={() => {
                setIsMenuOpen(false);
                if (key === profileMenu.length - 1) {
                  dispatch(signOut(axiosJWT, navigate));
                }
              }}
              className="flex items-center gap-2 rounded hover:bg-gray-300 
            active:bg-gray-300 focus:bg-gray-300 dark:hover:bg-gray-700 
            dark:active:bg-gray-700 dark:focus:bg-gray-700"
            >
              {createElement(icon, {
                className: 'h-4 w-4 text-gray-800 dark:text-gray-200',
                strokeWidth: 2,
              })}
              <Typography
                as="span"
                variant="small"
                className="font-normal text-gray-800 dark:text-gray-200"
              >
                {t(label)}
              </Typography>
            </MenuItem>
          ))
        ) : (
          <>
            {renderMenuItem('login', ArrowRightEndOnRectangleIcon, ROUTES.AUTH.SIGN_IN)}
            {renderMenuItem('register', PlusIcon, ROUTES.AUTH.SIGN_UP)}
          </>
        )}
      </MenuList>
    </Menu>
  );
}
