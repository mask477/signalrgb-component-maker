import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { distance, sortCircle, VertexType } from '../utils/Functions';

type ComponentType = {
  ProductName: string;
  DisplayName: string;
  Brand: string;
  Type: string;
  LedCount: number;
  Width: number;
  Height: number;
  LedCoordinates: any;
  Image: string;
};

export type GridItemType = {
  led: number;
  x: number;
  y: number;
};

type FocusedInputType = {
  x: number;
  y: number;
};

export enum Shape {
  None = 'none',
  Circle = 'circle',
  Square = 'square',
  Custom = 'custom',
}

type ComponentContextType = {
  component: ComponentType;
  setComponent: Function;
  LedsUsed: number;
  grid: GridItemType[][];
  setGrid: Function;
  mapVertices: Function;
  mapLed: Function;
  focusedInput: FocusedInputType;
  setFocusedInput: Function;
  shape: Shape;
  setShape: Function;
  gridAction: Function;
  shapeThreshold: number;
  setShapeThreshold: Function;
  setImage: Function;
  shapeImage: HTMLImageElement;
  setShapeImage: Function;
};

const ComponentContext = createContext<ComponentContextType>({
  component: {
    ProductName: '',
    DisplayName: '',
    Brand: '',
    Type: '',
    LedCount: 8,
    Width: 10,
    Height: 10,
    LedCoordinates: [],
    Image: '',
  },
  setComponent: () => {},
  LedsUsed: 0,
  grid: [
    [
      {
        led: -1,
        x: 0,
        y: 0,
      },
    ],
  ],
  setGrid: () => {},
  mapVertices: () => {},
  mapLed: () => {},
  focusedInput: {
    x: -1,
    y: -1,
  },
  setFocusedInput: () => {},
  shape: Shape.None,
  setShape: () => {},
  gridAction: () => {},
  shapeThreshold: 3,
  setShapeThreshold: () => {},
  setImage: () => {},
  shapeImage: new Image(),
  setShapeImage: () => {},
});

