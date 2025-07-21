import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { transactionAPI } from '@api/transaction';
import { useAxios } from '@hooks/useAxiosJWT';
import Pagination from '@components/Pagination';
import { Button } from '@material-tailwind/react';

export default function TransactionTab() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const { t, i18n } = useTranslation(['profile', 'template', 'tabbar']);
  const { axiosJWT } = useAxios(i18n.language);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await transactionAPI.getByUser(axiosJWT, page, 4);
      setTransactions(response);
    } catch {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [axiosJWT, page]);

  const handlePageChange = (newPage) => {
    if (newPage !== page) {
      setPage(newPage);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800"></div>
      </div>
    );
  }

  return (
    <div className="py-2 px-1">
      {transactions?.data?.length > 0 ? (
        <ul className="list-none">
          {transactions.data.map((transaction) => {
            return (
              <li key={transaction.id} className="mb-2">
                <div className="md:flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative w-24 h-24">
                      <img
                        src={transaction.productThumb}
                        alt={transaction.productName}
                        className="w-full h-full rounded object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-800 font-semibold dark:text-gray-200 text-sm">
                        #{transaction.id} - {transaction.productName}
                      </span>
                      <span className="text-gray-800 dark:text-gray-200 text-sm">
                        {t('template:status')}:{' '}
                        <span
                          className={`font-semibold ${
                            transaction.status === 'paid'
                              ? 'text-green-500'
                              : transaction.status === 'cancelled'
                                ? 'text-red-500'
                                : 'text-yellow-500'
                          }`}
                        >
                          {t(`template:${transaction.status}`)}
                        </span>
                      </span>
                      <span className="text-gray-800 dark:text-gray-200 text-sm">
                        {t('template:total_amount')}:{' '}
                        <span className="text-green-500 font-semibold">
                          {Number(transaction.amount || 0).toLocaleString('vi-VN')}đ
                        </span>
                      </span>
                    </div>
                  </div>
                  {/* <div className="flex justify-end items-center my-2 gap-2">
                    {transaction.status !== 'paid' && (
                      <Button
                        size="sm"
                        className="bg-green-500 dark:bg-green-600 normal-case py-1 px-2 text-xs rounded-md"
                      >
                        {t('profile:checkouts')}
                      </Button>
                    )}
                  </div> */}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="dark:text-gray-400 text-gray-600 text-center">{t('profile:no_data')}.</p>
      )}
      {transactions?.totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination
            currentPage={page}
            totalPages={transactions?.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
