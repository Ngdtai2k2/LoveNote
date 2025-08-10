import React from 'react';

import { Dialog, Typography } from '@material-tailwind/react';

export default function ModalEdit({ data, open, onClose }) {
  return (
    <Dialog open={open} handler={onClose} size="md">
      <div className="p-4">
        <Typography variant="h5" className="mb-4">
          Modal title
        </Typography>
        <Typography>{data?.name}</Typography>
      </div>
    </Dialog>
  );
}
