import { useRef, useState } from 'react';

import ROUTES from '@constants/routes';
import helperFunctions from '@helpers';
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  Cog6ToothIcon,
  HomeIcon,
} from '@heroicons/react/24/solid';
import { IconButton } from '@material-tailwind/react';
import { Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useAxios } from '@hooks/useAxiosJWT';
import { useCurrentUser } from '@hooks/useCurrentUser';
import { useProductBySlug } from '@hooks/useProductBySlug';
import { useSettingsFormHandler } from '@hooks/useSettingsFormHandler';

import IMAGE_DEMO from '../assets/images/image_galaxy_text.jpg';
import MUSIC_DEMO from '../assets/musics/music_background.mp3';
import FormArea from '../components/formArea';
import FormSlug from '../components/formSlug';
import FormVoucher from '../components/formVoucher';
import SelectMusic from '../components/selectMusic';
import ModalRenderLink from '../modalRenderLink';
import { handleSubmitSettings } from './handleSubmitSettings';

export default function MenuSettings({ settings, onUpdate }) {
  const [openSettings, setOpenSettings] = useState(false);
  const [previewUrls, setPreviewUrls] = useState(
    Array.isArray(settings.images) ? settings.images : [IMAGE_DEMO]
  );

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
    musicId: settings.musicId || 1,
    heartAudio: settings.audioFile || '',
    slug: '',
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

                  <SelectMusic
                    value={values.musicId}
                    onChange={(id) => {
                      handleChange({ target: { name: 'musicId', value: id } });
                      onUpdate('musicId', id);
                    }}
                    onUpdate={(url) => onUpdate('heartAudio', url || MUSIC_DEMO)}
                    required
                  />

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
