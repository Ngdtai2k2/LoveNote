import ROUTES from '@constants/routes';
import { userSiteAPI } from '@api/userSite';

export const handleSubmitSettings = async (values, user, axiosJWT, navigate) => {
  if (!user?.id) {
    navigate(ROUTES.AUTH.SIGN_IN);
    return;
  }

  const {
    popupTitle,
    popupContent,
    popupIcon,
    commonColor,
    popupTitleColor,
    popupContentColor,
    buttonText,
    slug,
  } = values;

  const config = {
    popupTitle,
    popupContent,
    popupIcon,
    commonColor,
    popupTitleColor,
    popupContentColor,
    buttonText,
  };

  const formData = new FormData();
  formData.append('productId', 'love-005');
  if (slug) formData.append('slug', slug);
  formData.append('configs', JSON.stringify(config));

  try {
    const res = await userSiteAPI.createSiteConfig(axiosJWT, formData);
    return res;
  } catch {
    return null;
  }
};
