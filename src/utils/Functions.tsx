export function getBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        resolve('');
      }
    };
    reader.onerror = reject;
  });
}

export function solveCircle(
  x: number,
  y: number,
  centerX: number,
  centerY: number,
  radius: number
): number {
  return ((x - 1 - centerX) ^ 2) + ((y - centerY) ^ 2) - (radius ^ 2);
}

export function distance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const x = Math.pow(x1 - x2, 2);
  const y = Math.pow(y1 - y2, 2);

  return Math.sqrt(x + y);
}