export function ComponentContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [component, setComponent] = useState<ComponentType>({
    ProductName: '',
    DisplayName: '',
    Brand: '',
    Type: '',
    LedCount: 1,
    Width: 10,
    Height: 10,
    LedCoordinates: [],
    Image: '',
  });
  const [grid, setGrid] = useState<GridItemType[][]>([
    [
      {
        led: -1,
        x: 0,
        y: 0,
      },
    ],
  ]);
  const [shape, setShape] = useState<Shape>(Shape.None);
  const [shapeThreshold, setShapeThreshold] = useState<number>(3);
  const [focusedInput, setFocusedInput] = useState<FocusedInputType>({
    x: -1,
    y: -1,
  });

  const [shapeImage, setShapeImage] = useState<HTMLImageElement>(new Image());

  useEffect(() => {
    const newComponent = {
      ...component,
      LedMapping: Array.from({ length: component.LedCount }, (_, i) => i),
      LedNames: Array.from(
        { length: component.LedCount },
        (_, i) => `Led${i + 1}`
      ),
      LedCoordinates: Array.from({ length: component.LedCount }, (_, i) => [
        0, 0,
      ]),
    };

    setComponent(newComponent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [component.LedCount]);

  useEffect(() => {
    const { Width, Height } = component;

    let newGrid = [...grid];

    if (Height < grid.length) {
      newGrid = newGrid.slice(0, Height);
    } else if (Height > grid.length) {
      newGrid = [
        ...newGrid,
        ...Array.from({ length: Height - grid.length }, () => []),
      ];
    }

    for (let y = 0; y < Height; y++) {
      if (Width < newGrid[y].length) {
        newGrid[y] = newGrid[y].slice(0, Width);
      } else if (Width > newGrid[y].length) {
        newGrid[y] = [
          ...newGrid[y],
          ...Array.from({ length: Width - newGrid[y].length }, (_, x) => ({
            led: -1,
            x: newGrid[y].length + x,
            y,
          })),
        ];
      }
    }

    setGrid(newGrid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [component.Width, component.Height]);

  const LedsUsed = useMemo(() => {
    let leds = 0;
    grid.map((row) =>
      row.map((item) => {
        if (item.led !== -1) {
          leds++;
        }
        return null;
      })
    );
    return leds;
  }, [grid]);

  useEffect(() => {
    const flatGrid = grid
      .flat()
      .filter((a: GridItemType) => a.led !== -1)
      .sort((a: GridItemType, b: GridItemType) => a.led - b.led);

    setComponent({
      ...component,
      LedCoordinates: flatGrid.map((item) => [item.x, item.y]),
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid]);

  const mapLed = useCallback(
    (x: number, y: number, led: number) => {
      let newGrid = [...grid];
      let newGridRow = [...grid[y]];
      let newGridItem = { ...grid[y][x] };

      newGridItem.led = led;

      newGridRow[x] = newGridItem;
      newGrid[y] = newGridRow;

      setGrid(newGrid);
      const { LedCount } = component;

      if (led + 1 > LedCount) {
        setComponent({
          ...component,
          LedCount: led + 1,
        });
      }
    },
    [component, grid]
  );

  const clearGrid = useCallback(() => {
    setGrid(
      grid.map((row) =>
        row.map((item) => {
          item.led = -1;
          return item;
        })
      )
    );
  }, [grid]);

  const mapSquareOnGrid = useCallback(() => {
    const { Width, Height } = component;

    clearGrid();

    let topRowLeds = [];
    let rightColumnLeds = [];
    let bottomRowLeds = [];
    let leftColumnLeds = [];

    for (let y = 0; y < Height; y++) {
      for (let x = 0; x < Width; x++) {
        if (y === 0) {
          topRowLeds.push({ x, y });
        } else if (y === Height - 1) {
          bottomRowLeds.unshift({ x, y });
        } else if (x === 0) {
          leftColumnLeds.unshift({ x, y });
        } else if (x === Width - 1) {
          rightColumnLeds.push({ x, y });
        }
      }
    }

    const ledSequence = [
      ...topRowLeds,
      ...rightColumnLeds,
      ...bottomRowLeds,
      ...leftColumnLeds,
    ];

    let ledNumber = 0;
    let newGrid = [...grid];

    ledSequence.forEach((led): void => {
      const { x, y } = led;
      newGrid[y][x].led = ledNumber;
      ledNumber++;
    });

    setComponent({
      ...component,
      LedCount: ledNumber,
    });

    setGrid(newGrid);
  }, [clearGrid, component, grid]);

  const mapCircleOnGrid = useCallback(() => {
    if (grid.flat().length < 4) {
      return;
    }

    const { Width, Height } = component;

    let radius: number = Width <= Height ? (Width - 1) / 2 : (Height - 1) / 2;
    let centerX: number = (Width - 1) / 2;
    let centerY: number = (Height - 1) / 2;

    clearGrid();

    let ledNumber = 0;
    const newGrid = grid.map((row) =>
      row.map((item) => {
        const { x, y } = item;

        const solution = distance(x, y, centerX, centerY);

        const size = Width <= Height ? Width : Height;
        const radiusPercent = (size / 100) * shapeThreshold;
        if (
          solution >= radius - radiusPercent &&
          solution <= radius + radiusPercent
        ) {
          item.led = ledNumber;
          ledNumber++;
        }
        return item;
      })
    );
    const filteredGrid = newGrid.flat().filter((item) => item.led !== -1);

    ledNumber = 0;
    let sortedGrid = sortCircle(filteredGrid, { x: centerX, y: centerY }).map(
      (item) => {
        item.led = ledNumber++;

        return item;
      }
    );

    setGrid(
      newGrid.map((row, rowIdx) =>
        row.map((item, itemIdx) => {
          const { x, y } = item;
          const sortedItem = sortedGrid.find(
            (e) => e.x === x && e.y === item.y
          );

          if (sortedItem) {
            item.led = sortedItem.led;
          }
          return item;
        })
      )
    );

    setComponent({
      ...component,
      LedCount: ledNumber,
    });
  }, [clearGrid, component, grid, shapeThreshold]);

  const mapVertices = useCallback(
    (vertices: VertexType[]) => {
      setGrid(
        grid.map((row, y) =>
          row.map((cell, x) => ({
            ...cell,
            led: vertices.findIndex(
              (vertex: VertexType) =>
                Math.floor(vertex.x) === x && Math.floor(vertex.y) === y
            ),
          }))
        )
      );
    },
    [grid]
  );

  useEffect(() => {
    switch (shape) {
      case Shape.Circle:
        mapCircleOnGrid();
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shapeThreshold]);

  const shiftLedsClockWise = useCallback(() => {
    const newGrid = grid
      .flat()
      .filter((a: GridItemType) => a.led !== -1)
      .sort((a: GridItemType, b: GridItemType) => a.led - b.led);

    const leds = newGrid.map((item) => item.led);
    const firstLed = leds[0];

    leds.shift();
    leds.push(firstLed);

    newGrid.map((item, index) => (item.led = leds[index]));

    setGrid(
      grid.map((row: GridItemType[]): GridItemType[] =>
        row.map((item: GridItemType): GridItemType => {
          const { x, y } = item;
          const shiftedItem = newGrid.find(
            (e: GridItemType) => e.x === x && e.y === y
          );

          if (shiftedItem) {
            item.led = shiftedItem.led;
          }

          return item;
        })
      )
    );
  }, [grid]);

  const shiftLedsAntiClockWise = useCallback(() => {
    const newGrid: GridItemType[] = grid
      .flat()
      .filter((a: GridItemType) => a.led !== -1)
      .sort((a: GridItemType, b: GridItemType) => a.led - b.led);

    const leds = newGrid.map((item) => item.led);
    const lastLed = leds[leds.length - 1];

    leds.pop();
    leds.unshift(lastLed);

    newGrid.map((item, index) => (item.led = leds[index]));

    setGrid(
      grid.map((row: GridItemType[]): GridItemType[] =>
        row.map((item: GridItemType): GridItemType => {
          const { x, y } = item;
          const shiftedItem = newGrid.find(
            (e: GridItemType) => e.x === x && e.y === y
          );

          if (shiftedItem) {
            item.led = shiftedItem.led;
          }

          return item;
        })
      )
    );
  }, [grid]);

  const reverseLedMapping = useCallback(() => {
    const newGrid: GridItemType[] = grid
      .flat()
      .filter((a: GridItemType) => a.led !== -1)
      .sort((a: GridItemType, b: GridItemType) => a.led - b.led);

    const leds = newGrid.map((item) => item.led).reverse();
    newGrid.map((item, index) => (item.led = leds[index]));

    setGrid(
      grid.map((row: GridItemType[]): GridItemType[] =>
        row.map((item: GridItemType): GridItemType => {
          const { x, y } = item;
          const reversedItem = newGrid.find(
            (e: GridItemType) => e.x === x && e.y === y
          );

          if (reversedItem) {
            item.led = reversedItem.led;
          }

          return item;
        })
      )
    );
  }, [grid]);

  const gridAction = useCallback(
    (action: string) => {
      switch (action) {
        case Shape.Circle:
          setShape(Shape.Circle);
          mapCircleOnGrid();
          break;
        case Shape.Square:
          setShape(Shape.Square);
          mapSquareOnGrid();
          break;
        case Shape.Custom:
          setShape(Shape.Custom);
          clearGrid();
          break;
        case 'clear':
          setShape(Shape.None);
          clearGrid();
          break;
        case 'clockwise':
          shiftLedsClockWise();
          break;
        case 'anti-clockwise':
          shiftLedsAntiClockWise();
          break;
        case 'reverse':
          reverseLedMapping();
          break;
      }
    },
    [
      clearGrid,
      mapCircleOnGrid,
      mapSquareOnGrid,
      reverseLedMapping,
      shiftLedsAntiClockWise,
      shiftLedsClockWise,
    ]
  );

  const setImage = useCallback(
    (image: string) => {
      setComponent({
        ...component,
        Image: image,
      });
    },
    [component]
  );

  const context = useMemo(
    () => ({
      component,
      setComponent,
      LedsUsed,
      grid,
      setGrid,
      mapVertices,
      shape,
      setShape,
      mapLed,
      focusedInput,
      setFocusedInput,
      gridAction,
      shapeThreshold,
      setShapeThreshold,
      setImage,
      shapeImage,
      setShapeImage,
    }),
    [
      component,
      LedsUsed,
      grid,
      mapVertices,
      shape,
      mapLed,
      focusedInput,
      gridAction,
      shapeThreshold,
      setImage,
      shapeImage,
      setShapeImage,
    ]
  );

  return (
    <ComponentContext.Provider value={context}>
      {children}
    </ComponentContext.Provider>
  );
}

export default ComponentContext;

export const useComponent = () => {
  return useContext(ComponentContext);
};
