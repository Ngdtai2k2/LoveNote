import React, { createElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import {
  Navbar,
  Typography,
  MenuItem,
  IconButton,
  Collapse,
  Drawer,
} from '@material-tailwind/react';
import { Bars2Icon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';

import { navbar, tabbar } from '@constants/navigation';
import CONSTANTS from '@constants';
import ROUTES from '@constants/routes';
import ToggleMode from '@components/ToggleMode';
import { ProfileMenu } from './profileMenu';
import { Link } from 'react-router-dom';

function NavList() {
  const { t } = useTranslation('navbar');

  return (
    <ul className="mt-2 mb-4 flex flex-col gap-2 md:mb-0 md:mt-0 md:flex-row md:items-center">
      {navbar.map((nav, index) => (
        <li key={index}>
          <Link to={nav.href}>
            <MenuItem
              className="flex items-center gap-2 md:rounded-full hover:bg-gray-300 
          active:bg-gray-300 focus:bg-gray-300 dark:hover:bg-gray-800 
          dark:active:bg-gray-800 dark:focus:bg-gray-800"
            >
              <span className="text-black dark:text-gray-200">{t(nav.label)}</span>
            </MenuItem>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function TabBar({ openTabBar, closeTabBar }) {
  const { t } = useTranslation('tabbar');
  return (
    <Drawer open={openTabBar} onClose={closeTabBar} className="p-4 dark:bg-gray-700">
      <div className="mb-6 flex items-center justify-between">
        <Typography variant="h5" className="text-black dark:text-gray-200">
          {CONSTANTS.SITE_NAME}
        </Typography>
        <IconButton variant="text" color="black" onClick={closeTabBar}>
          <XMarkIcon className="size-6 text-black dark:text-gray-200" />
        </IconButton>
      </div>
      <ul className="mt-2 mb-4 flex flex-col gap-2">
        {tabbar.map((tab, index) => (
          <Link key={index} to={tab.href}>
            <MenuItem
              className="flex items-center gap-2 md:rounded-full hover:bg-gray-300 
            active:bg-gray-300 focus:bg-gray-300 dark:hover:bg-gray-800 
            dark:active:bg-gray-800 dark:focus:bg-gray-800"
            >
              {createElement(tab.icon, {
                className: 'h-6 w-6 text-gray-800 dark:text-gray-200',
                strokeWidth: 2,
              })}
              <span className="text-black dark:text-gray-200">{t(tab.label)}</span>
            </MenuItem>
          </Link>
        ))}
      </ul>
    </Drawer>
  );
}

export default function NavBar({ isAdmin }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isTabBarOpen, setIsTabBarOpen] = useState(false);

  const toggleIsNavOpen = () => setIsNavOpen(cur => !cur);

  const openTabBar = () => setIsTabBarOpen(true);
  const closeTabBar = () => setIsTabBarOpen(false);

  useEffect(() => {
    window.addEventListener('resize', () => window.innerWidth >= 960 && setIsNavOpen(false));
  }, []);

  return (
    <>
      <Navbar
        className="bg-white dark:bg-gray-900 border-none md:mt-2 mx-auto max-w-screen-xl p-2 
    rounded-none md:rounded-full lg:pl-6"
      >
        <div className="relative mx-auto flex items-center justify-between dark:text-gray-200">
          {isAdmin ? (
            <IconButton className="bg-gray-100 dark:bg-gray-700" onClick={openTabBar}>
              <Bars3Icon className="size-6 text-black dark:text-gray-200" />
            </IconButton>
          ) : (
            <Typography
              as="a"
              href={ROUTES.HOME}
              className="mr-4 ml-2 cursor-pointer py-1.5 font-medium text-black dark:text-gray-200"
            >
              {CONSTANTS.SITE_NAME}
            </Typography>
          )}

          {!isAdmin && (
            <>
              <div className="hidden md:block">
                <NavList />
              </div>
              <IconButton
                size="sm"
                variant="text"
                onClick={toggleIsNavOpen}
                className="ml-auto mr-2 text-gray-900 dark:text-gray-200 md:hidden"
              >
                <Bars2Icon className="h-6 w-6" />
              </IconButton>
            </>
          )}

          <div className="flex gap-2">
            <ToggleMode />
            <ProfileMenu />
          </div>
        </div>

        {!isAdmin && (
          <Collapse open={isNavOpen} className="overflow-scroll">
            <NavList />
          </Collapse>
        )}
      </Navbar>

      {/* TabBar for admin */}
      {isAdmin && <TabBar openTabBar={isTabBarOpen} closeTabBar={closeTabBar} />}
    </>
  );
}

NavBar.propTypes = {
  isAdmin: PropTypes.any,
};

TabBar.propTypes = {
  openTabBar: PropTypes.bool.isRequired,
  closeTabBar: PropTypes.func.isRequired,
};
