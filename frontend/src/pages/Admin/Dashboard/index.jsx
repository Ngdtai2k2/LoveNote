import { useEffect, useState } from 'react';

import { BanknotesIcon, GlobeAltIcon, UsersIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';

import { statsAPI } from '@api/admin/stats';

import { useAxios } from '@hooks/useAxiosJWT';
import { useCurrentUser } from '@hooks/useCurrentUser';
import { useDocumentTitle } from '@hooks/useDocumentTitle';

import TransactionsBarChart from '../Chart/TransactionsBarChart';
import UserSitesPieChart from '../Chart/UserSitesPieChart';
import StatCard from '../StatCard';

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const { t, i18n } = useTranslation('admin');
  const user = useCurrentUser();
  const { axiosJWT } = useAxios(i18n.language);

  useDocumentTitle(t('dashboard.title') || 'Dashboard');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await statsAPI.summary(axiosJWT);
        setStats(data);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statsConfig = [
    { key: 'users', icon: <UsersIcon className="h-10 w-10" /> },
    { key: 'revenue', icon: <BanknotesIcon className="h-10 w-10" /> },
    { key: 'sites', icon: <GlobeAltIcon className="h-10 w-10" /> },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">{t('welcome', { name: user?.full_name })}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {statsConfig.map(({ key, icon }) => (
          <StatCard
            key={key}
            title={t(`dashboard.stats.${key}`)}
            value={Number(stats?.[key]?.total || 0).toLocaleString('vi-VN')}
            icon={icon}
            change={stats?.[key]?.change || '+0'}
            loading={loading}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
          <TransactionsBarChart />
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
          <UserSitesPieChart />
        </div>
      </div>
    </div>
  );
}
