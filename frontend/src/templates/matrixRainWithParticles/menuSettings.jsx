import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { IconButton } from '@material-tailwind/react';
import { Cog6ToothIcon } from '@heroicons/react/24/solid';
import { Formik, Form } from 'formik';

import { useAxios } from '@hooks/useAxiosJWT';
import { useCurrentUser } from '@hooks/useCurrentUser';

import helperFunctions from '@helpers';

import { FormItem } from '../components/formItem';
import { FormRange } from '../components/formRange';
import { FormArea } from '../components/formArea';
import { FormSelect } from '../components/formSelect';
import FormSlug from '../components/formSlug';
import TopLeftControl from '../components/topLeftControl';
import { FormCheckbox } from '../components/formCheckbox';

import { handleSubmitSettings } from './handleSubmitSettings';
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
    letters: settings.letters,
    loop: settings.loop,
    rainFontSize: settings.rainFontSize,
    wordList: helperFunctions.serializeItems(settings.wordList, ' ; '),
    title: settings.title,
    textFontSize: settings.textFontSize,
    backgroundColor: settings.backgroundColor,
    textColor: settings.textColor,
    rainTextColor: settings.rainTextColor,
    fontFamily: settings.fontFamily,
    audioVolume: settings.audioVolume,
    audioFile: '',
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
    const cleanedValues = {
      ...values,
      wordList: helperFunctions.deserializeItems(values.wordList, ' ; '),
    };
    const res = await handleSubmitSettings(cleanedValues, user, axiosJWT, navigate);
    if (res) {
      const path = res.data.slug;
      setSitePath(path);
      setModalOpen(true);
    }
  };

  return (
    <div>
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
          {({ values, handleChange, setFieldValue }) => (
            <Form className="p-4 space-y-4">
              <div className="menu-settings fixed right-0 top-0 z-30 h-full w-[350px] bg-black bg-opacity-90 text-white shadow-lg border-l border-white/20 overflow-scroll">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <h2 className="text-lg font-semibold">{t('settings')}</h2>
                  <button
                    onClick={() => setOpenSettings(false)}
                    className="text-white hover:text-red-500"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-4 space-y-4">
                  <FormItem
                    label={t('letters')}
                    name="letters"
                    value={values.letters}
                    maxLength={50}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('letters', e.target.value);
                    }}
                  />
                  <FormItem
                    label={t('text_color')}
                    name="rainTextColor"
                    type="color"
                    value={values.rainTextColor}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('rainTextColor', e.target.value);
                    }}
                  />
                  <FormItem
                    label={t('background_color')}
                    name="backgroundColor"
                    type="color"
                    value={values.backgroundColor}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('backgroundColor', e.target.value);
                    }}
                  />
                  <FormRange
                    label={t('font_size_text_rain')}
                    name="rainFontSize"
                    min={5}
                    max={30}
                    step={1}
                    value={values.rainFontSize}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('rainFontSize', Number(e.target.value));
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
                  <FormArea
                    label={`${t('words')} ; ${t('step')}`}
                    name="wordList"
                    value={values.wordList}
                    as="textarea"
                    rows={5}
                    onChange={(e) => {
                      handleChange(e);
                      const arr = helperFunctions.deserializeItems(e.target.value);
                      onUpdate('wordList', arr);
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

                  <FormRange
                    label={t('font_size_text')}
                    name="textFontSize"
                    min={50}
                    max={200}
                    step={5}
                    value={values.textFontSize}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('textFontSize', Number(e.target.value));
                    }}
                  />

                  <FormCheckbox
                    label={t('loop')}
                    name="loop"
                    checked={values.loop}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('loop', e.target.checked);
                    }}
                  />

                  <FormSelect
                    label={t('font_family')}
                    name="fontFamily"
                    value={values.fontFamily}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('fontFamily', e.target.value);
                    }}
                    options={[
                      { value: 'Tektur', label: 'Tektur' },
                      { value: 'Raleway', label: 'Raleway' },
                      { value: 'Bitcount Grid Double', label: 'Bitcount Grid Double' },
                    ]}
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
    </div>
  );
}
