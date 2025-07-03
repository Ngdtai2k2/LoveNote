import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
import { useCurrentUser } from '@hooks/useCurrentUser';
import { useAxios } from '@hooks/useAxiosJWT';

import { FormItem } from '../components/formItem';
import ColorSelector from '../components/ColorSelector';
import FormSlug from '../components/formSlug';
import { FormRange } from '../components/formRange';
import handleSubmitSettings from './handleSubmitSettings';
import ModalRenderLink from '../modalRenderLink';

import MUSIC_DEMO from '../assets/musics/music_background_005.mp3';

export default function MenuSettings({ settings, onUpdate }) {
  const [openSettings, setOpenSettings] = useState(false);
  const [audioName, setAudioName] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [sitePath, setSitePath] = useState('');
  const fileInputRef = useRef(null);

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
    audioFile: '',
    buttonColor: settings.buttonColor,
    audioVolume: settings.audioVolume,
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
        <Formik initialValues={initialValues} onSubmit={onSubmit} enableReinitialize>
          {({ values, handleChange, setFieldValue }) => (
            <Form className="p-4 space-y-4">
              <div
                className="menu-settings fixed right-0 top-0 z-30 h-full w-[350px] bg-black bg-opacity-90 text-white shadow-lg border-l border-white/20 overflow-scroll"
                onMouseDown={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                onDoubleClick={(e) => e.stopPropagation()}
              >
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
                    label={t('title')}
                    name="text"
                    value={values.text}
                    maxLength={20}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('text', e.target.value);
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
                  <ColorSelector
                    label={`${t('colors')} (${t('heart')})`}
                    value={Array.isArray(values.heartColor) ? values.heartColor : []}
                    onChange={(newColors) => {
                      onUpdate('heartColor', newColors);
                    }}
                    max={5}
                  />
                  <ColorSelector
                    label={`${t('colors')} (${t('floating_heart')})`}
                    value={Array.isArray(values.snowColor) ? values.snowColor : []}
                    onChange={(newColors) => {
                      onUpdate('snowColor', newColors);
                    }}
                    max={5}
                  />
                  <FormItem
                    label={t('button_color')}
                    name="buttonColor"
                    type="color"
                    value={values.buttonColor}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('buttonColor', e.target.value);
                    }}
                  />
                  <FormItem
                    label={t('d_heart')}
                    name="modelColor"
                    type="color"
                    value={values.modelColor}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('modelColor', e.target.value);
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

                  {/* Upload Audio File */}
                  <div>
                    <label className="block mt-2 text-sm text-white">{t('upload_audio')}</label>
                    <div className="mt-2 flex items-center text-sm text-white">
                      <input
                        name="audioFile"
                        type="file"
                        ref={fileInputRef}
                        accept="audio/mpeg"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          setFieldValue('audioFile', file || null);
                          onUpdate('audioFile', file ? URL.createObjectURL(file) : null);
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

                  <FormSlug label={`${t('slug')} (${t('optional')})`} name="slug" />

                  <button
                    type="submit"
                    className="w-full bg-gray-500 py-2 rounded hover:bg-gray-600 transition"
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
