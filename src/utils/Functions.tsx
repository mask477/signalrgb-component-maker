import { GridItemType } from '../context/ComponentContext';

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

type CoordinateType = {
  x: number;
  y: number;
};

export function sortCircle(points: GridItemType[], center: CoordinateType) {
  return [...points].sort((a, b) => less(a, b, center));
}

function less(
  a: GridItemType,
  b: GridItemType,
  center: CoordinateType
): number {
  if (a.x - center.x >= 0 && b.x - center.x < 0) return 1;
  if (a.x - center.x < 0 && b.x - center.x >= 0) return -1;
  if (a.x - center.x === 0 && b.x - center.x === 0) {
    if (a.y - center.y >= 0 || b.y - center.y >= 0) return b.y - a.y;
    return b.y - a.y;
  }

  // compute the cross product of vectors (center -> a) x (center -> b)
  const det =
    (a.x - center.x) * (b.y - center.y) - (b.x - center.x) * (a.y - center.y);
  if (det < 0) return -1;
  if (det > 0) return 1;

  // points a and b are on the same line from the center
  // check which point is closer to the center
  const d1 =
    (a.x - center.x) * (a.x - center.x) + (a.y - center.y) * (a.y - center.y);
  const d2 =
    (b.x - center.x) * (b.x - center.x) + (b.y - center.y) * (b.y - center.y);
  return d2 - d1;
}
