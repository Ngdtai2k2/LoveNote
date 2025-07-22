import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useField, useFormikContext } from 'formik';
import { vouchersAPI } from '@api/vouchers';
import { useAxios } from '@hooks/useAxiosJWT';

export default function FormVoucher({ name = 'voucher', label = 'Voucher', price = 0 }) {
  const [field] = useField(name);
  const { setFieldValue } = useFormikContext();
  const [voucher, setVoucher] = useState(field.value || '');
  const [messageError, setMessageError] = useState(null);
  const [voucherInfo, setVoucherInfo] = useState(null);
  const [finalPrice, setFinalPrice] = useState(price);
  const [discountText, setDiscountText] = useState('');

  const debounceTimeout = useRef(null);

  const { t, i18n } = useTranslation('template');
  const { axiosJWT } = useAxios(i18n.language);

  useEffect(() => {
    if (!voucher) {
      setMessageError(null);
      setVoucherInfo(null);
      setFinalPrice(price);
      return;
    }

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      const res = await vouchersAPI.checkVoucher(axiosJWT, voucher);
      if (res.code !== 200 || !res.data) {
        setMessageError(res?.message || 'Invalid voucher');
        setVoucherInfo(null);
        setFinalPrice(price);
        setDiscountText('');
      } else {
        const info = res.data;
        const discountType = info.discount_type;
        const discountValue = Number(info.discount_value || 0);
        const originalPrice = Number(price || 0);

        let final = originalPrice;
        let discountText = '';
        let discountAmount = 0;

        if (discountType === 'day') {
          final = 0;
          discountText = `${t('discount')} 100%`;
          discountAmount = originalPrice;
        } else if (discountType === 'percent') {
          discountAmount = (originalPrice * discountValue) / 100;
          final = Math.max(0, originalPrice - discountAmount);
          discountText = `${t('discount')} ${discountValue}%`;
        }

        if (final < 0 || isNaN(final)) {
          setMessageError(t('voucher_invalid'));
          setVoucherInfo(null);
          setFinalPrice(price);
          setDiscountText('');
          return;
        }

        setMessageError(null);
        setVoucherInfo(info);
        setFinalPrice(final);
        setDiscountText(
          `${discountText} - ${t('save')} ${discountAmount.toLocaleString('vi-VN')}đ`
        );
      }
    }, 500);

    return () => clearTimeout(debounceTimeout.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [axiosJWT, voucher, price]);

  const handleChange = (e) => {
    const newVoucher = e.target.value;
    setVoucher(newVoucher);
    setFieldValue(name, newVoucher);
  };

  return (
    <div className="flex flex-col gap-1 mt-2">
      <label htmlFor={name} className="font-medium text-sm">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        value={voucher}
        onChange={handleChange}
        placeholder={label}
        className={`border rounded px-2 py-1 text-sm outline-none ${
          messageError ? 'border-red-500 text-red-500' : 'text-gray-900'
        }`}
      />
      {messageError && <span className="text-red-500 text-sm">{messageError}</span>}

      <div className="text-sm mt-1">
        {voucherInfo && !messageError ? (
          <>
            <div className="text-green-400">{discountText}</div>
            <div>
              <span className="line-through text-red-400 mr-2">
                {Number(price).toLocaleString('vi-VN')}đ
              </span>
              <span className="font-semibold text-green-400">
                {t('total_amount')}: {finalPrice.toLocaleString('vi-VN')}đ
              </span>
            </div>
          </>
        ) : (
          <div className="font-semibold text-green-400">
            {t('total_amount')}: {Number(price).toLocaleString('vi-VN')}đ
          </div>
        )}
      </div>
    </div>
  );
}
