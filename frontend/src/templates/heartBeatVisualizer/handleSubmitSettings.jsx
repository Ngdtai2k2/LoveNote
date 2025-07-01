import ROUTES from '@constants/routes';
import { userSiteAPI } from '@api/userSite';

export default function handleSubmitSettings(values, user, axiosJWT, navigate) {
  if (!user?.id) {
    navigate(ROUTES.AUTH.SIGN_IN);
    return;
  }
  const {
    text,
    textColor,
    heartColor,
    snowColor,
    modelColor,
    buttonColor,
    audioFile,
    audioVolume,
    slug,
  } = values;

  const config = {
    text,
    textColor,
    heartColor: Array.isArray(heartColor) ? heartColor : [],
    snowColor: Array.isArray(snowColor) ? snowColor : [],
    modelColor,
    buttonColor,
    audioVolume: typeof audioVolume === 'number' ? audioVolume : 1,
  };

  const formData = new FormData();
  formData.append('productId', 'love-002');
  if (slug) formData.append('slug', slug);
  formData.append('configs', JSON.stringify(config));

  if (audioFile instanceof File) {
    formData.append('audio', audioFile);
  }

  try {
    const res = userSiteAPI.createSiteConfig(axiosJWT, formData);
    return res;
  } catch {
    return null;
  }
}
