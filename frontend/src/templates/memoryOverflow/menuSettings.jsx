import { useEffect, useState } from 'react';

import { Cog6ToothIcon } from '@heroicons/react/24/solid';
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
} from '@material-tailwind/react';
import { Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useAxios } from '@hooks/useAxiosJWT';
import { useCurrentUser } from '@hooks/useCurrentUser';
import { useProductBySlug } from '@hooks/useProductBySlug';
import { useSettingsFormHandler } from '@hooks/useSettingsFormHandler';

import FormItem from '../components/formItem';
import FormSlug from '../components/formSlug';
import FormVoucher from '../components/formVoucher';
import TopLeftControl from '../components/topLeftControl';
import ModalRenderLink from '../modalRenderLink';
import { handleSubmitSettings } from './handleSubmitSettings';

export default function MenuSettings({ settings, onUpdate, onOpen }) {
  const [open, setOpen] = useState(false);
  const [demoPreview, setDemoPreview] = useState(settings);

  const { t, i18n } = useTranslation('template');

  const navigate = useNavigate();
  const user = useCurrentUser();
  const { axiosJWT } = useAxios(i18n.language);

  const handleOpen = () => {
    if (!open && typeof onOpen === 'function') {
      onOpen();
    }
    setOpen(!open);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDemoPreview(settings);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [settings]);

  const initialValues = {
    popupTitle: settings.popupTitle,
    popupContent: settings.popupContent,
    popupIcon: settings.popupIcon,
    commonColor: settings.commonColor,
    popupTitleColor: settings.popupTitleColor,
    popupContentColor: settings.popupContentColor,
    buttonText: settings.buttonText,
    slug: '',
  };

  // get product information
  const product = useProductBySlug();

  const { onSubmit, loading, modalOpen, setModalOpen, sitePath, payload } = useSettingsFormHandler({
    user,
    product,
    navigate,
    axiosJWT,
    handleSubmitSettings,
  });

  return (
    <>
      <IconButton
        onClick={() => handleOpen(true)}
        className="absolute top-4 right-4 z-20 bg-white/10 hover:bg-white/20"
        ripple={false}
      >
        <Cog6ToothIcon className="h-6 w-6 text-white" />
      </IconButton>
      <TopLeftControl />
      <Dialog open={open} handler={handleOpen} size="xs">
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {({ values, handleChange }) => (
            <Form className="bg-black rounded bg-opacity-90 text-white">
              <DialogHeader>
                <h2 className="text-lg font-semibold">{t('template:settings')}</h2>
              </DialogHeader>

              <DialogBody className="max-h-[70vh] overflow-y-auto">
                <div className="mb-2">
                  <FormItem
                    label={t('template:title')}
                    name="popupTitle"
                    value={values.popupTitle}
                    maxLength={20}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('popupTitle', e.target.value);
                    }}
                  />
                </div>
                <div className="mb-2">
                  <FormItem
                    label={t('template:content')}
                    name="popupContent"
                    value={values.popupContent}
                    maxLength={20}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('popupContent', e.target.value);
                    }}
                  />
                </div>
                <div className="mb-2">
                  <FormItem
                    label={t('template:icon')}
                    name="popupIcon"
                    value={values.popupIcon}
                    maxLength={10}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('popupIcon', e.target.value);
                    }}
                  />
                </div>
                <div className="mb-2">
                  <FormItem
                    label={t('template:common_color')}
                    name="commonColor"
                    type="color"
                    value={values.commonColor}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('commonColor', e.target.value);
                    }}
                  />
                </div>
                <div className="mb-2">
                  <FormItem
                    label={`${t('template:text_color')} (${t('template:title')})`}
                    name="popupTitleColor"
                    type="color"
                    value={values.popupTitleColor}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('popupTitleColor', e.target.value);
                    }}
                  />
                </div>
                <div className="mb-2">
                  <FormItem
                    label={`${t('template:text_color')} (${t('template:content')})`}
                    name="popupContentColor"
                    type="color"
                    value={values.popupContentColor}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('popupContentColor', e.target.value);
                    }}
                  />
                </div>
                <div className="mb-2">
                  <FormItem
                    label={t('template:button_text')}
                    name="buttonText"
                    value={values.buttonText}
                    maxLength={20}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('buttonText', e.target.value);
                    }}
                  />
                </div>

                {/* DEMO PREVIEW */}
                <div className="mb-2">
                  <span className="block mb-1 text-sm">Demo</span>
                  <div className="flex justify-center">
                    <div className="w-52 bg-white rounded shadow-md overflow-hidden text-sm pointer-events-none">
                      <div
                        className="text-white px-3 py-1 font-bold flex items-center justify-between"
                        style={{
                          backgroundColor: demoPreview.commonColor,
                        }}
                      >
                        <span
                          style={{
                            color: demoPreview.popupTitleColor,
                          }}
                        >
                          {demoPreview.popupTitle}
                        </span>
                        <span className="text-xs">{demoPreview.popupIcon}</span>
                      </div>
                      <div
                        className="p-4 text-center font-semibold"
                        style={{
                          color: demoPreview.popupContentColor,
                        }}
                      >
                        {demoPreview.popupContent}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center my-2">
                    <div
                      className="group flex w-fit cursor-pointer items-center gap-2 overflow-hidden border rounded-full
                        fill-none p-2 px-3 font-extrabold transition-all active:scale-90"
                      style={{
                        color: demoPreview.commonColor,
                        borderColor: demoPreview.commonColor,
                      }}
                    >
                      <div className="z-10 transition group-hover:translate-x-4">
                        {demoPreview.buttonText}
                      </div>
                      <svg
                        className="size-6 transition duration-500 group-hover:scale-[3000%]"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <FormSlug label={`${t('template:slug')} (${t('template:optional')})`} name="slug" />
                <FormVoucher
                  label={t('template:voucher')}
                  name="voucher"
                  price={product?.price}
                  slug={product?.slug}
                />
              </DialogBody>

              <DialogFooter>
                <Button
                  variant="outlined"
                  color="red"
                  size="sm"
                  onClick={handleOpen}
                  className="mr-1"
                >
                  <span>Demo</span>
                </Button>
                <Button disabled={loading} type="submit" variant="outlined" color="green" size="sm">
                  {loading ? t('form:saving') : t('form:save')}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </Dialog>
      <ModalRenderLink
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        path={sitePath}
        payload={payload}
      />
    </>
  );
}
