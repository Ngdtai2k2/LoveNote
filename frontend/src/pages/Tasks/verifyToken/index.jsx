import React, { useEffect, useState } from 'react';

import ROUTES from '@constants/routes';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { taskAPI } from '@api/task';

import { useAxios } from '@hooks/useAxiosJWT';
import { useDocumentTitle } from '@hooks/useDocumentTitle';

import SimpleCaptcha from '@components/simpleCaptcha';

export default function VerifyTokenTask() {
  const { pathname } = useLocation();

  const token = pathname.split('/').pop();

  const [isExp, setIsExp] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const { t, i18n } = useTranslation('navbar');

  const { axiosJWT } = useAxios(i18n.language);
  const navigate = useNavigate();

  useDocumentTitle(t('navbar:verify_token'));

  const checkToken = async () => {
    if (token) {
      const exp = await taskAPI.checkVerifyTokenExp(axiosJWT, token);
      setIsExp(exp);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, axiosJWT]);

  const handleVerifyToken = async () => {
    const res = await taskAPI.verifyTokenShortLink(axiosJWT, token);
    if (res?.status === 200) {
      navigate(ROUTES.TASKS);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800"></div>
      </div>
    );
  }

  if (!isExp) {
    navigate(ROUTES.NOT_FOUND);
  }

  return (
    <div className="mt-5">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <SimpleCaptcha onCaptchaMatched={handleVerifyToken} />
        </div>
      </div>
    </div>
  );
}
