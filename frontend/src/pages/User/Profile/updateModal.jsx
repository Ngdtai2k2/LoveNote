import React, { useMemo, useState } from 'react';

import { ArrowUpTrayIcon } from '@heroicons/react/24/solid';
import {
  Avatar,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from '@material-tailwind/react';
import { Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

import { userAPI } from '@api/public/user';

import { useAxios } from '@hooks/useAxiosJWT';
import { useCurrentUser } from '@hooks/useCurrentUser';

import FormField from '@components/FormField';

export default function UpdateModal() {
  const [open, setOpen] = useState(false);
  const [avatar, setAvatar] = useState();
  const [fileName, setFileName] = useState();

  const { t, i18n } = useTranslation(['form', 'validation']);
  const handleOpen = () => setOpen(!open);

  const user = useCurrentUser();
  const dispatch = useDispatch();
  const { axiosJWT } = useAxios(i18n.language);

  const initialValues = useMemo(
    () => ({
      fullName: user?.full_name || '',
      phoneNumber: user?.phone_number || '',
      avatar: null,
    }),
    [user]
  );

  const validationSchema = Yup.object({
    fullName: Yup.string().required(t('form:auth.full_name_required')),
    phoneNumber: Yup.string().matches(/^[0-9]{10,11}$/, t('form:auth.phone_number_validate')),
  });

  const onSubmit = async (values, { setFieldValue }) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== null && key !== 'email' && key !== 'avatar') {
        formData.append(key, value);
      }
    });
    if (fileName) {
      formData.append('avatar', values.avatar);
    }

    const res = await userAPI.updateProfile(user?.id, formData, axiosJWT);

    if (res?.status == 200) {
      clearInputImage(setFieldValue);
      userAPI.getCurrentUser(dispatch, axiosJWT);
    }

    handleOpen();
  };

  const clearInputImage = (setFieldValue) => {
    setAvatar(user?.avatar);
    setFileName('');
    setFieldValue('avatar', null);
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        className="my-4 dark:text-gray-200 dark:border-gray-200 focus:outline-none"
        variant="outlined"
        size="sm"
      >
        {t('form:update')}
      </Button>

      <Dialog open={open} handler={handleOpen} size="sm" className="dark:bg-gray-800">
        <DialogHeader className="dark:text-gray-200">{t('form:update_profile')}</DialogHeader>
        {/* form */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ values, errors, touched, handleChange, setFieldValue, dirty }) => (
            <Form className="m-auto rounded">
              {/* form data */}
              <DialogBody>
                <div className="grid grid-cols-12 gap-5 mb-5">
                  <div className="col-span-4 md:col-span-3 flex justify-center">
                    <Avatar
                      src={avatar || user?.avatar}
                      alt="Avatar"
                      variant="square"
                      className="object-cover w-20 h-20 md:w-32 md:h-32 border rounded-sm"
                    />
                  </div>
                  <div className="col-span-8 md:col-span-9 flex flex-col justify-center items-center">
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="image"
                        className="flex flex-col items-center justify-center w-full h-24 md:h-30 border-2 
                        border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50
                        dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 
                        dark:border-gray-600 dark:hover:border-gray-500"
                      >
                        <div className="flex flex-col items-center justify-center py-6">
                          <ArrowUpTrayIcon className="h-5 w-5 text-gray-500 dark:text-gray-200" />
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">{t('form:click_to_upload')}</span>
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-200">
                            PNG, JPG, JPEG or GIF
                          </p>
                        </div>
                        <input
                          id="image"
                          name="image"
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            const file = event.currentTarget.files[0];
                            setFieldValue('avatar', file);
                            setFileName(file?.name);
                            setAvatar(URL.createObjectURL(file));
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {fileName && (
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <span className="truncate max-w-[100px] md:max-w-full overflow-hidden whitespace-nowrap text-ellipsis">
                          {fileName}
                        </span>
                        <span
                          className="cursor-pointer hover:underline text-red-400 ms-1"
                          onClick={() => clearInputImage(setFieldValue)}
                        >
                          {t('form:clear_file')}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-5 mb-1">
                  <div className="col-span-12 md:col-span-6">
                    <FormField
                      name="fullName"
                      type="text"
                      label={t('form:auth.full_name')}
                      placeholder={t('form:auth.full_name_placeholder')}
                      errors={errors}
                      touched={touched}
                      value={values.fullName}
                      onChange={handleChange}
                      required
                      labelColor="text-gray-800 dark:text-gray-200"
                      className="w-full rounded bg-black/10 px-2 py-2 text-[16px] focus:outline-none dark:bg-white/10 dark:text-gray-200"
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <FormField
                      name="phoneNumber"
                      type="tel"
                      label={t('form:auth.phone_number')}
                      placeholder={t('form:auth.phone_number_placeholder')}
                      errors={errors}
                      touched={touched}
                      value={values.phoneNumber}
                      onChange={handleChange}
                      labelColor="text-gray-800 dark:text-gray-200"
                      className="w-full rounded bg-black/10 px-2 py-2 text-[16px] focus:outline-none dark:bg-white/10 dark:text-gray-200"
                    />
                  </div>
                </div>
              </DialogBody>
              {/* end form data */}
              {/* button */}
              <DialogFooter className="gap-2">
                <button
                  type="button"
                  onClick={handleOpen}
                  className="text-white mt-3 py-1 px-3 rounded w-fit gap-1 text-[16px] bg-red-500"
                >
                  {t('form:cancel')}
                </button>
                <button
                  type="submit"
                  disabled={!dirty}
                  className={`text-white mt-3 ${
                    !dirty ? 'bg-gray-500' : 'bg-green-500'
                  } py-1 px-3 rounded w-fit gap-1 text-[16px]`}
                >
                  {t('form:save')}
                </button>
              </DialogFooter>
              {/* end button */}
            </Form>
          )}
        </Formik>
        {/* end form */}
      </Dialog>
    </>
  );
}
