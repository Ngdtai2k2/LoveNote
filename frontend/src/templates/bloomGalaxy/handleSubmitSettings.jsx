import { submitSiteConfig } from '../submitSiteConfig';

export const handleSubmitSettings = async (values, user, axiosJWT, navigate) => {
  console.log(values);
  return submitSiteConfig({
    values,
    user,
    axiosJWT,
    navigate,
    productId: 'love-006',
    buildConfig: (vals) => ({
      ringTexts: Array.isArray(vals.ringTexts) ? vals.ringTexts : [],
    }),
    imageFields: ['heartImages'],
  });
};
