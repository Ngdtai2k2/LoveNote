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

import MUSIC_DEMO from '../assets/musics/music_background.mp3';
import FormCheckbox from '../components/formCheckbox';
import FormItem from '../components/formItem';
import FormRange from '../components/formRange';
import FormSlug from '../components/formSlug';
import FormVoucher from '../components/formVoucher';
import SelectMusic from '../components/selectMusic';
import TopLeftControl from '../components/topLeftControl';
import ModalRenderLink from '../modalRenderLink';
import { handleSubmitSettings } from './handleSubmitSettings';

export default function MenuSettings({ settings, onUpdate }) {
  const [openSettings, setOpenSettings] = useState(false);

  const { t, i18n } = useTranslation('template');

  const navigate = useNavigate();
  const user = useCurrentUser();
  const { axiosJWT } = useAxios(i18n.language);

  // get product information
  const product = useProductBySlug();

  const initialValues = {
    textRain: settings.textRain || 'DEMO',
    fontSize: settings.fontSize || 14,
    textColor: settings.textColor || '#ffffff',
    title: settings.title || 'DEMO',
    titleColor: settings.titleColor || '#ffffff',
    fontSizeTitle: settings.fontSizeTitle || 30,
    backgroundOpacity: settings.backgroundOpacity || 1,
    backgroundHex: settings.backgroundHex || '#000000',
    rainSpeed: settings.rainSpeed || 1,
    textPerClick: settings.textPerClick || 3,
    autoBurst: settings.autoBurst || false,
    audioVolume: settings.audioVolume || 1,
    slug: '',
    musicId: settings.musicId || 1,
    audioFile: settings.audioFile || MUSIC_DEMO,
  };

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
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {({ values, handleChange }) => (
            <Form className="p-4 space-y-4">
              <div className="menu-settings fixed right-0 top-0 z-30 h-full w-[350px] bg-black bg-opacity-90 text-white shadow-lg border-l border-white/20 overflow-scroll">
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
                    label={t('template:text_rain')}
                    name="textRain"
                    value={values.textRain}
                    maxLength={20}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('textRain', e.target.value);
                    }}
                  />

                  <FormRange
                    label={t('template:font_size_text_rain')}
                    name="fontSize"
                    min={5}
                    max={30}
                    step={1}
                    value={values.fontSize}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('fontSize', Number(e.target.value));
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

                  <FormItem
                    label={t('template:title')}
                    name="title"
                    value={values.title}
                    maxLength={20}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('title', e.target.value);
                    }}
                  />

                  <FormItem
                    label={t('template:title_color')}
                    name="titleColor"
                    type="color"
                    value={values.titleColor}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('titleColor', e.target.value);
                    }}
                  />

                  <FormRange
                    label={t('template:font_size_title')}
                    name="fontSizeTitle"
                    min={16}
                    max={200}
                    step={1}
                    value={values.fontSizeTitle}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('fontSizeTitle', Number(e.target.value));
                    }}
                  />

                  <FormRange
                    label={t('template:color_spread')}
                    name="backgroundOpacity"
                    min={0}
                    max={1}
                    step={0.01}
                    value={values.backgroundOpacity}
                    suffix="%"
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('backgroundOpacity', parseFloat(e.target.value));
                    }}
                  />

                  <FormItem
                    label={t('template:background_color')}
                    name="backgroundHex"
                    type="color"
                    value={values.backgroundHex}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('backgroundHex', e.target.value);
                    }}
                  />

                  <FormRange
                    label={t('template:rain_speed')}
                    name="rainSpeed"
                    min={0.2}
                    max={5}
                    step={0.1}
                    value={values.rainSpeed}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('rainSpeed', parseFloat(e.target.value));
                    }}
                  />

                  <FormRange
                    label={t('template:text_per_click')}
                    name="textPerClick"
                    min={1}
                    max={20}
                    step={1}
                    value={values.textPerClick}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('textPerClick', parseInt(e.target.value));
                    }}
                  />

                  <FormCheckbox
                    label={t('template:auto_random_click')}
                    name="autoBurst"
                    checked={values.autoBurst}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('autoBurst', e.target.checked);
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
