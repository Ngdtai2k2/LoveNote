import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Tabs, TabsHeader, Tab } from '@material-tailwind/react';
import { useDocumentTitle } from '@hooks/useDocumentTitle';
import VoucherCard from '@components/VoucherCard';

// fake data
const availableVouchers = [
  {
    id: 1,
    name: 'Giảm 50K đơn từ 300K',
    description: 'Áp dụng cho toàn bộ sản phẩm, không giới hạn ngành hàng.',
    tokenCost: 500,
    code: 'VOUCHER50K',
  },
  {
    id: 2,
    name: 'Freeship toàn quốc',
    description: 'Dành cho mọi đơn hàng từ 150K.',
    tokenCost: 300,
    code: 'FREESHIP150',
  },
  {
    id: 3,
    name: 'Voucher 100K Lazada',
    description: 'Áp dụng khi mua qua ứng dụng Lazada.',
    tokenCost: 1000,
    code: 'LAZADA100K',
  },
];

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
  const { t } = useTranslation(['navbar']);

  useDocumentTitle(t('navbar:reward'));

  const [activeTab, setActiveTab] = useState('available');

  const renderVoucherCard = (voucher, isRedeemed = false) => (
    <VoucherCard
      key={voucher.id}
      voucher={voucher}
      isRedeemed={isRedeemed}
      isLoading={false}
      onRedeem={() => console.log('Redeem voucher:', voucher)}
    />
  );

  const vouchersToRender = activeTab === 'available' ? availableVouchers : redeemedVouchers;

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vouchersToRender.map((voucher) => renderVoucherCard(voucher, activeTab === 'redeemed'))}
      </div>
    </div>
  );
}
