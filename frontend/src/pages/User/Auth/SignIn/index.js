import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import FormField from '@components/FormField';
import ROUTES from '@constants/routes';
import { signIn } from '@api/auth';

export default function SignIn() {
  const { t } = useTranslation('form');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email(t('auth.email_invalid')).required(t('auth.email_required')),
    password: Yup.string().min(6, t('auth.password_min')).required(t('auth.password_required')),
  });

  const onSubmit = values => {
    dispatch(signIn(values, navigate));
  };

  return (
    <div className="flex mt-10 pt-5 justify-center items-center">
      <div className="dark:bg-gray-900 bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">{t('auth.sign_in')}</h2>
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
                  className="focus:outline-none rounded px-2 py-2 dark:bg-white/10 bg-black/10 text-[16px] w-full"
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
                  className="focus:outline-none rounded px-2 py-2 dark:bg-white/10 bg-black/10 text-[16px] w-full"
                />
              </div>

              <div className="mb-5 px-1 flex justify-between">
                <h6 className="text-[12px] italic cursor-pointer underline hover:no-underline">
                  {t('auth.forgot_password')}
                </h6>
                <h6
                  onClick={() => navigate(ROUTES.AUTH.SIGN_UP)}
                  className="text-[12px] italic cursor-pointer underline hover:no-underline"
                >
                  {t('auth.sign_up_now')}
                </h6>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full text-white py-2 rounded transition duration-200 bg-blue-700 hover:bg-light-blue-900 
                active:bg-light-blue-900 focus:bg-light-blue-900 dark:bg-gray-600 dark:hover:bg-gray-800 dark:active:bg-gray-800 
                dark:focus:bg-gray-800"
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
