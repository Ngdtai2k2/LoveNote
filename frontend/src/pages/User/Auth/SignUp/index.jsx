import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import FormField from '@components/FormField';
import ROUTES from '@constants/routes';
import { useDocumentTitle } from '@hooks/useDocumentTitle';
import { authAPI } from '@api/auth';

export default function SignUp() {
  const { t } = useTranslation('form');

  useDocumentTitle(t('auth.sign_up'));

  const navigate = useNavigate();

  const initialValues = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object({
    fullName: Yup.string()
      .min(2, t('full_name_min', { min: 2 }))
      .max(50, ('full_name_max', { max: 50 }))
      .required(t('auth.full_name_required')),
    email: Yup.string().email(t('auth.email_invalid')).required(t('auth.email_required')),
    password: Yup.string()
      .min(6, t('auth.password_min', { min: 6 }))
      .required(t('auth.password_required')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('auth.confirm_password_mismatch'))
      .required(t('auth.confirm_password_required')),
  });

  const onSubmit = (values) => {
    authAPI.signUp(values, navigate);
  };

  return (
    <div className="mt-5 flex items-center justify-center">
      <div className="w-96 rounded-lg bg-white p-8 shadow-md dark:bg-gray-900">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-gray-200">
          {t('auth.sign_up')}
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
                  name="fullName"
                  type="text"
                  label={t('auth.full_name')}
                  placeholder={t('auth.full_name_placeholder')}
                  errors={errors}
                  touched={touched}
                  required
                  value={values.fullName}
                  onChange={handleChange}
                  labelColor="text-gray-800 dark:text-gray-200"
                  className="w-full rounded bg-black/10 px-2 py-2 text-[16px] focus:outline-none dark:bg-white/10"
                />
              </div>
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
              <div className="mb-4">
                <FormField
                  type="password"
                  name="password"
                  label={t('auth.password')}
                  placeholder={t('auth.password_placeholder')}
                  errors={errors}
                  touched={touched}
                  required
                  value={values.password}
                  onChange={handleChange}
                  labelColor="text-gray-800 dark:text-gray-200"
                  className="w-full rounded bg-black/10 px-2 py-2 text-[16px] focus:outline-none dark:bg-white/10"
                />
              </div>
              <div className="mb-6">
                <FormField
                  type="password"
                  name="confirmPassword"
                  label={t('auth.confirm_password')}
                  placeholder={t('auth.confirm_password_placeholder')}
                  errors={errors}
                  touched={touched}
                  required
                  value={values.confirmPassword}
                  onChange={handleChange}
                  labelColor="text-gray-800 dark:text-gray-200"
                  className="w-full rounded bg-black/10 px-2 py-2 text-[16px] focus:outline-none dark:bg-white/10"
                />
              </div>
              <div className="mb-5 flex justify-end px-1">
                <h6
                  onClick={() => navigate(ROUTES.AUTH.SIGN_IN)}
                  className="cursor-pointer text-[12px] italic text-gray-800 underline hover:no-underline dark:text-gray-200"
                >
                  {t('auth.sign_in_now')}
                </h6>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full rounded bg-gray-600 py-2 text-white transition duration-200 hover:bg-gray-800 
                focus:bg-gray-800 active:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-800 dark:focus:bg-gray-800 
                dark:active:bg-gray-800"
                >
                  {t('auth.sign_up')}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
