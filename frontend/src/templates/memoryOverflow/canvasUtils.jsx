export function generateTargetPoints(text, canvas) {
  const offCanvas = document.createElement('canvas');
  const offCtx = offCanvas.getContext('2d');
  offCanvas.width = canvas.width;
  offCanvas.height = canvas.height;

  const fontSize = Math.floor(window.innerWidth * 0.07);
  offCtx.font = `bold ${fontSize}px sans-serif`;
  offCtx.textAlign = 'center';
  offCtx.textBaseline = 'middle';
  offCtx.fillStyle = '#fff';
  offCtx.fillText(text, offCanvas.width / 2, offCanvas.height / 2);

  const imageData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height).data;
  const points = [];
  const step = window.innerWidth < 600 ? 4 : 3;

  for (let y = 0; y < offCanvas.height; y += step) {
    for (let x = 0; x < offCanvas.width; x += step) {
      const index = (y * offCanvas.width + x) * 4;
      const alpha = imageData[index + 3];
      if (alpha > 128) {
        points.push({ x, y });
      }
    }
  }
  return points;
}
