import React from 'react';

import useLanguage from '@contexts/language/useLanguage';
import { Avatar, Button, Menu, MenuHandler, MenuItem, MenuList } from '@material-tailwind/react';

export default function ChangeLang({ langList }) {
  const { language, changeLanguage } = useLanguage();

  const currentLang = langList.find((item) => item.value === language);

  return (
    <Menu>
      <MenuHandler>
        <Button
          variant="text"
          color="gray"
          className="d-flex h-8 w-8 items-center justify-center rounded-full p-0.5 md:ml-auto"
        >
          <Avatar
            variant="circular"
            src={currentLang?.flag}
            alt={currentLang?.label}
            className="h-7 w-7 rounded-full p-0.5"
          />
        </Button>
      </MenuHandler>
      <MenuList className="bg-white p-1 dark:border-gray-700 dark:bg-gray-900">
        {langList.map((item) => (
          <MenuItem
            key={item.value}
            onClick={() => changeLanguage(item.value)}
            className="flex items-center gap-2 rounded hover:bg-gray-300 
            focus:bg-gray-300 active:bg-gray-300 dark:hover:bg-gray-700 
            dark:focus:bg-gray-700 dark:active:bg-gray-700"
          >
            <img src={item.flag} alt={item.label} className="size-6 rounded-full object-cover" />
            <h6
              className={`text-[14px] text-gray-800 dark:text-gray-200 ${
                language === item.value ? 'font-bold underline' : ''
              }`}
            >
              {item.label}
            </h6>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
