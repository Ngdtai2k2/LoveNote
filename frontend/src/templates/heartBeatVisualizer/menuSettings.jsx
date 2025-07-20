import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { IconButton } from '@material-tailwind/react';
import { Cog6ToothIcon } from '@heroicons/react/24/solid';
import { Form, Formik } from 'formik';

import { useCurrentUser } from '@hooks/useCurrentUser';
import { useAxios } from '@hooks/useAxiosJWT';

import FormSlug from '../components/formSlug';
import ColorSelector from '../components/colorSelector';
import FormItem from '../components/formCheckbox';
import FormRange from '../components/formRange';
import TopLeftControl from '../components/topLeftControl';

import handleSubmitSettings from './handleSubmitSettings';
import ModalRenderLink from '../modalRenderLink';

import MUSIC_DEMO from '../assets/musics/music_background_005.mp3';

export default function MenuSettings({ settings, onUpdate }) {
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    try {
      const res = await handleSubmitSettings(values, user, axiosJWT, navigate);
      if (res?.data) {
        const path = res.data.slug;
        setSitePath(path);
        setModalOpen(true);
      }
    } finally {
      setLoading(false);
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

      <TopLeftControl />

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

                  {/* Upload Audio File */}
                  <div>
                    <label className="block mt-2 text-sm text-white">
                      {t('template:upload_audio')}
                    </label>
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

                  <FormSlug
                    label={`${t('template:slug')} (${t('template:optional')})`}
                    name="slug"
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
              />
            </Form>
          )}
        </Formik>
      )}
    </>
  );
}
