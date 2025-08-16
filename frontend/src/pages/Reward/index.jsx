import React, { useEffect, useState } from 'react';

import { Button, ButtonGroup, Tab, Tabs, TabsHeader, Typography } from '@material-tailwind/react';
import { useTranslation } from 'react-i18next';

import { vouchersAPI } from '@api/public/vouchers';

import { useAxios } from '@hooks/useAxiosJWT';
import { useDocumentTitle } from '@hooks/useDocumentTitle';

import ArcMenu from '@components/ArcMenu';
import VoucherCard from '@components/VoucherCard';

export default function Reward() {
  const [activeTab, setActiveTab] = useState('available');
  const [voucherTemplates, setVoucherTemplate] = useState([]);
  const [voucherRedeem, setVoucherRedeem] = useState([]);
  const [isUsed, setIsUsed] = useState(0);

  const { t, i18n } = useTranslation(['navbar', 'form']);

  useDocumentTitle(t('navbar:reward'));

  const { axiosJWT } = useAxios(i18n.language);

  const getVoucherTemplate = async () => {
    const res = await vouchersAPI.getVoucherTemplate('redeemable');
    if (res?.status === 200) {
      setVoucherTemplate(res.data);
    }
  };

  const getVoucherRedeemByUser = async () => {
    const res = await vouchersAPI.getVoucherRedeemByUser(axiosJWT, isUsed);
    if (res?.status === 200) {
      setVoucherRedeem(res.data);
    }
  };

  useEffect(() => {
    getVoucherTemplate();
  }, []);

  useEffect(() => {
    getVoucherRedeemByUser(isUsed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUsed]);

  const handleRedeem = async (templateId) => {
    await vouchersAPI.redeem(axiosJWT, templateId);
    getVoucherRedeemByUser();
  };

  const renderVoucherCard = (voucher, isRedeemed = false) => (
    <VoucherCard
      key={voucher.id || voucher.code}
      voucher={voucher}
      isRedeemed={isRedeemed}
      isLoading={false}
      onRedeem={() => handleRedeem(voucher.id)}
    />
  );

  const vouchersToRender = activeTab === 'available' ? voucherTemplates : voucherRedeem;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <Typography
        variant="h1"
        className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-200"
      >
        {t('navbar:reward')}
      </Typography>

      <Tabs value={activeTab} className="mb-3">
        <TabsHeader
          className="bg-gray-200 dark:bg-gray-700"
          indicatorProps={{
            className: 'bg-gray-300 dark:bg-gray-800 dark:text-gray-200 shadow-none',
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

      {activeTab !== 'redeemed' && (
        <Typography className="text-red-600 text-sm italic font-semibold">
          {t('form:note_voucher_redeem')}
        </Typography>
      )}

      {activeTab === 'redeemed' && (
        <>
          <ButtonGroup size="sm" className="flex justify-end mb-2">
            <Button
              onClick={() => setIsUsed(0)}
              className="font-semibold bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
            >
              {t('form:not_used')}
            </Button>
            <Button
              onClick={() => setIsUsed(1)}
              className="font-semibold bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
            >
              {t('form:used')}
            </Button>
          </ButtonGroup>
          <Typography className="text-red-600 text-sm italic font-semibold">
            {isUsed == 1 ? t('form:note_voucher_del') : t('form:note_voucher_redeem')}
          </Typography>
        </>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
        {vouchersToRender.map((voucher) => renderVoucherCard(voucher, activeTab === 'redeemed'))}
      </div>
      <ArcMenu />
    </div>
  );
}
