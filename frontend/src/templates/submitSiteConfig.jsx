import ROUTES from '@constants/routes';

import { userSiteAPI } from '@api/userSite';

/**
 * @param {Object} options
 * @param {Object} options.values
 * @param {Object} options.user
 * @param {Object} options.axiosJWT
 * @param {Function} options.navigate
 * @param {string} options.productId
 * @param {Function} options.buildConfig
 * @param {string[]} [options.imageFields]
 * @param {string} [options.audioField]
 * @returns {Promise<Response|null>}
 */
export async function submitSiteConfig({
  values,
  user,
  axiosJWT,
  navigate,
  productId,
  buildConfig,
  imageFields = [],
}) {
  if (!user?.id) {
    navigate(ROUTES.AUTH.SIGN_IN);
    return;
  }

  const { slug, voucher, musicId } = values;
  const config = buildConfig(values);

  const formData = new FormData();
  formData.append('musicId', musicId);
  formData.append('productId', productId);
  if (slug) formData.append('slug', slug);
  if (voucher) formData.append('voucherCode', voucher);
  formData.append('configs', JSON.stringify(config));

  imageFields.forEach((fieldName) => {
    const files = values[fieldName];
    if (Array.isArray(files)) {
      files.forEach((file) => {
        if (file instanceof File) {
          formData.append('images', file);
        }
      });
    }
  });

  try {
    const res = await userSiteAPI.createSiteConfig(axiosJWT, formData);
    return res;
  } catch {
    return null;
  }
}
