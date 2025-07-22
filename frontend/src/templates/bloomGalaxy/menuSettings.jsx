import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  Cog6ToothIcon,
  HomeIcon,
} from '@heroicons/react/24/solid';
import { IconButton } from '@material-tailwind/react';
import { Formik, Form } from 'formik';

import helperFunctions from '@helpers';
import ROUTES from '@constants/routes';

import { useAxios } from '@hooks/useAxiosJWT';
import { useCurrentUser } from '@hooks/useCurrentUser';
import { useProductBySlug } from '@hooks/useProductBySlug';
import { useSettingsFormHandler } from '@hooks/useSettingsFormHandler';

import FormArea from '../components/formArea';
import FormSlug from '../components/formSlug';
import FormVoucher from '../components/formVoucher';
import ModalRenderLink from '../modalRenderLink';
import { handleSubmitSettings } from './handleSubmitSettings';

import IMAGE_DEMO from '../assets/images/image_galaxy_text.jpg';
import MUSIC_DEMO from '../assets/musics/music_background_005.mp3';

export default function MenuSettings({ settings, onUpdate }) {
  const [openSettings, setOpenSettings] = useState(false);
  const [audioName, setAudioName] = useState();
  const [previewUrls, setPreviewUrls] = useState(
    Array.isArray(settings.images) ? settings.images : [IMAGE_DEMO]
  );

  const fileInputRef = useRef(null);
  const imagesInputRef = useRef(null);

  const { t, i18n } = useTranslation(['template', 'form']);
  const navigate = useNavigate();
  const user = useCurrentUser();
  const { axiosJWT } = useAxios(i18n.language);

  const arrayToMultilineText = (arr) => (Array.isArray(arr) ? arr.join('\n') : '');
  const multilineTextToArray = (text) =>
    text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line);

  const initialValues = {
    ringTexts: arrayToMultilineText(settings.ringTexts),
    heartImages: [],
    heartAudio: '',
    slug: '',
  };

  const clearAudioFile = (setFieldValue) => {
    setAudioName('');
    setFieldValue('audioFile', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onUpdate('audioFile', MUSIC_DEMO);
  };

  const clearImagesFile = (setFieldValue, heartImages, idx) => {
    const newFiles = heartImages.filter((_, i) => i !== idx);
    const newUrls = previewUrls.filter((_, i) => i !== idx);

    if (imagesInputRef.current) {
      const dt = new DataTransfer();
      newFiles.forEach((file) => dt.items.add(file));
      imagesInputRef.current.files = dt.files;
    }

    setFieldValue('heartImages', newFiles);
    setPreviewUrls(newUrls);
    onUpdate('heartImages', newUrls);
  };

  // get product information
  const product = useProductBySlug();

  const transformValues = (values) => ({
    ...values,
    ringTexts: multilineTextToArray(values.ringTexts),
  });

  const { onSubmit, loading, modalOpen, sitePath, setModalOpen, payload } = useSettingsFormHandler({
    user,
    product,
    navigate,
    axiosJWT,
    handleSubmitSettings,
    transformValues,
  });

  return (
    <>
      <IconButton
        onClick={() => setOpenSettings(true)}
        className="absolute top-4 right-4 z-20 bg-white/10 hover:bg-white/20"
        ripple={false}
      >
        <Cog6ToothIcon className="h-6 w-6 text-white" />
      </IconButton>

      <div className="absolute top-4 left-4 flex gap-2">
        <a href={ROUTES.HOME}>
          <IconButton className="z-20 bg-white/10 hover:bg-white/20" ripple={false}>
            <HomeIcon className="h-6 w-6 text-white" />
          </IconButton>
        </a>
        <IconButton
          onClick={helperFunctions.toggleFullscreen}
          className="z-20 bg-white/10 hover:bg-white/20"
          ripple={false}
        >
          {!document.fullscreenElement ? (
            <ArrowsPointingOutIcon className="h-6 w-6 text-white" />
          ) : (
            <ArrowsPointingInIcon className="h-6 w-6 text-white" />
          )}
        </IconButton>
      </div>

      {openSettings && (
        <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize>
          {({ values, handleChange, setFieldValue }) => (
            <Form className="p-4 space-y-4">
              <div
                className="menu-settings fixed right-0 top-0 z-30 h-full w-[350px] bg-black bg-opacity-90 text-white shadow-lg border-l border-white/20 overflow-y-auto"
                onMouseDown={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                onDoubleClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <h2 className="text-lg font-semibold">{t('template:settings')}</h2>
                  <button
                    onClick={() => setOpenSettings(false)}
                    className="text-white hover:text-red-500"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-4 space-y-4">
                  <FormArea
                    label={t('template:ring_texts')}
                    name="ringTexts"
                    value={values.ringTexts}
                    as="textarea"
                    rows={3}
                    onChange={(e) => {
                      handleChange(e);
                      const arr = multilineTextToArray(e.target.value);
                      onUpdate('ringTexts', arr);
                    }}
                  />
                  <div>
                    <label className="block mt-2 text-sm text-white">
                      {t('template:upload_images')} ({t('template:note_upload_ten_images')})
                    </label>
                    <div className="mt-2 flex flex-col gap-2 text-sm text-white">
                      <input
                        ref={imagesInputRef}
                        name="heartImages"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []).slice(0, 10);
                          setFieldValue('heartImages', files);
                          const urls = files.map((file) => URL.createObjectURL(file));
                          setPreviewUrls(urls);
                          onUpdate('heartImages', urls);
                        }}
                        className="text-white"
                      />
                      {previewUrls.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {previewUrls.map((url, idx) => (
                            <div key={idx} className="relative group">
                              <img
                                src={url}
                                alt={`uploaded-${idx}`}
                                className="w-16 h-16 rounded object-cover"
                              />
                              <button
                                type="button"
                                className="absolute top-0 right-0 text-white bg-black bg-opacity-50 rounded-full px-1 text-xs opacity-0 group-hover:opacity-100"
                                onClick={() =>
                                  clearImagesFile(setFieldValue, values.heartImages, idx)
                                }
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block mt-2 text-sm text-white">
                      {t('template:upload_audio')}
                    </label>
                    <div className="mt-2 flex items-center text-sm text-white">
                      <input
                        name="heartAudio"
                        type="file"
                        ref={fileInputRef}
                        accept="audio/mpeg"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          setFieldValue('heartAudio', file || null);
                          onUpdate('heartAudio', file ? URL.createObjectURL(file) : null);
                          onUpdate('playAudio', !!file);
                          setAudioName(file?.name);
                        }}
                        className="mt-1 text-white"
                      />
                      {audioName && (
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <span
                            className="cursor-pointer hover:text-red-800 text-red-600 ms-1 text-xl text-bold"
                            onClick={() => clearAudioFile(setFieldValue)}
                          >
                            ✕
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                  <FormSlug
                    label={`${t('template:slug')} (${t('template:optional')})`}
                    name="slug"
                  />
                  <FormVoucher
                    label={t('template:voucher')}
                    name="voucher"
                    price={product?.price}
                    slug={product?.slug}
                  />
                  <button
                    disabled={loading}
                    type="submit"
                    className={`w-full rounded py-2 text-white transition duration-200
                    ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-800'}
                  focus:bg-gray-800 active:bg-gray-800
                    dark:${loading ? 'bg-gray-500' : 'bg-gray-600 hover:bg-gray-800'}`}
                  >
                    {loading ? t('form:saving') : t('form:save')}
                  </button>
                </div>
              </div>
              <ModalRenderLink
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                path={sitePath}
                payload={payload}
              />
            </Form>
          )}
        </Formik>
      )}
    </>
  );
}
