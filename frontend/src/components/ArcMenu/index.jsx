import React, { useEffect, useRef, useState } from 'react';

import ROUTES from '@constants/routes';
import {
  BanknotesIcon,
  BellIcon,
  ChatBubbleBottomCenterTextIcon,
  InformationCircleIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { Tooltip } from '@material-tailwind/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import DonateModal from '@components/DonateModal';

export default function ArcMenu() {
  const [open, setOpen] = useState(false);
  const [openDonate, setOpenDonate] = useState(false);
  const menuRef = useRef(null);

  const { t } = useTranslation('navbar');
  const navigate = useNavigate();

  const buttons = [
    {
      icon: <InformationCircleIcon className="w-5 h-5" />,
      color: 'bg-blue-400',
      label: 'help',
      onClick: () => {},
    },
    {
      icon: <BellIcon className="w-5 h-5" />,
      color: 'bg-yellow-400',
      label: 'notifications',
      onClick: () => {},
    },
    {
      icon: <BanknotesIcon className="w-5 h-5" />,
      color: 'bg-green-400',
      label: 'donate',
      onClick: () => handleOpenDonate(),
    },
    {
      icon: <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />,
      color: 'bg-blue-600',
      label: 'contact',
      onClick: () => navigate(ROUTES.CONTACTS),
    },
  ];

  const radius = 100;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenDonate = () => setOpenDonate(!openDonate);

  return (
    <div className="fixed bottom-4 right-4 z-50" ref={menuRef}>
      <div className="relative w-[30px] h-[30px]">
        {buttons.map((btn, i) => {
          const angle = (Math.PI / 2 / (buttons.length - 1)) * i;
          const x = open ? -radius * Math.cos(angle) : 0;
          const y = open ? -radius * Math.sin(angle) : 0;

          return (
            <div
              key={i}
              className="absolute"
              style={{
                transform: `translate(${x}px, ${y}px)`,
                opacity: open ? 1 : 0,
                pointerEvents: open ? 'auto' : 'none',
                transition: 'all 0.3s ease',
              }}
            >
              <div className="group relative flex items-center justify-center">
                <Tooltip content={t(btn.label)}>
                  <button
                    onClick={btn.onClick}
                    className={`w-10 h-10 text-white rounded-full shadow-lg flex items-center justify-center ${btn.color}`}
                  >
                    {btn.icon}
                  </button>
                </Tooltip>
              </div>
            </div>
          );
        })}

        <button
          onClick={() => setOpen(!open)}
          className="absolute bottom-0 right-0 w-[45px] h-[45px] bg-gray-800 dark:bg-gray-600 text-gray-200 rounded-full shadow-lg flex items-center justify-center transition-transform duration-300 hover:rotate-90"
        >
          {open ? <XMarkIcon className="w-6 h-6" /> : <PlusIcon className="w-6 h-6" />}
        </button>
        <DonateModal open={openDonate} handleOpen={handleOpenDonate} />
      </div>
    </div>
  );
}
