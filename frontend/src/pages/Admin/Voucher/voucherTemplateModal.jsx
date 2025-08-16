import React, { useEffect, useState } from 'react';

import helperFunctions from '@helpers';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button, Dialog, IconButton, Typography } from '@material-tailwind/react';
import { Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { vouchersAPI } from '@api/admin/vouchers';
import { productAPI } from '@api/public/product';

import { useAxios } from '@hooks/useAxiosJWT';

import FormField from '@components/FormField';
import FormSelect from '@components/FormSelect';
import FormTextArea from '@components/FormTextArea';
import MultiSelectTemplates from '@components/MultiSelectTemplates';

export default function VoucherTemplateModal({ open, onClose }) {
  const [productOptions, setProductOptions] = useState([]);
  const { t, i18n } = useTranslation('admin');
  const { axiosJWT } = useAxios(i18n.language);

  const voucherTemplateSchema = Yup.object().shape({
    nameStr: Yup.string().required(t('voucher.validate.name_required')),
    discountType: Yup.string().required(t('voucher.validate.discount_type_required')),
    discountValue: Yup.number()
      .positive(t('voucher.validate.must_be_positive'))
      .required(t('voucher.validate.discount_value_required')),
    redeemTokenCost: Yup.number().positive(t('voucher.validate.must_be_positive')),
    siteLifespanDays: Yup.number().positive(t('voucher.validate.must_be_positive')),
    maxUsagePerUser: Yup.number().positive(t('voucher.validate.must_be_positive')),
    totalRedeemLimit: Yup.number().positive(t('voucher.validate.must_be_positive')),
  });

  const initialValues = {
    nameStr: '',
    descriptionStr: '',
    discountType: 'percent',
    discountValue: '',
    templates: '*',
    expiresAt: '',
    redeemTokenCost: '',
    siteLifespanDays: '',
    maxUsagePerUser: '',
    totalRedeemLimit: '',
    type: 'redeemable',
  };

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    const payload = {
      ...values,
      name: helperFunctions.stringToLangObj(values.nameStr),
      description: helperFunctions.stringToLangObj(values.descriptionStr),
      templates: values.templates === '*' ? ['*'] : values.templates,
    };

    delete payload.nameStr;
    delete payload.descriptionStr;

    const res = await vouchersAPI.createTemplate(axiosJWT, payload);
    if (res.status === 201) {
      resetForm();
    }
    setSubmitting(false);
  };

  useEffect(() => {
    if (!open) return;
    const fetchProducts = async () => {
      const res = await productAPI.getAll();
      const options = [
        { value: '*', label: t('voucher.all_templates') },
        ...res.map((p) => ({ value: p.slug, label: p.name })),
      ];
      setProductOptions(options);
    };
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="md"
      className="flex flex-col max-h-[90vh] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <Typography variant="h5">{t('voucher.create_template')}</Typography>
        <IconButton onClick={onClose} size="sm" variant="text" className="rounded-full">
          <XMarkIcon className="h-4 w-4 text-red-500" />
        </IconButton>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={voucherTemplateSchema}
        onSubmit={onSubmit}
      >
        {({ values, errors, touched, handleChange, setFieldValue }) => (
          <Form className="flex-1 overflow-y-auto p-4 space-y-4">
            <FormTextArea
              name="nameStr"
              label={t('voucher.name')}
              placeholder="English;Tiếng Việt"
              errors={errors}
              touched={touched}
              required
              value={values.nameStr}
              onChange={handleChange}
              rows={2}
              className="w-full p-2 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />

            <FormTextArea
              name="descriptionStr"
              label={t('voucher.description')}
              placeholder="English;Tiếng Việt"
              errors={errors}
              touched={touched}
              value={values.descriptionStr}
              onChange={handleChange}
              rows={2}
              className="w-full p-2 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />

            <div className="flex gap-1">
              <FormSelect
                name="discountType"
                label={t('voucher.discount_type')}
                value={values.discountType}
                onChange={handleChange}
                errors={errors}
                touched={touched}
                required
                options={[
                  { value: 'percent', label: t('voucher.percent') },
                  { value: 'amount', label: t('voucher.amount') },
                  { value: 'day', label: t('voucher.day') },
                ]}
              />

              <FormField
                name="discountValue"
                label={t('voucher.discount_value')}
                type="number"
                placeholder={t('voucher.discount_value')}
                errors={errors}
                touched={touched}
                required
                value={values.discountValue}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />
            </div>

            <MultiSelectTemplates
              label={t('voucher.templates')}
              placeholder={t('voucher.templates')}
              value={values.templates}
              options={productOptions}
              onChange={(val) => setFieldValue('templates', val)}
              error={errors.templates}
              touched={touched.templates}
            />

            <FormField
              name="expiresAt"
              label={t('voucher.expires_at')}
              type="date"
              errors={errors}
              touched={touched}
              value={values.expiresAt}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />

            <div className="flex gap-1">
              <FormField
                name="redeemTokenCost"
                label={t('voucher.redeem_token_cost')}
                type="number"
                errors={errors}
                touched={touched}
                value={values.redeemTokenCost}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />

              <FormField
                name="siteLifespanDays"
                label={t('voucher.site_lifespan_days')}
                type="number"
                errors={errors}
                touched={touched}
                value={values.siteLifespanDays}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />

              <FormField
                name="maxUsagePerUser"
                label={t('voucher.max_usage_per_user')}
                type="number"
                errors={errors}
                touched={touched}
                value={values.maxUsagePerUser}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />
            </div>

            <div className="flex gap-1">
              <FormField
                name="totalRedeemLimit"
                label={t('voucher.total_redeem_limit')}
                type="number"
                errors={errors}
                touched={touched}
                value={values.totalRedeemLimit}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />

              <FormSelect
                name="type"
                label={t('voucher.type')}
                value={values.type}
                onChange={handleChange}
                errors={errors}
                touched={touched}
                required
                options={[
                  { value: 'redeemable', label: 'Redeemable' },
                  { value: 'global', label: 'Global' },
                  { value: 'personal', label: 'Personal' },
                ]}
              />
            </div>

            {/* Footer buttons */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
              <Button
                color="green"
                type="submit"
                className="dark:border-green-500 dark:text-green-400"
              >
                {t('table.save')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
