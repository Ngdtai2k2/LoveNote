import React, { useEffect, useState } from 'react';

import { EnvelopeIcon } from '@heroicons/react/24/solid';
import { Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { contactAPI } from '@api/public/contact';

import { useDocumentTitle } from '@hooks/useDocumentTitle';
import useWebConfig from '@hooks/useWebConfig';

import ArcMenu from '@components/ArcMenu';
import FormField from '@components/FormField';
import FormTextArea from '@components/FormTextArea';

export default function Contacts() {
  const [webData, setWebData] = useState({});

  const { t } = useTranslation(['contact', 'form']);

  useDocumentTitle(t('contact:contact_me'));

  const { webConfigs, loading: configLoading } = useWebConfig();

  useEffect(() => {
    if (configLoading || !webConfigs.length) return;

    const getValue = (key) => webConfigs.find((item) => item.key === key)?.value;

    setWebData({
      contacts: getValue('contacts'),
      socials: getValue('socials'),
      contactsNote: getValue('contacts_note'),
    });
  }, [webConfigs, configLoading]);

  const initialValues = {
    fullName: '',
    email: '',
    message: '',
  };

  const validationSchema = Yup.object({
    fullName: Yup.string()
      .min(2, t('form:auth.full_name_min', { min: 2 }))
      .max(100, t('form:auth.full_name_max', { max: 100 }))
      .required(t('form:auth.full_name_required')),
    email: Yup.string().email(t('form:auth.email_invalid')).required(t('form:auth.email_required')),
    message: Yup.string()
      .min(1, t('form:message_min', { min: 1 }))
      .max(1200, t('form:message_max', { max: 1200 }))
      .required(t('form:message_required')),
  });

  const onSubmit = async (values, { resetForm }) => {
    const res = await contactAPI.create(values);

    if (res?.status === 201) {
      resetForm();
    }
  };

  return (
    <div className="pt-12 pb-16">
      {configLoading ? (
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800"></div>
      ) : (
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg">
            <div>
              <h2 className="text-2xl font-bold mb-4">{t('contact_me')}</h2>

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
                        label={t('form:auth.full_name')}
                        placeholder={t('form:auth.full_name_placeholder')}
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
                        label={t('form:auth.email')}
                        placeholder={t('form:auth.email_placeholder')}
                        errors={errors}
                        touched={touched}
                        required
                        value={values.email}
                        onChange={handleChange}
                        labelColor="text-gray-800 dark:text-gray-200"
                        className="w-full rounded bg-black/10 px-2 py-2 text-[16px] focus:outline-none dark:bg-white/10"
                      />
                    </div>
                    <div>
                      <FormTextArea
                        name="message"
                        type="message"
                        label={t('form:message')}
                        placeholder={t('form:message_placeholder')}
                        errors={errors}
                        touched={touched}
                        required
                        rows={3}
                        value={values.message}
                        onChange={handleChange}
                        labelColor="text-gray-800 dark:text-gray-200"
                        className="w-full rounded bg-black/10 px-2 py-2 text-[16px] focus:outline-none dark:bg-white/10"
                      />
                    </div>
                    <div className="flex justify-center mt-2">
                      <button
                        type="submit"
                        className="w-full rounded bg-gray-600 py-2 text-white transition duration-200 hover:bg-gray-800 
                        focus:bg-gray-800 active:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-800 dark:focus:bg-gray-800 
                        dark:active:bg-gray-800"
                      >
                        {t('form:send')}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Thông tin liên hệ</h2>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-200">
                <EnvelopeIcon className="h-6 w-6" />
                <span>{webData?.contacts?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-200">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                  <path d="M22,0H2C0.895,0,0,0.895,0,2v20c0,1.105,0.895,2,2,2h11v-9h-3v-4h3V8.413c0-3.1,1.893-4.788,4.659-4.788 c1.325,0,2.463,0.099,2.795,0.143v3.24l-1.918,0.001c-1.504,0-1.795,0.715-1.795,1.763V11h4.44l-1,4h-3.44v9H22c1.105,0,2-0.895,2-2 V2C24,0.895,23.105,0,22,0z"></path>
                </svg>
                <a
                  href={webData?.socials?.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  Facebook
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-200">
                <svg viewBox="0 0 30 30" fill="currentColor" className="h-6 w-6">
                  <circle cx="15" cy="15" r="4"></circle>
                  <path d="M19.999,3h-10C6.14,3,3,6.141,3,10.001v10C3,23.86,6.141,27,10.001,27h10C23.86,27,27,23.859,27,19.999v-10   C27,6.14,23.859,3,19.999,3z M15,21c-3.309,0-6-2.691-6-6s2.691-6,6-6s6,2.691,6,6S18.309,21,15,21z M22,9c-0.552,0-1-0.448-1-1   c0-0.552,0.448-1,1-1s1,0.448,1,1C23,8.552,22.552,9,22,9z"></path>
                </svg>
                <a
                  href={webData?.socials?.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      <ArcMenu />
    </div>
  );
}
