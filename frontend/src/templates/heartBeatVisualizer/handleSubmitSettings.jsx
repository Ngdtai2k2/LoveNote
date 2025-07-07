import { submitSiteConfig } from '../submitSiteConfig';

export default function handleSubmitSettings(values, user, axiosJWT, navigate) {
  return submitSiteConfig({
    values,
    user,
    axiosJWT,
    navigate,
    productId: 'love-002',
    buildConfig: (v) => ({
      text: v.text,
      textColor: v.textColor,
      heartColor: Array.isArray(v.heartColor) ? v.heartColor : [],
      snowColor: Array.isArray(v.snowColor) ? v.snowColor : [],
      modelColor: v.modelColor,
      buttonColor: v.buttonColor,
      audioVolume: typeof v.audioVolume === 'number' ? v.audioVolume : 1,
    }),
    audioField: 'audioFile',
  });
}
