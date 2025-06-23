import React, { createElement, useEffect, useState } from "react";
import { useTranslation } from "../../../node_modules/react-i18next";
import PropTypes from "prop-types";

import {
  Navbar,
  Typography,
  MenuItem,
  IconButton,
  Collapse,
  Drawer,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { Bars2Icon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

import { navbar, tabbar } from "@constants/navigation";
import ROUTES from "@constants/routes";
import { LANG_LIST } from "@constants/lang";
import CONSTANTS from "@constants";

import ToggleMode from "@components/ToggleMode";
import ChangeLang from "@components/ChangeLang";
import { ProfileMenu } from "./profileMenu";

function NavList() {
  const { t } = useTranslation("navbar");

  return (
    <ul className="mb-4 mt-2 flex flex-col gap-2 md:mb-0 md:mt-0 md:flex-row md:items-center">
      {navbar.map((nav, index) => (
        <li key={index}>
          <Link to={nav.href}>
            <MenuItem
              className="flex items-center gap-2 hover:bg-gray-300 focus:bg-gray-300 
          active:bg-gray-300 dark:hover:bg-gray-800 dark:focus:bg-gray-800 
          dark:active:bg-gray-800 md:rounded-full"
            >
              <span className="text-black dark:text-gray-200">
                {t(nav.label)}
              </span>
            </MenuItem>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function TabBar({ openTabBar, closeTabBar }) {
  const { t } = useTranslation("tabbar");

  return (
    <Drawer
      open={openTabBar}
      onClose={closeTabBar}
      className="p-4 dark:bg-gray-700"
    >
      <div className="mb-6 flex items-center justify-between">
        <Typography variant="h5" className="text-black dark:text-gray-200">
          {CONSTANTS.SITE_NAME}
        </Typography>
        <IconButton variant="text" color="black" onClick={closeTabBar}>
          <XMarkIcon className="size-6 text-black dark:text-gray-200" />
        </IconButton>
      </div>
      <ul className="mb-4 mt-2 flex flex-col gap-2">
        {tabbar.map((tab, index) => (
          <Link key={index} to={tab.href}>
            <MenuItem
              className="flex items-center gap-2 hover:bg-gray-300 focus:bg-gray-300 
            active:bg-gray-300 dark:hover:bg-gray-800 dark:focus:bg-gray-800 
            dark:active:bg-gray-800 md:rounded-full"
            >
              {createElement(tab.icon, {
                className: "h-6 w-6 text-gray-800 dark:text-gray-200",
                strokeWidth: 2,
              })}
              <span className="text-black dark:text-gray-200">
                {t(tab.label)}
              </span>
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

  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

  const openTabBar = () => setIsTabBarOpen(true);
  const closeTabBar = () => setIsTabBarOpen(false);

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setIsNavOpen(false),
    );
  }, []);

  return (
    <>
      <Navbar
        className="mx-auto max-w-screen-xl rounded-none border-none bg-white p-2 dark:bg-gray-900 
        md:mt-2 md:rounded-full lg:pl-6"
      >
        <div className="relative mx-auto flex items-center justify-between dark:text-gray-200">
          {/* Logo */}
          {!isAdmin && (
            <Typography
              className="ml-2 mr-4 hidden cursor-pointer border-none py-1.5 font-medium text-black 
              dark:text-gray-200 md:block"
            >
              <Link to={ROUTES.HOME}>{CONSTANTS.SITE_NAME}</Link>
            </Typography>
          )}

          {/* User Nav */}
          {!isAdmin && (
            <>
              <div className="hidden md:block">
                <NavList />
              </div>

              {/* Mobile menu toggle */}
              <IconButton
                size="sm"
                variant="text"
                onClick={toggleIsNavOpen}
                className="mr-2 text-gray-900 dark:text-gray-200 md:hidden"
              >
                <Bars2Icon className="h-6 w-6" />
              </IconButton>
            </>
          )}

          {/* Admin or Mobile Logo */}
          {isAdmin ? (
            <IconButton
              className="bg-gray-100 dark:bg-gray-700"
              onClick={openTabBar}
            >
              <Bars3Icon className="size-6 text-black dark:text-gray-200" />
            </IconButton>
          ) : (
            <Typography
              as="a"
              href={ROUTES.HOME}
              className="ml-2 mr-4 block cursor-pointer border-none py-1.5 font-medium text-black dark:text-gray-200 md:hidden"
            >
              {CONSTANTS.SITE_NAME}
            </Typography>
          )}

          {/* Right section */}
          <div className="flex items-center gap-2">
            <ToggleMode />
            <ChangeLang langList={LANG_LIST} />
            <ProfileMenu />
          </div>
        </div>

        {/* Collapse NavList (Mobile) */}
        {!isAdmin && (
          <Collapse open={isNavOpen} className="overflow-scroll">
            <NavList />
          </Collapse>
        )}
      </Navbar>

      {/* TabBar for admin */}
      {isAdmin && (
        <TabBar openTabBar={isTabBarOpen} closeTabBar={closeTabBar} />
      )}
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
