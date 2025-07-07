import React from 'react';
import { IconButton } from '@material-tailwind/react';
import { HomeIcon, ArrowsPointingInIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

import ROUTES from '@constants/routes';
import helperFunctions from '@helpers';

export default function TopLeftControl() {
  const navigate = useNavigate();
  const isFullscreen = Boolean(document.fullscreenElement);

  return (
    <div className="absolute top-4 left-4 flex gap-2">
      <IconButton
        onClick={() => navigate(ROUTES.HOME)}
        className="z-20 bg-white/10 hover:bg-white/20"
        ripple={false}
      >
        <HomeIcon className="h-6 w-6 text-white" />
      </IconButton>
      <IconButton
        onClick={helperFunctions.toggleFullscreen}
        className="z-20 bg-white/10 hover:bg-white/20"
        ripple={false}
      >
        {isFullscreen ? (
          <ArrowsPointingInIcon className="h-6 w-6 text-white" />
        ) : (
          <ArrowsPointingOutIcon className="h-6 w-6 text-white" />
        )}
      </IconButton>
    </div>
  );
}
