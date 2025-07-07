import { submitSiteConfig } from '../submitSiteConfig';

export const handleSubmitSettings = (values, user, axiosJWT, navigate) => {
  return submitSiteConfig({
    values,
    user,
    axiosJWT,
    navigate,
    productId: 'love-004',
    buildConfig: (v) => ({
      letters: v.letters,
      rainTextColor: v.rainTextColor,
      rainFontSize: v.rainFontSize,
      words: v.words,
      fontFamily: v.fontFamily,
      textColor: v.textColor,
      textFontSize: v.textFontSize,
      loop: v.loop,
      backgroundColor: v.backgroundColor,
      audioVolume: typeof v.audioVolume === 'number' ? v.audioVolume : 1,
    }),
    audioField: 'audioFile',
  });
};
