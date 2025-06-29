import ROUTES from '@constants/routes';
import { userSiteAPI } from '@api/userSite';

export const handleSubmitSettings = async (values, user, axiosJWT, navigate) => {
  if (!user?.id) {
    navigate(ROUTES.AUTH.SIGN_IN);
    return;
  }

  const { messages, icons, colors, images, cropToHeart, audioVolume, slug, audioFile } = values;

  const config = {
    messages: Array.isArray(messages) ? messages : [],
    icons: Array.isArray(icons) ? icons : [],
    colors: Array.isArray(colors) ? colors : [],
    cropToHeart: !!cropToHeart,
    audioVolume: typeof audioVolume === 'number' ? audioVolume : 1,
  };

  const formData = new FormData();
  formData.append('productId', 'love-003');
  if (slug) formData.append('slug', slug);
  formData.append('configs', JSON.stringify(config));

  if (Array.isArray(images)) {
    images.forEach((imgFile) => {
      if (imgFile instanceof File) {
        formData.append('images', imgFile);
      }
    });
  }

  if (audioFile instanceof File) {
    formData.append('file', audioFile);
  }

  try {
    const res = await userSiteAPI.createSiteConfig(axiosJWT, formData);
    return res;
  } catch {
    return null;
  }
};
