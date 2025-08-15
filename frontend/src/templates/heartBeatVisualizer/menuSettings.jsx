import { useState } from 'react';

import { Cog6ToothIcon } from '@heroicons/react/24/solid';
import { IconButton } from '@material-tailwind/react';
import { Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useAxios } from '@hooks/useAxiosJWT';
import { useCurrentUser } from '@hooks/useCurrentUser';
import { useProductBySlug } from '@hooks/useProductBySlug';
import { useSettingsFormHandler } from '@hooks/useSettingsFormHandler';

import MUSIC_DEMO from '../assets/musics/music_background_005.mp3';
import ColorSelector from '../components/colorSelector';
import FormItem from '../components/formItem';
import FormRange from '../components/formRange';
import FormSlug from '../components/formSlug';
import FormVoucher from '../components/formVoucher';
import SelectMusic from '../components/selectMusic';
import TopLeftControl from '../components/topLeftControl';
import ModalRenderLink from '../modalRenderLink';
import handleSubmitSettings from './handleSubmitSettings';

export default function MenuSettings({ settings, onUpdate }) {
  const [openSettings, setOpenSettings] = useState(false);

  const { t, i18n } = useTranslation('template');
  const navigate = useNavigate();
  const user = useCurrentUser();
  const { axiosJWT } = useAxios(i18n.language);

  const initialValues = {
    text: settings.text,
    textColor: settings.textColor,
    heartColor: settings.heartColor,
    snowColor: settings.snowColor,
    modelColor: settings.modelColor,
    musicId: settings.musicId || 4,
    audioFile: settings.audioFile || '',
    buttonColor: settings.buttonColor,
    audioVolume: settings.audioVolume,
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
        onClick={() => setOpenSettings(true)}
        className="absolute top-4 right-4 z-20 bg-white/10 hover:bg-white/20"
        ripple={false}
      >
        <Cog6ToothIcon className="h-6 w-6 text-white" />
      </IconButton>

      <TopLeftControl />

      {openSettings && (
        <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize>
          {({ values, handleChange }) => (
            <Form className="p-4 space-y-4">
              <div
                className="menu-settings fixed right-0 top-0 z-30 h-full w-[350px] bg-black bg-opacity-90 text-white shadow-lg border-l border-white/20 overflow-scroll"
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
                  <FormItem
                    label={t('template:title')}
                    name="text"
                    type="text"
                    value={values.text}
                    maxLength={20}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('text', e.target.value);
                    }}
                  />
                  <FormItem
                    label={t('template:text_color')}
                    name="textColor"
                    type="color"
                    value={values.textColor}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('textColor', e.target.value);
                    }}
                  />
                  <ColorSelector
                    label={`${t('template:colors')} (${t('template:heart')})`}
                    value={Array.isArray(values.heartColor) ? values.heartColor : []}
                    onChange={(newColors) => {
                      onUpdate('heartColor', newColors);
                    }}
                    max={5}
                  />
                  <ColorSelector
                    label={`${t('template:colors')} (${t('template:floating_heart')})`}
                    value={Array.isArray(values.snowColor) ? values.snowColor : []}
                    onChange={(newColors) => {
                      onUpdate('snowColor', newColors);
                    }}
                    max={5}
                  />
                  <FormItem
                    label={t('template:button_color')}
                    name="buttonColor"
                    type="color"
                    value={values.buttonColor}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('buttonColor', e.target.value);
                    }}
                  />
                  <FormItem
                    label={t('template:d_heart')}
                    name="modelColor"
                    type="color"
                    value={values.modelColor}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('modelColor', e.target.value);
                    }}
                  />
                  <FormRange
                    label={t('template:volume')}
                    name="audioVolume"
                    min={0}
                    max={1}
                    step={0.01}
                    value={values.audioVolume}
                    suffix="%"
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('audioVolume', parseFloat(e.target.value));
                    }}
                  />

                  <SelectMusic
                    value={values.musicId}
                    onChange={(id) => {
                      handleChange({ target: { name: 'musicId', value: id } });
                      onUpdate('musicId', id);
                    }}
                    onUpdate={(url) => onUpdate('audioFile', url || MUSIC_DEMO)}
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
