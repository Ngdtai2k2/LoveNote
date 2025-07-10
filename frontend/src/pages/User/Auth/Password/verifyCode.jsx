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

export default function VerifyCode() {
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation('form');
  const navigate = useNavigate();

  useDocumentTitle(t('auth.verification_code'));

  const initialValues = {
    code: '',
  };

  const validationSchema = Yup.object({
    code: Yup.string()
      .min(6, t('auth.verification_code_min', { min: 6 }))
      .max(6, t('auth.verification_code_max', { max: 6 }))
      .required(t('auth.verification_code_required')),
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await authAPI.verifyCode(values.code);
      if (res?.status == 200) {
        sessionStorage.setItem('verify_code', values.code);
        navigate(ROUTES.AUTH.RESET_PASSWORD);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 flex items-center justify-center pt-5">
      <div className="w-96 rounded-lg bg-white p-8 shadow-md dark:bg-gray-900">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-gray-200">
          {t('auth.verification_code')}
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
                  name="code"
                  type="text"
                  label={t('auth.verification_code')}
                  placeholder={t('auth.verification_code_placeholder')}
                  errors={errors}
                  touched={touched}
                  required
                  value={values.code}
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
