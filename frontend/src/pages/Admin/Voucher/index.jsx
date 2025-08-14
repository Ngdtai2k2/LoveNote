import React, { useEffect, useState } from 'react';

import {
  ClockIcon,
  CurrencyDollarIcon,
  EyeIcon,
  PencilSquareIcon,
  ReceiptPercentIcon,
  TagIcon,
  TicketIcon,
} from '@heroicons/react/24/outline';
import { Button, Card, CardBody, Typography } from '@material-tailwind/react';
import { useTranslation } from 'react-i18next';

import { vouchersAPI } from '@api/admin/vouchers';

import { useAxios } from '@hooks/useAxiosJWT';
import { useDocumentTitle } from '@hooks/useDocumentTitle';

import AssignVoucherModal from './assignVoucherModal';
import VoucherTemplateModal from './voucherTemplateModal';

export default function VoucherManager() {
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openAssignModal, setAssignModal] = useState(false);
  const [templateChoose, setTemplateChoose] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [voucherType, setVoucherType] = useState('redeemable');
  const [voucherTemplates, setVoucherTemplate] = useState({
    data: [],
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
  });

  const { t, i18n } = useTranslation('admin');
  const { axiosJWT } = useAxios(i18n.language);

  useDocumentTitle(t('voucher.title'));

  const getVoucherTemplate = async () => {
    try {
      setLoading(true);
      const res = await vouchersAPI.getVoucherTemplate(axiosJWT, {
        page,
        limit: 6,
        type: voucherType,
      });
      setVoucherTemplate(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVoucherTemplate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, voucherType]);

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (voucherTemplates?.hasNextPage) setPage(page + 1);
  };

  const handleEdit = (id) => {
    console.log('Edit voucher', id);
  };

  const handleView = (id) => {
    console.log('View voucher', id);
  };

  const voucherTypes = ['redeemable', 'global', 'personal'];

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <Typography variant="h5" className="text-blue-gray-900 dark:text-gray-100 font-bold">
          {t('voucher.title')}
        </Typography>
        <div className="flex gap-1">
          <Button size="sm" color="blue" onClick={() => setOpenModalCreate(true)}>
            {t('voucher.create_template')}
          </Button>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {voucherTypes.map((type) => (
          <button
            key={type}
            onClick={() => {
              setVoucherType(type);
              setPage(1);
            }}
            className={`py-1 px-2 rounded-lg border ${
              voucherType === type
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600'
            } transition-colors`}
          >
            {t(`voucher.${type}`)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800 dark:border-gray-600 dark:border-t-gray-200 mx-auto" />
      ) : voucherTemplates?.data?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {voucherTemplates.data.map((voucher) => (
            <Card
              key={voucher.id}
              className="overflow-hidden cursor-pointer rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:-translate-y-1"
            >
              <CardBody className="space-y-2">
                <Typography variant="h6" className="font-bold text-gray-900 dark:text-white">
                  {voucher.name?.[i18n.language] || '--'}
                </Typography>
                <Typography className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {voucher.description?.[i18n.language] || '--'}
                </Typography>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <TagIcon className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {t('voucher.discount_type')}:
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {t(`voucher.${voucher.discount_type}`) || '--'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TicketIcon className="w-4 h-4 text-purple-500" />
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {t('voucher.discount_value')}:
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {voucher.discount_value || '--'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CurrencyDollarIcon className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {t('voucher.redeem_token_cost')}:
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {voucher.redeem_token_cost || '--'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-orange-500" />
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {t('voucher.site_lifespan_days')}:
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {voucher.site_lifespan_days || '--'}
                    </span>
                  </div>
                </div>
              </CardBody>

              {/* Action Buttons */}
              <div className="flex justify-end gap-1 p-2 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <button
                  onClick={() => handleView(voucher.id)}
                  className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                  title="View"
                >
                  <EyeIcon className="w-5 h-5 text-blue-500" />
                </button>
                <button
                  onClick={() => handleEdit(voucher.id)}
                  className="p-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-900 transition"
                  title="Edit"
                >
                  <PencilSquareIcon className="w-5 h-5 text-green-500" />
                </button>
                {voucher.type !== 'redeemable' && (
                  <button
                    onClick={() => {
                      setAssignModal(true);
                      setTemplateChoose(voucher);
                    }}
                    className="p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900 transition"
                    title="Create voucher"
                  >
                    <ReceiptPercentIcon className="w-5 h-5 text-purple-500" />
                  </button>
                )}
              </div>
            </Card>
          ))}
          <AssignVoucherModal
            open={openAssignModal}
            onClose={() => setAssignModal(false)}
            data={templateChoose}
          />
          <VoucherTemplateModal open={openModalCreate} onClose={() => setOpenModalCreate(false)} />
        </div>
      ) : (
        <Typography className="text-center text-gray-500 dark:text-gray-400">
          {t('table.no_data')}
        </Typography>
      )}

      <div className="flex justify-center gap-2">
        <button
          onClick={handlePrevious}
          disabled={page === 1}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          {t('table.previous')}
        </button>
        <button
          onClick={handleNext}
          disabled={!voucherTemplates.hasNextPage}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          {t('table.next')}
        </button>
      </div>
    </div>
  );
}
