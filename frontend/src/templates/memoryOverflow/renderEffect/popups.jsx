export default function Popups({ popups, settings }) {
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
          className="z-40 bg-white rounded shadow-md overflow-hidden text-sm pointer-events-none"
        >
          <div
            className="text-white px-3 py-1 font-bold flex items-center justify-between"
            style={{
              backgroundColor: settings.commonColor,
            }}
          >
            <span
              style={{
                color: settings.popupTitleColor,
              }}
            >
              {settings.popupTitle}
            </span>
            <span className="text-xs">{settings.popupIcon}</span>
          </div>
          <div
            className="p-4 text-center font-semibold"
            style={{
              color: settings.popupContentColor,
            }}
          >
            {settings.popupContent}
          </div>
        </div>
      ))}
    </>
  );
}
