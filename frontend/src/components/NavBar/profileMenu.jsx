import React, { createElement, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from '@material-tailwind/react';
import {
  ChevronDownIcon,
  ArrowRightEndOnRectangleIcon,
  PlusIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  LockClosedIcon,
  PowerIcon,
} from '@heroicons/react/24/solid';

import { useCurrentUser } from '@hooks/useCurrentUser';
import { useAxios } from '@hooks/useAxiosJWT';
import { authAPI } from '@api/auth';

import ROUTES from '@constants/routes';
import CONSTANTS from '@constants';
import { profileMenu } from '@constants/navigation';

export function ProfileMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation('navbar');
  const { axiosJWT } = useAxios(i18n.language);

  const user = useCurrentUser();
  const userRole = user?.role || 0;

  const filteredProfileMenu = profileMenu.filter((item) => !item.role || item.role === userRole);

  const handleNavigate = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="gray"
          className="flex items-center gap-1 rounded-full border-none py-0.5 pl-0.5 pr-2 md:ml-auto"
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
            className={`h-3 w-3 text-gray-700 transition-transform dark:text-gray-200 ${
              isMenuOpen ? 'rotate-180' : ''
            }`}
          />
        </Button>
      </MenuHandler>

      <MenuList className="bg-white p-1 dark:border-gray-700 dark:bg-gray-900">
        {user ? (
          <div>
            <MenuItem key="wallet-balance">
              <div className="flex items-center dark:text-gray-200 text-gray-900 border rounded p-1">
                <span>
                  Token: {Number(user?.wallet?.token_balance || 0).toLocaleString('vi-VN')}
                </span>
                <CurrencyDollarIcon className="w-4 h-4 ml-1" />
              </div>
            </MenuItem>

            {filteredProfileMenu.map(({ label, icon, href }, key) => (
              <MenuItem
                key={key}
                onClick={() => {
                  setIsMenuOpen(false);
                  if (label === 'logout') {
                    dispatch(authAPI.signOut(axiosJWT, navigate));
                  } else if (href) {
                    handleNavigate(href);
                  }
                }}
                className="flex items-center gap-2 rounded hover:bg-gray-300 
            focus:bg-gray-300 active:bg-gray-300 dark:hover:bg-gray-700 
            dark:focus:bg-gray-700 dark:active:bg-gray-700"
              >
                {createElement(icon, {
                  className: 'h-4 w-4 text-gray-800 dark:text-gray-200',
                  strokeWidth: 2,
                })}
                {href ? (
                  <Link to={href} className="flex-1">
                    <Typography
                      as="span"
                      variant="small"
                      className="font-normal text-gray-800 dark:text-gray-200"
                    >
                      {t(label)}
                    </Typography>
                  </Link>
                ) : (
                  <Typography
                    as="span"
                    variant="small"
                    className="font-normal text-gray-800 dark:text-gray-200 cursor-pointer"
                  >
                    {t(label)}
                  </Typography>
                )}
              </MenuItem>
            ))}
          </div>
        ) : (
          <div>
            <MenuItem
              onClick={() => {
                setIsMenuOpen(false);
                navigate(ROUTES.AUTH.SIGN_IN);
              }}
              className="flex items-center gap-2 rounded hover:bg-gray-300 
              focus:bg-gray-300 active:bg-gray-300 dark:hover:bg-gray-700 
              dark:focus:bg-gray-700 dark:active:bg-gray-700"
            >
              <ArrowRightEndOnRectangleIcon className="h-4 w-4 text-gray-800 dark:text-gray-200" />
              <Typography
                as="span"
                variant="small"
                className="font-normal text-gray-800 dark:text-gray-200"
              >
                {t('login')}
              </Typography>
            </MenuItem>

            <MenuItem
              onClick={() => {
                setIsMenuOpen(false);
                navigate(ROUTES.AUTH.SIGN_UP);
              }}
              className="flex items-center gap-2 rounded hover:bg-gray-300 
              focus:bg-gray-300 active:bg-gray-300 dark:hover:bg-gray-700 
              dark:focus:bg-gray-700 dark:active:bg-gray-700"
            >
              <PlusIcon className="h-4 w-4 text-gray-800 dark:text-gray-200" />
              <Typography
                as="span"
                variant="small"
                className="font-normal text-gray-800 dark:text-gray-200"
              >
                {t('register')}
              </Typography>
            </MenuItem>
          </div>
        )}
      </MenuList>
    </Menu>
  );
}
