import React, { useEffect, useState } from 'react';

import CONSTANTS from '@constants';
import { profileTabMenu } from '@constants/navigation';
import {
  Avatar,
  Card,
  CardBody,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Typography,
} from '@material-tailwind/react';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/vi';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useTranslation } from 'react-i18next';

import { useCurrentUser } from '@hooks/useCurrentUser';
import { useDocumentTitle } from '@hooks/useDocumentTitle';

import ArcMenu from '@components/ArcMenu';

import SiteTab from './Tabs/siteTab';
import TransactionTab from './Tabs/transactionTab';
import UpdateModal from './updateModal';

dayjs.extend(relativeTime);

export default function Profile() {
  const [createdAt, setCreatedAt] = useState();

  const { t, i18n } = useTranslation(['navbar', 'form']);
  const user = useCurrentUser();

  useDocumentTitle(t('profile'));

  useEffect(() => {
    dayjs.locale(i18n.language);
    const createdAt = user?.created_at ? dayjs(user.created_at).fromNow() : '--';

    setCreatedAt(createdAt);
  }, [i18n.language, user?.created_at]);

  return (
    <Card className="mt-5 overflow-hidden border-t shadow-md dark:border-gray-900 dark:bg-gray-900">
      <CardBody className="p-2">
        <div className="grid grid-cols-12 gap-4">
          <div className="md:col-span-4 col-span-12 pr-2">
            <Avatar
              src={user?.avatar || CONSTANTS.DEFAULT_AVATAR}
              alt={user?.full_name}
              variant="rounded"
              className="h-56 w-full object-contain"
            />
            <div className="border-t mt-2 p-2 dark:border-slate-500 gap-4">
              <div className="flex gap-2">
                <Typography variant="h6" className="dark:text-gray-200 font-medium">
                  {t('form:auth.full_name')}:
                </Typography>
                <Typography variant="h6" className="dark:text-gray-200 font-light">
                  {user?.full_name}
                </Typography>
              </div>
              <div className="flex gap-2">
                <Typography variant="h6" className="dark:text-gray-200 font-medium">
                  {t('form:auth.email')}:
                </Typography>
                <Typography variant="h6" className="dark:text-gray-200 font-light">
                  {user?.email}
                </Typography>
              </div>
              <div className="flex gap-2">
                <Typography variant="h6" className="dark:text-gray-200 font-medium">
                  {t('form:auth.joined')}:
                </Typography>
                <Typography variant="h6" className="dark:text-gray-200 font-light">
                  {createdAt}
                </Typography>
              </div>
            </div>
            <div className="md:border-b-0 border-b flex justify-end">
              <UpdateModal />
            </div>
          </div>
          <div className="md:col-span-8 col-span-12">
            <Tabs value="0">
              <TabsHeader
                className="bg-transparent dark:bg-gray-700 z-0"
                indicatorProps={{
                  className: 'bg-gray-900/10 dark:bg-gray-500 shadow-none !text-gray-900',
                }}
              >
                {profileTabMenu.map(({ label, value }) => (
                  <Tab
                    key={value}
                    value={value.toString()}
                    className="dark:text-gray-200 font-bold"
                  >
                    {t(label)}
                  </Tab>
                ))}
              </TabsHeader>
              <TabsBody>
                <TabPanel className="px-0" value="0">
                  <SiteTab />
                </TabPanel>
                <TabPanel className="px-0" value="1">
                  <TransactionTab />
                </TabPanel>
              </TabsBody>
            </Tabs>
          </div>
        </div>
      </CardBody>
      <ArcMenu />
    </Card>
  );
}
