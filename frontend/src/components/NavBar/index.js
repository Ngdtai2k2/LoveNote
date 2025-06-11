import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Navbar, Typography, MenuItem, IconButton, Collapse } from '@material-tailwind/react';
import { Bars2Icon } from '@heroicons/react/24/solid';

import { navbar } from '@constants/navbar';
import ToggleMode from '@components/ToggleMode';
import { ProfileMenu } from './profileMenu';

function NavList() {
  const { t } = useTranslation('navbar');

  return (
    <ul className="mt-2 mb-4 flex flex-col gap-2 md:mb-0 md:mt-0 md:flex-row md:items-center">
      {navbar.map((nav, index) => (
        <Typography
          key={index}
          as="a"
          href={nav.href}
          variant="small"
          color="gray"
          className="font-medium text-blue-gray-500"
        >
          <MenuItem
            className="flex items-center gap-2 md:rounded-full hover:bg-light-blue-900 
            active:bg-light-blue-900 focus:bg-light-blue-900 dark:hover:bg-gray-700 
            dark:active:bg-gray-700 dark:focus:bg-gray-700"
          >
            <span className="text-white dark:text-gray-300"> {t(nav.label)}</span>
          </MenuItem>
        </Typography>
      ))}
    </ul>
  );
}

export default function NavBar() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const toggleIsNavOpen = () => setIsNavOpen(cur => !cur);

  useEffect(() => {
    window.addEventListener('resize', () => window.innerWidth >= 960 && setIsNavOpen(false));
  }, []);

  return (
    <Navbar
      className="dark:bg-gray-900 bg-blue-900 border-none md:mt-2 mx-auto max-w-screen-xl p-2 
      rounded-none md:rounded-full lg:pl-6"
    >
      <div className="relative mx-auto flex items-center justify-between dark:text-gray-200">
        <Typography
          as="a"
          href="/"
          className="mr-4 ml-2 cursor-pointer py-1.5 font-medium dark:text-gray-200"
        >
          NoteLove
        </Typography>
        <div className="hidden md:block">
          <NavList />
        </div>
        <IconButton
          size="sm"
          color="white"
          variant="text"
          onClick={toggleIsNavOpen}
          className="ml-auto mr-2 md:hidden"
        >
          <Bars2Icon className="h-6 w-6" />
        </IconButton>
        <div className="flex gap-2">
          <ToggleMode />
          <ProfileMenu />
        </div>
      </div>
      <Collapse open={isNavOpen} className="overflow-scroll">
        <NavList />
      </Collapse>
    </Navbar>
  );
}
