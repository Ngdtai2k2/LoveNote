import ROUTES from '@constants/routes';
import { userSiteAPI } from '@api/userSite';

export const handleSubmitSettings = async (values, user, axiosJWT, navigate) => {
  if (!user?.id) {
    navigate(ROUTES.AUTH.SIGN_IN);
    return;
  }

  const { ringTexts, heartImages, heartAudio, slug } = values;

  const config = {
    ringTexts: Array.isArray(ringTexts) ? ringTexts : [],
  };

  const formData = new FormData();
  formData.append('productId', 'love-006');
  if (slug) formData.append('slug', slug);
  formData.append('configs', JSON.stringify(config));

  if (Array.isArray(heartImages)) {
    heartImages.forEach((imgFile) => {
      if (imgFile instanceof File) {
        formData.append('images', imgFile);
      }
    });
  }

  if (heartAudio instanceof File) {
    formData.append('audio', heartAudio);
  }

  try {
    const res = await userSiteAPI.createSiteConfig(axiosJWT, formData);
    return res;
  } catch {
    return null;
  }
};
