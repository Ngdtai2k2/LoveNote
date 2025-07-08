import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import FormField from '@components/FormField';
import ROUTES from '@constants/routes';
import { signIn } from '@api/auth';
import { useDocumentTitle } from '@hooks/useDocumentTitle';

export default function SignIn() {
  const { t } = useTranslation('form');

  useDocumentTitle(t('auth.sign_in'));

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email(t('auth.email_invalid')).required(t('auth.email_required')),
    password: Yup.string()
      .min(6, t('auth.password_min', { min: 6 }))
      .required(t('auth.password_required')),
  });

  const onSubmit = (values) => {
    dispatch(signIn(values, navigate));
  };

  return (
    <div className="mt-10 flex items-center justify-center pt-5">
      <div className="w-96 rounded-lg bg-white p-8 shadow-md dark:bg-gray-900">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-gray-200">
          {t('auth.sign_in')}
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

              <div className="mb-6">
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

              <div className="mb-5 flex justify-between px-1">
                <h6 className="cursor-pointer text-[12px] italic text-gray-800 underline hover:no-underline dark:text-gray-200">
                  {t('auth.forgot_password')}
                </h6>
                <h6
                  onClick={() => navigate(ROUTES.AUTH.SIGN_UP)}
                  className="cursor-pointer text-[12px] italic text-gray-800 underline hover:no-underline dark:text-gray-200"
                >
                  {t('auth.sign_up_now')}
                </h6>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full rounded bg-gray-600 py-2 text-white transition duration-200 hover:bg-gray-800 
                focus:bg-gray-800 active:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-800 dark:focus:bg-gray-800 
                dark:active:bg-gray-800"
                >
                  {t('auth.sign_in')}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
