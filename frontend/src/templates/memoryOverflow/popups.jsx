import { useTranslation } from 'react-i18next';

export default function Popups({ popups }) {
  const { t } = useTranslation('template');

  return (
    <>
      {popups.map((popup) => (
        <div
          key={popup.id}
          style={{
            position: 'absolute',
            left: `${popup.left}%`,
            top: `${popup.top}%`,
            transform: 'translate(-50%, -50%)',
            animation: 'fadeOut 2.5s ease-out forwards',
            width: 220,
          }}
          className="z-40 bg-white border border-gray-500 rounded shadow-md overflow-hidden text-sm pointer-events-none"
        >
          <div className="bg-pink-300 text-white px-3 py-1 font-bold flex items-center justify-between">
            <span>{t('memory_overflow')}</span>
            <span className="text-xs">🧠</span>
          </div>
          <div className="p-4 text-center text-pink-300 font-semibold">I Miss You !</div>
        </div>
      ))}
    </>
  );
}
