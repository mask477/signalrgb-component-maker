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

export type VertexType = {
  x: number;
  y: number;
};

export type Dimensions = {
  width: number;
  height: number;
};

export function sortVerticesClockwise(vertices: VertexType[]) {
  const centroid = vertices.reduce(
    (acc, vertex) => ({
      x: acc.x + vertex.x / vertices.length,
      y: acc.y + vertex.y / vertices.length,
    }),
    { x: 0, y: 0 }
  );

  return vertices.sort((a, b) => {
    const angleA = Math.atan2(a.y - centroid.y, a.x - centroid.x);
    const angleB = Math.atan2(b.y - centroid.y, b.x - centroid.x);
    return angleA - angleB;
  });
}

export function calculateAspectRatio(width: number, height: number) {
  function gcd(a: number, b: number) {
    while (b) {
      [a, b] = [b, a % b];
    }
    return a;
  }

  const gcdValue = gcd(width, height);
  const aspectWidth = width / gcdValue;
  const aspectHeight = height / gcdValue;
  return { aspectWidth, aspectHeight };
}

export function transformVertices(
  vertices: VertexType[],
  source: Dimensions,
  target: Dimensions,
  numVertices: number
) {
  // Calculate the bounding box of the original vertices
  const minX = 0;
  const minY = 0;

  const originalWidth = source.width;
  const originalHeight = source.height;

  const targetWidth = target.width;
  const targetHeight = target.height;

  // Calculate scaling factors
  const scaleX = targetWidth / originalWidth;
  const scaleY = targetHeight / originalHeight;
  const scale = Math.min(scaleX, scaleY);

  // Scale and translate vertices to fit within target dimensions
  const scaledVertices = vertices.map((vertex) => ({
    x: Math.round((vertex.x - minX) * scale),
    y: Math.round((vertex.y - minY) * scale),
  }));

  // Interpolate vertices to match the desired number of vertices
  function interpolateVertices(vertices: VertexType[], numVertices: number) {
    const result = [];
    const totalLength = vertices.reduce((acc, vertex, i) => {
      if (i === 0) return acc;
      return (
        acc +
        Math.hypot(
          vertices[i].x - vertices[i - 1].x,
          vertices[i].y - vertices[i - 1].y
        )
      );
    }, 0);
    const segmentLength = totalLength / numVertices;

    let currentSegment = 0;
    let accumulatedLength = 0;
    for (let i = 0; i < numVertices; i++) {
      while (
        accumulatedLength +
          Math.hypot(
            vertices[currentSegment + 1].x - vertices[currentSegment].x,
            vertices[currentSegment + 1].y - vertices[currentSegment].y
          ) <
        segmentLength * i
      ) {
        accumulatedLength += Math.hypot(
          vertices[currentSegment + 1].x - vertices[currentSegment].x,
          vertices[currentSegment + 1].y - vertices[currentSegment].y
        );
        currentSegment++;
      }
      const t =
        (segmentLength * i - accumulatedLength) /
        Math.hypot(
          vertices[currentSegment + 1].x - vertices[currentSegment].x,
          vertices[currentSegment + 1].y - vertices[currentSegment].y
        );
      result.push({
        x: Math.round(
          vertices[currentSegment].x * (1 - t) +
            vertices[currentSegment + 1].x * t
        ),
        y: Math.round(
          vertices[currentSegment].y * (1 - t) +
            vertices[currentSegment + 1].y * t
        ),
      });
    }
    return result;
  }

  return interpolateVertices(scaledVertices, numVertices);
}
