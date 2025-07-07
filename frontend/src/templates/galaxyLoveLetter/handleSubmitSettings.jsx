import { submitSiteConfig } from '../submitSiteConfig';

export const handleSubmitSettings = (values, user, axiosJWT, navigate) => {
  return submitSiteConfig({
    values,
    user,
    axiosJWT,
    navigate,
    productId: 'love-003',
    buildConfig: (v) => ({
      messages: Array.isArray(v.messages) ? v.messages : [],
      icons: Array.isArray(v.icons) ? v.icons : [],
      colors: Array.isArray(v.colors) ? v.colors : [],
      cropToHeart: !!v.cropToHeart,
      audioVolume: typeof v.audioVolume === 'number' ? v.audioVolume : 1,
    }),
    imageFields: ['images'],
    audioField: 'audioFile',
  });
};
