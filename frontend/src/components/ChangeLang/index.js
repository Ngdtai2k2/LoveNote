import React from 'react';
import PropTypes from 'prop-types';
import { useLanguage } from '@providers/language';
import { Menu, MenuHandler, MenuList, MenuItem, Button, Avatar } from '@material-tailwind/react';

export default function ChangeLang({ langList }) {
  const { language, changeLanguage } = useLanguage();

  const currentLang = langList.find(item => item.value === language);

  return (
    <Menu>
      <MenuHandler>
        <Button
          variant="text"
          color="gray"
          className="rounded-full h-8 w-8 p-0.5 md:ml-auto d-flex items-center justify-center"
        >
          <Avatar
            variant="circular"
            src={currentLang?.flag}
            alt={currentLang?.label}
            className="rounded-full h-7 w-7 p-0.5"
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-1 dark:bg-gray-900 bg-white dark:border-gray-700">
        {langList.map(item => (
          <MenuItem
            key={item.value}
            onClick={() => changeLanguage(item.value)}
            className="flex items-center gap-2 rounded hover:bg-gray-300 
            active:bg-gray-300 focus:bg-gray-300 dark:hover:bg-gray-700 
            dark:active:bg-gray-700 dark:focus:bg-gray-700"
          >
            <img src={item.flag} alt={item.label} className="object-cover rounded-full size-6" />
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

ChangeLang.propTypes = {
  langList: PropTypes.array.isRequired,
};
