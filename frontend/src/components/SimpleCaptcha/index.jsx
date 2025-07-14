import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';

export default function SimpleCaptcha({ onCaptchaMatched }) {
  const [errorMessage, setErrorMessage] = useState(false);

  const { t } = useTranslation('form');

  useEffect(() => {
    loadCaptchaEnginge(5);
  }, []);

  const doSubmit = () => {
    let user_captcha = document.getElementById('user_captcha_input').value;

    if (validateCaptcha(user_captcha) === true) {
      setErrorMessage(false);
      loadCaptchaEnginge(5);
      document.getElementById('user_captcha_input').value = '';

      if (onCaptchaMatched) {
        onCaptchaMatched();
      }
    } else {
      setErrorMessage(true);
      document.getElementById('user_captcha_input').value = '';
    }
  };
  return (
    <div className="flex flex-col justify-center items-center gap-1">
      <div className="mt-3">
        <LoadCanvasTemplate reloadColor="inherit" reloadText="Reload" />
      </div>
      <div className="flex flex-col">
        <div className="flex gap-1">
          <input
            placeholder={t('captcha.placeholder')}
            id="user_captcha_input"
            name="user_captcha_input"
            type="text"
            className="focus:outline-none rounded px-2 dark:bg-white/10 h-10 bg-black/10 text-[16px]"
          />
          <button
            className="rounded px-2 py-1 border border-green-400 bg-green-400 hover:bg-green-500
        hover:border-green-500 cursor-pointer text-white"
            onClick={doSubmit}
          >
            Submit
          </button>
        </div>

        {errorMessage && (
          <p className="text-red-600 text-sm italic py-1">{t('validation:incorrect_captcha')}</p>
        )}
      </div>
    </div>
  );
}
