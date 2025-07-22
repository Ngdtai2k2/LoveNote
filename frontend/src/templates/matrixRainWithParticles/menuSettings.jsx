import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Formik, Form } from 'formik';
import { IconButton } from '@material-tailwind/react';
import { Cog6ToothIcon } from '@heroicons/react/24/solid';

import { useAxios } from '@hooks/useAxiosJWT';
import { useCurrentUser } from '@hooks/useCurrentUser';
import { useProductBySlug } from '@hooks/useProductBySlug';
import { useSettingsFormHandler } from '@hooks/useSettingsFormHandler';

import helperFunctions from '@helpers';

import FormItem from '../components/formItem';
import FormArea from '../components/formArea';
import FormSlug from '../components/formSlug';
import FormRange from '../components/formRange';
import FormSelect from '../components/formSelect';
import FormVoucher from '../components/formVoucher';
import FormCheckbox from '../components/formCheckbox';
import TopLeftControl from '../components/topLeftControl';

import { handleSubmitSettings } from './handleSubmitSettings';
import ModalRenderLink from '../modalRenderLink';

import MUSIC_DEMO from '../assets/musics/music_background_005.mp3';

export default function MenuSettings({ settings, onUpdate }) {
  const [openSettings, setOpenSettings] = useState(false);
  const [audioName, setAudioName] = useState();
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

  // get product information
  const product = useProductBySlug();

  const transformValues = (values) => ({
    ...values,
    wordList: helperFunctions.deserializeItems(values.wordList, ' ; '),
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
                    label={t('template:letters')}
                    name="letters"
                    value={values.letters}
                    maxLength={50}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('letters', e.target.value);
                    }}
                  />
                  <FormItem
                    label={t('template:text_color')}
                    name="rainTextColor"
                    type="color"
                    value={values.rainTextColor}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('rainTextColor', e.target.value);
                    }}
                  />
                  <FormItem
                    label={t('template:background_color')}
                    name="backgroundColor"
                    type="color"
                    value={values.backgroundColor}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('backgroundColor', e.target.value);
                    }}
                  />
                  <FormRange
                    label={t('template:font_size_text_rain')}
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
                    label={t('template:title')}
                    name="title"
                    value={values.title}
                    maxLength={20}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('title', e.target.value);
                    }}
                  />
                  <FormArea
                    label={`${t('template:words')} ; ${t('template:step')}`}
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
                    label={t('template:text_color')}
                    name="textColor"
                    type="color"
                    value={values.textColor}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('textColor', e.target.value);
                    }}
                  />

                  <FormRange
                    label={t('template:font_size_text')}
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
                    label={t('template:loop')}
                    name="loop"
                    checked={values.loop}
                    onChange={(e) => {
                      handleChange(e);
                      onUpdate('loop', e.target.checked);
                    }}
                  />

                  <FormSelect
                    label={t('template:font_family')}
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

                  <FormSlug
                    label={`${t('template:slug')} (${t('template:optional')})`}
                    name="slug"
                  />

                  <FormVoucher
                    label={t('template:voucher')}
                    name="voucher"
                    price={product?.price}
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
    </div>
  );
}
