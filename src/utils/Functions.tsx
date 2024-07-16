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

export type DimensionsType = {
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

export function marchSquare(
  startX: number,
  startY: number,
  imageData: ImageData,
  threshold: number,
  visited: boolean[]
) {
  const { width, data } = imageData;
  const vertices = [];
  let x = startX,
    y = startY;

  do {
    const index = (y * width + x) * 4;
    const v0: any = data[index] > threshold;
    const v1: any = data[index + 4] > threshold;
    const v2: any = data[index + width * 4] > threshold;
    const v3: any = data[index + (width + 1) * 4] > threshold;

    let caseIndex = (v0 << 3) | (v1 << 2) | (v2 << 1) | v3;
    switch (caseIndex) {
      case 1:
      case 14:
        x += 1; // Move right
        break;
      case 2:
      case 13:
        y += 1; // Move down
        break;
      case 4:
      case 11:
        x -= 1; // Move left
        break;
      case 8:
      case 7:
        y -= 1; // Move up
        break;
      case 3:
      case 12:
        x += 1;
        break;
      case 6:
      case 9:
        y += 1;
        break;
      case 5:
        x += 1;
        break;
      case 10:
        y += 1;
        break;
    }
    vertices.push([x, y]);
    visited[y * width + x] = true;
  } while (x !== startX || y !== startY);

  return vertices;
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

export function fillEmptySpaces(
  vertices: VertexType[],
  maxDistance: number = 1
) {
  let filledVertices = [];

  // Iterate through existing vertices
  for (let i = 0; i < vertices.length; i++) {
    filledVertices.push(vertices[i]); // Add existing vertex

    // Calculate distance to the next vertex (looping around)
    let nextIndex = (i + 1) % vertices.length;
    let dx = vertices[nextIndex].x - vertices[i].x;
    let dy = vertices[nextIndex].y - vertices[i].y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    // Calculate how many vertices to interpolate
    let numVertices = Math.ceil(distance / maxDistance);

    if (numVertices > 1) {
      // Interpolate vertices
      let stepX = dx / numVertices;
      let stepY = dy / numVertices;
      for (let j = 1; j < numVertices; j++) {
        let interpolatedX = vertices[i].x + j * stepX;
        let interpolatedY = vertices[i].y + j * stepY;
        filledVertices.push({
          x: Math.round(interpolatedX),
          y: Math.round(interpolatedY),
        });
      }
    }
  }

  return filledVertices;
}

export function traceImage(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement
): VertexType[] {
  const cv = window.cv;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return [];
  }

  const src = cv.imread(canvas);
  const gray = new cv.Mat();
  const edges = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
  cv.Canny(gray, edges, 100, 200, 3, false);

  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();

  cv.findContours(
    edges,
    contours,
    hierarchy,
    cv.RETR_TREE,
    cv.CHAIN_APPROX_SIMPLE
  );

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height); // Redraw resized image

  let allVertices: VertexType[] = [];
  for (let i = 0; i < contours.size(); ++i) {
    const contour = contours.get(i);
    for (let j = 0; j < contour.data32S.length; j += 2) {
      allVertices.push({ x: contour.data32S[j], y: contour.data32S[j + 1] });
    }
  }

  return fillEmptySpaces(allVertices);
}

export function calculatePerimeter(vertices: VertexType[]) {
  let totalLength = 0;
  for (let i = 1; i < vertices.length; i++) {
    const dx = vertices[i].x - vertices[i - 1].x;
    const dy = vertices[i].y - vertices[i - 1].y;
    totalLength += Math.sqrt(dx * dx + dy * dy);
  }
  const dx = vertices[0].x - vertices[vertices.length - 1].x;
  const dy = vertices[0].y - vertices[vertices.length - 1].y;
  totalLength += Math.sqrt(dx * dx + dy * dy);
  return totalLength;
}

export function scaleVertices4(
  vertices: VertexType[],
  widthX: number,
  heightX: number,
  widthY: number,
  heightY: number,
  numberOfVertices: number
): VertexType[] {
  // Calculate scaling factors
  const scaleX = widthY / widthX;
  const scaleY = heightY / heightX;

  // Scale and transform vertices
  const transformedVertices = vertices.map((vertex) => ({
    x: Math.round(vertex.x * scaleX),
    y: Math.round(vertex.y * scaleY),
  }));

  // Ensure there are numberOfVertices unique vertices
  if (transformedVertices.length > numberOfVertices) {
    // Reduce vertices to numberOfVertices by deduplicating
    const uniqueVertices = Array.from(
      new Set(transformedVertices.map((v) => `${v.x},${v.y}`))
    ).map((coord) => {
      const [x, y] = coord.split(',').map(Number);
      return { x, y };
    });

    return uniqueVertices;
  } else {
    // Pad with duplicates if needed
    const paddedVertices = [...transformedVertices];
    while (paddedVertices.length < numberOfVertices) {
      paddedVertices.push(
        transformedVertices[paddedVertices.length % transformedVertices.length]
      );
    }
    return paddedVertices;
  }

  // return sortVerticesClockwise(resampledVertices);
}

function interpolate(vertices: VertexType[], distance: number) {
  let length = 0;
  for (let i = 1; i < vertices.length; i++) {
    length += Math.sqrt(
      Math.pow(vertices[i].x - vertices[i - 1].x, 2) +
        Math.pow(vertices[i].y - vertices[i - 1].y, 2)
    );
  }

  let accumulatedLength = 0;
  for (let i = 1; i < vertices.length; i++) {
    let segmentLength = Math.sqrt(
      Math.pow(vertices[i].x - vertices[i - 1].x, 2) +
        Math.pow(vertices[i].y - vertices[i - 1].y, 2)
    );
    if (accumulatedLength + segmentLength >= distance) {
      let ratio = (distance - accumulatedLength) / segmentLength;
      return {
        x: vertices[i - 1].x + ratio * (vertices[i].x - vertices[i - 1].x),
        y: vertices[i - 1].y + ratio * (vertices[i].y - vertices[i - 1].y),
      };
    }
    accumulatedLength += segmentLength;
  }

  return vertices[vertices.length - 1];
}
