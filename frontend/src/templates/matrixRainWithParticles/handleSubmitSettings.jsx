import ROUTES from '@constants/routes';
import { userSiteAPI } from '@api/userSite';

export const handleSubmitSettings = async (values, user, axiosJWT, navigate) => {
  if (!user?.id) {
    navigate(ROUTES.AUTH.SIGN_IN);
    return;
  }

  const {
    letters,
    rainTextColor,
    rainFontSize,
    words,
    fontFamily,
    textColor,
    textFontSize,
    loop,
    backgroundColor,
    audioVolume,
    slug,
    audioFile,
  } = values;

  const config = {
    letters,
    rainTextColor,
    rainFontSize,
    words,
    fontFamily,
    textColor,
    textFontSize,
    loop,
    backgroundColor,
    audioVolume,
  };

  const formData = new FormData();
  formData.append('productId', 'love-004');
  if (slug) formData.append('slug', slug);
  formData.append('configs', JSON.stringify(config));
  if (audioFile instanceof File) {
    formData.append('audio', audioFile);
  }

  try {
    const res = await userSiteAPI.createSiteConfig(axiosJWT, formData);
    return res;
  } catch {
    return null;
  }
};
