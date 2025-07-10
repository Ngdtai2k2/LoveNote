import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import { useDocumentTitle } from '@hooks/useDocumentTitle';
import FormField from '@components/FormField';
import { authAPI } from '@api/auth';
import ROUTES from '@constants/routes';
import { useState } from 'react';

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation('form');
  const navigate = useNavigate();

  useDocumentTitle(t('auth.reset_password'));

  const initialValues = {
    email: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email(t('auth.email_invalid')).required(t('auth.email_required')),
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await authAPI.forgotPassword(values);
      if (res?.status === 200) {
        sessionStorage.setItem('email', values.email);
        navigate(ROUTES.AUTH.VERIFY_CODE);
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
                  name="email"
                  type="email"
                  label={t('auth.email')}
                  placeholder={t('auth.email_placeholder')}
                  errors={errors}
                  touched={touched}
                  required
                  value={values.email}
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
