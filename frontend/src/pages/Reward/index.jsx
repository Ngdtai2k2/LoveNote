import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Typography, Tabs, TabsHeader, Tab } from '@material-tailwind/react';

import ArcMenu from '@components/ArcMenu';

import { useDocumentTitle } from '@hooks/useDocumentTitle';
import { useAxios } from '@hooks/useAxiosJWT';
import { vouchersAPI } from '@api/vouchers';
import VoucherCard from '@components/VoucherCard';

const redeemedVouchers = [
  {
    id: 4,
    name: 'Shopee Giảm 30K',
    description: 'Dành cho đơn hàng từ 200K.',
    tokenCost: 400,
    code: 'SHOPEE30K',
  },
  {
    id: 5,
    name: 'Tiki Voucher 20%',
    description: 'Giảm tối đa 80K cho đơn hàng Tiki.',
    tokenCost: 600,
    code: 'TIKI20',
  },
];

export default function Reward() {
  const [activeTab, setActiveTab] = useState('available');
  const [voucherTemplates, setVoucherTemplate] = useState([]);

  const { t, i18n } = useTranslation(['navbar']);

  useDocumentTitle(t('navbar:reward'));

  const { axiosJWT } = useAxios(i18n.language);

  const getVoucherTemplate = async () => {
    const res = await vouchersAPI.getVoucherTemplate('redeemable');
    if (res?.status === 200) {
      setVoucherTemplate(res.data);
    }
  };

  useEffect(() => {
    getVoucherTemplate();
  }, []);

  const handleRedeem = async (templateId) => {
    await vouchersAPI.redeem(axiosJWT, templateId);
  };

  const renderVoucherCard = (voucher, isRedeemed = false) => (
    <VoucherCard
      key={voucher.id}
      voucher={voucher}
      isRedeemed={isRedeemed}
      isLoading={false}
      onRedeem={() => handleRedeem(voucher.id)}
    />
  );

  const vouchersToRender = activeTab === 'available' ? voucherTemplates : redeemedVouchers;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <Typography
        variant="h1"
        className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-200"
      >
        {t('navbar:reward')}
      </Typography>

      <Tabs value={activeTab} className="mb-6">
        <TabsHeader
          className="bg-gray-200 dark:bg-gray-800"
          indicatorProps={{
            className: 'bg-gray-300 dark:bg-gray-700 dark:text-gray-200 shadow-none',
          }}
        >
          <Tab value="available" onClick={() => setActiveTab('available')}>
            {t('navbar:redeem_voucher')}
          </Tab>
          <Tab value="redeemed" onClick={() => setActiveTab('redeemed')}>
            {t('navbar:voucher_redeemed')}
          </Tab>
        </TabsHeader>
      </Tabs>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {vouchersToRender.map((voucher) => renderVoucherCard(voucher, activeTab === 'redeemed'))}
      </div>
      <ArcMenu />
    </div>
  );
}
