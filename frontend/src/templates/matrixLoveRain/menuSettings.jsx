import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@material-tailwind/react';
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  Cog6ToothIcon,
  HomeIcon,
} from '@heroicons/react/24/solid';
import { Form, Formik } from 'formik';

import helperFunctions from '@helpers';
import ROUTES from '@constants/routes';
import { useAxios } from '@hooks/useAxiosJWT';
import { useCurrentUser } from '@hooks/useCurrentUser';
import { handleSubmitSettings } from './handleSubmitSettings';

import { FormItem } from '../components/formItem';
import { FormRange } from '../components/formRange';
import { FormCheckbox } from '../components/formCheckbox';
import ModalRenderLink from '../modalRenderLink';

export default function MenuSettings({ settings, onUpdate }) {
  const [openSettings, setOpenSettings] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [sitePath, setSitePath] = useState('');

  const { t, i18n } = useTranslation('template');

  const navigate = useNavigate();
  const user = useCurrentUser();
  const { axiosJWT } = useAxios(i18n.language);

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
    audioFile: '',
    slug: '',
  };

  const onSubmit = async (values) => {
    const res = await handleSubmitSettings(values, user, axiosJWT, navigate);
    if (res?.data) {
      const path = res.data.slug;
      setSitePath(path);
      setModalOpen(true);
    }
  };

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
        <IconButton
          onClick={() => navigate(ROUTES.HOME)}
          className="z-20 bg-white/10 hover:bg-white/20"
          ripple={false}
        >
          <HomeIcon className="h-6 w-6 text-white" />
        </IconButton>
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
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {({ values, handleChange, setFieldValue }) => (
            <Form className="p-4 space-y-4">
              <div className="fixed right-0 top-0 z-30 h-full w-[350px] bg-black bg-opacity-90 text-white shadow-lg border-l border-white/20 overflow-scroll">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <h2 className="text-lg font-semibold">{t('settings')}</h2>
                  <button
                    onClick={() => setOpenSettings(false)}
                    className="text-white hover:text-pink-300"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-4 space-y-4">
                  <FormItem
                    label={t('text_rain')}
                    name="textRain"
                    value={values.textRain}
                    maxLength={20}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('textRain', e.target.value);
                    }}
                  />

                  <FormRange
                    label={t('font_size_text_rain')}
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
                    label={t('text_color')}
                    name="textColor"
                    type="color"
                    value={values.textColor}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('textColor', e.target.value);
                    }}
                  />

                  <FormItem
                    label={t('title')}
                    name="title"
                    value={values.title}
                    maxLength={20}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('title', e.target.value);
                    }}
                  />

                  <FormItem
                    label={t('title_color')}
                    name="titleColor"
                    type="color"
                    value={values.titleColor}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('titleColor', e.target.value);
                    }}
                  />

                  <FormRange
                    label={t('font_size_title')}
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
                    label={t('color_spread')}
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
                    label={t('background_color')}
                    name="backgroundHex"
                    type="color"
                    value={values.backgroundHex}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('backgroundHex', e.target.value);
                    }}
                  />

                  <FormRange
                    label={t('rain_speed')}
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
                    label={t('text_per_click')}
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
                    label={t('auto_random_click')}
                    name="autoBurst"
                    checked={values.autoBurst}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('autoBurst', e.target.checked);
                    }}
                  />

                  <FormRange
                    label={t('volume')}
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

                  <FormItem
                    label={t('slug')}
                    name="slug"
                    type="text"
                    value={values.slug}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  />
                  {values.slug && (
                    <span className="text-sm mt-1">{`${import.meta.env.VITE_CLIENT_URL}/${values.slug}`}</span>
                  )}

                  {/* Upload Audio File */}
                  <div>
                    <label className="block mt-2 text-sm text-white">{t('upload')}</label>
                    <input
                      name="audioFile"
                      type="file"
                      accept="audio/mpeg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        setFieldValue('audioFile', file || null);
                        onUpdate('audioFile', file ? URL.createObjectURL(file) : null);
                      }}
                      className="mt-1 text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-pink-500 py-2 rounded hover:bg-pink-600 transition"
                  >
                    SAVE
                  </button>
                </div>
              </div>
              <ModalRenderLink
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                path={sitePath}
              />
            </Form>
          )}
        </Formik>
      )}
    </>
  );
}
