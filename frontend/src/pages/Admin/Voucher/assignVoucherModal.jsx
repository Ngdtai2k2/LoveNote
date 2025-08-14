import React, { useState } from 'react';

import { TagIcon, TicketIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button, Dialog, IconButton, Typography } from '@material-tailwind/react';
import { ErrorMessage, Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { vouchersAPI } from '@api/admin/vouchers';

import { useAxios } from '@hooks/useAxiosJWT';

import TagInput from '@components/TagInput';

export default function AssignVoucherModal({ open, onClose, data }) {
  const { t, i18n } = useTranslation('admin');
  const { axiosJWT } = useAxios(i18n.language);
  const [submitting, setSubmitting] = useState(false);

  const initialValues = {
    voucherTemplateId: data?.id || '',
    userIds: [],
    emails: [],
  };

  const validationSchema = Yup.object().shape({
    voucherTemplateId: Yup.number().required(t('voucher.validate.template_required')),

    userIds: Yup.array().test(
      'one-of-two',
      t('voucher.validate.user_or_email_required'),
      function (value) {
        const { emails } = this.parent;
        if (value.length > 0 && emails.length > 0) return false;
        if (value.length === 0 && emails.length === 0) return false;
        return true;
      }
    ),

    emails: Yup.array().test(
      'one-of-two',
      t('voucher.validate.user_or_email_required'),
      function (value) {
        const { userIds } = this.parent;
        if (value.length > 0 && userIds.length > 0) return false;
        if (value.length === 0 && userIds.length === 0) return false;
        return true;
      }
    ),
  });

  const handleSubmit = async (values) => {
    setSubmitting(true);
    const payload = {
      voucherTemplateId: values.voucherTemplateId,
      userIds: values.userIds,
      emails: values.emails,
    };

    await vouchersAPI.assignVoucher(axiosJWT, payload);
    setSubmitting(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="md"
      className="flex flex-col max-h-[90vh] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <Typography variant="h5">{t('voucher.assign')}</Typography>
        <IconButton onClick={onClose} size="sm" variant="text" className="rounded-full">
          <XMarkIcon className="h-4 w-4 text-red-500" />
        </IconButton>
      </div>

      <div className="p-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 mb-4">
          <div className="flex items-center gap-3">
            <div>
              <Typography variant="h6" className="font-bold text-gray-900 dark:text-white">
                {data?.name?.[i18n.language] || '--'}
              </Typography>
              <Typography className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {data?.description?.[i18n.language] || '--'}
              </Typography>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <TagIcon className="w-4 h-4 text-blue-500" />
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {t('voucher.discount_type')}:
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {t(`voucher.${data?.discount_type}`) || '--'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TicketIcon className="w-4 h-4 text-purple-500" />
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {t('voucher.discount_value')}:
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {data?.discount_value || '--'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t('voucher.user_ids')}</label>
                <TagInput
                  value={values.userIds}
                  onChange={(val) => setFieldValue('userIds', val)}
                  placeholder={t('voucher.enter_user_ids')}
                />
                <ErrorMessage name="userIds" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t('voucher.emails')}</label>
                <TagInput
                  value={values.emails}
                  onChange={(val) => setFieldValue('emails', val)}
                  placeholder={t('voucher.enter_emails')}
                />
                <ErrorMessage name="emails" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  type="button"
                  color="red"
                  variant="outlined"
                  onClick={onClose}
                  disabled={submitting}
                >
                  {t('table.cancel')}
                </Button>
                <Button type="submit" color="green" disabled={submitting}>
                  {submitting ? t('table.saving') : t('table.save')}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Dialog>
  );
}
