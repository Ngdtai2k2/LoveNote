import React, { useEffect, useState } from 'react';

import helperFunctions from '@helpers';
import {
  ChatBubbleBottomCenterTextIcon,
  GiftIcon,
  ShoppingCartIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { Dialog, IconButton, Typography } from '@material-tailwind/react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';

import { notificationAPI } from '@api/public/notification';

import { useAxios } from '@hooks/useAxiosJWT';
import { useCurrentUser } from '@hooks/useCurrentUser';
import { useUpdateUnreadNotifications } from '@hooks/useUpdateUnreadNotifications';

export default function Notifications({ open, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { t, i18n } = useTranslation('navbar');
  const { axiosJWT } = useAxios(i18n.language);
  const user = useCurrentUser();
  const { decrementUnread, resetUnread } = useUpdateUnreadNotifications();

  const getNotifications = async () => {
    const res = await notificationAPI.getByUser(axiosJWT, { page, limit: 10 });

    if (!res.hasNextPage) {
      setHasMore(false);
    }

    setNotifications((prev) => [...prev, ...res.data]);
    setPage((prev) => prev + 1);
  };

  const markRead = async (id) => {
    const res = await notificationAPI.markRead(axiosJWT, id);

    if (res.status === 200) {
      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, is_read: true } : item))
      );
      decrementUnread();
    }
  };

  const markReadAll = async () => {
    const res = await notificationAPI.markReadAll(axiosJWT);
    if (res.status === 200) {
      setNotifications((prev) => prev.map((item) => ({ ...item, is_read: true })));
      resetUnread();
    }
  };

  useEffect(() => {
    setNotifications([]);
    setPage(1);
    setHasMore(true);

    if (open) {
      getNotifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, i18n.language]);

  return (
    <Dialog open={open} handler={onClose} size="xs" className="dark:bg-gray-800 dark:text-gray-200">
      <div className="p-4">
        <div className="flex justify-between items-center">
          <Typography variant="h5" className="flex items-center gap-2 font-semibold">
            {t('notifications')}
            {user?.unread_notifications > 0 && (
              <span className="font-semibold">({user?.unread_notifications})</span>
            )}
          </Typography>
          <IconButton onClick={onClose} size="sm" variant="text" className="rounded-full">
            <XMarkIcon className="h-4 w-4 text-red-500" />
          </IconButton>
        </div>
        <Typography
          onClick={() => markReadAll()}
          className="flex items-center justify-end font-semibold text-sm mt-2 mb-3 hover:underline cursor-pointer"
        >
          {t('mark_as_read')}
        </Typography>

        <div id="scrollableDiv" style={{ height: '400px', overflow: 'auto' }}>
          <InfiniteScroll
            dataLength={notifications.length}
            next={getNotifications}
            hasMore={hasMore}
            loader={<p className="text-center">{t('loading_more_notifications')}</p>}
            endMessage={<p className="text-center text-gray-500">{t('no_more_data')}</p>}
            scrollableTarget="scrollableDiv"
          >
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`p-2 mb-1 rounded cursor-pointer mr-1 hover:dark:bg-gray-600 hover:bg-gray-200 ${
                  !item.is_read ? 'dark:bg-gray-700 bg-gray-100' : ''
                }`}
                onClick={() => {
                  if (!item.is_read) markRead(item.id);
                }}
              >
                <div className="flex gap-2 items-center">
                  {item.type === 'system' ? (
                    <ChatBubbleBottomCenterTextIcon className="h-8 w-8 text-blue-400" />
                  ) : item.type === 'order' ? (
                    <ShoppingCartIcon className="h-8 w-8 text-green-500" />
                  ) : (
                    <GiftIcon className="h-8 w-8 text-yellow-500" />
                  )}
                  <div className="gap-2">
                    <Typography variant="h6" className="font-semibold">
                      {item.title}
                    </Typography>
                    <Typography variant="body2" className="text-sm font-light">
                      {item.message}
                    </Typography>
                    <Typography
                      variant="body2"
                      className={`text-xs font-semibold mt-1 ${
                        item.is_read
                          ? 'text-gray-500 dark:text-gray-400'
                          : 'text-blue-700 dark:text-blue-400'
                      }`}
                    >
                      {helperFunctions.formatDateTime(item.created_at)}
                    </Typography>
                  </div>
                </div>
              </div>
            ))}
          </InfiniteScroll>
        </div>
      </div>
    </Dialog>
  );
}
