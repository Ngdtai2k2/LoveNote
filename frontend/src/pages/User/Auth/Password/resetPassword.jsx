import React from 'react';
import { useState } from 'react';

import ROUTES from '@constants/routes';
import { Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import { authAPI } from '@api/auth';

import { useDocumentTitle } from '@hooks/useDocumentTitle';

import FormField from '@components/FormField';

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation('form');
  const navigate = useNavigate();

  useDocumentTitle(t('auth.reset_password'));

  const initialValues = {
    newPassword: '',
    confirmNewPassword: '',
  };

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .min(8, t('auth.password_min', { min: 8 }))
      .required(t('auth.new_password_required')),
    confirmNewPassword: Yup.string()
      .min(8, t('auth.confirm_password', { min: 8 }))
      .required(t('auth.confirm_password_required'))
      .oneOf([Yup.ref('newPassword'), null], t('auth.confirm_password_mismatch')),
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await authAPI.resetPassword(values.confirmNewPassword);
      if (res.status == 200) {
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('verify_code');

        navigate(ROUTES.AUTH.SIGN_IN);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mt-6 flex items-center justify-center pt-5">
      <div className="w-96 rounded-lg bg-white p-8 shadow-md dark:bg-gray-900">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-gray-200">
          {t('auth.reset_password')}
        </h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ values, errors, touched, handleChange }) => (
            <Form>
              <div className="mb-4">
                <FormField
                  type="password"
                  name="newPassword"
                  label={t('auth.new_password')}
                  placeholder={t('auth.new_password_placeholder')}
                  errors={errors}
                  touched={touched}
                  required
                  value={values.newPassword}
                  onChange={handleChange}
                  labelColor="text-gray-800 dark:text-gray-200"
                  className="w-full rounded bg-black/10 px-2 py-2 text-[16px] focus:outline-none dark:bg-white/10"
                />
              </div>
              <div className="mb-4">
                <FormField
                  type="password"
                  name="confirmNewPassword"
                  label={t('auth.confirm_password')}
                  placeholder={t('auth.confirm_password_placeholder')}
                  errors={errors}
                  touched={touched}
                  required
                  value={values.confirmNewPassword}
                  onChange={handleChange}
                  labelColor="text-gray-800 dark:text-gray-200"
                  className="w-full rounded bg-black/10 px-2 py-2 text-[16px] focus:outline-none dark:bg-white/10"
                />
              </div>
              <div className="flex justify-center">
                <button
                  disabled={loading}
                  type="submit"
                  className={`w-full rounded py-2 text-white transition duration-200
                  ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-800'}
                focus:bg-gray-800 active:bg-gray-800
                  dark:${loading ? 'bg-gray-500' : 'bg-gray-600 hover:bg-gray-800'}`}
                >
                  {loading ? t('sending') : t('send')}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
