import { submitSiteConfig } from '../submitSiteConfig';

export const handleSubmitSettings = (values, user, axiosJWT, navigate) => {
  return submitSiteConfig({
    values,
    user,
    axiosJWT,
    navigate,
    productId: 'love-001',
    buildConfig: (v) => ({
      textRain: v.textRain,
      fontSize: v.fontSize,
      textColor: v.textColor,
      title: v.title,
      titleColor: v.titleColor,
      fontSizeTitle: v.fontSizeTitle,
      backgroundOpacity: v.backgroundOpacity,
      backgroundHex: v.backgroundHex,
      rainSpeed: v.rainSpeed,
      textPerClick: v.textPerClick,
      autoBurst: v.autoBurst,
      audioVolume: typeof v.audioVolume === 'number' ? v.audioVolume : 1,
    }),
  });
};
