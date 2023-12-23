import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type ComponentType = {
  ProductName: string;
  DisplayName: string;
  Brand: string;
  Type: string;
  LedCount: number;
  Width: number;
  Height: number;
  LedMapping: number[];
  LedCoordinates: any;
  LedNames: string[];
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

type ComponentContextType = {
  component: ComponentType;
  setComponent: Function;
  LedsUsed: number;
  grid: GridItemType[][];
  setGrid: Function;
  mapLed: Function;
  focusedInput: FocusedInputType;
  setFocusedInput: Function;
  mapShape: Function;
  setImage: Function;
};

const ComponentContext = createContext<ComponentContextType>({
  component: {
    ProductName: '',
    DisplayName: '',
    Brand: '',
    Type: '',
    LedCount: 1,
    Width: 1,
    Height: 1,
    LedMapping: [0],
    LedCoordinates: [],
    LedNames: [],
    Image: '',
  },
  setComponent: () => {},
  LedsUsed: 0,
  grid: [
    [
      {
        led: -1,
        x: 1,
        y: 0,
      },
    ],
  ],
  setGrid: () => {},
  mapLed: () => {},
  focusedInput: {
    x: -1,
    y: -1,
  },
  setFocusedInput: () => {},
  mapShape: () => {},
  setImage: () => {},
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
    Width: 1,
    Height: 1,
    LedMapping: [0],
    LedCoordinates: [],
    LedNames: [],
    Image: '',
  });
  const [grid, setGrid] = useState<GridItemType[][]>([
    [
      {
        led: -1,
        x: 1,
        y: 0,
      },
    ],
  ]);
  const [focusedInput, setFocusedInput] = useState<FocusedInputType>({
    x: -1,
    y: -1,
  });

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
            x: newGrid[y].length + x + 1,
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
      let newGridItem = { ...grid[y][x - 1] };

      newGridItem.led = led;

      newGridRow[x - 1] = newGridItem;
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
    [grid]
  );

  const mapSquareOnGrid = useCallback(() => {
    const { Width, Height } = component;

    let ledNumber = 0;
    const newGrid = grid.map((row: GridItemType[], rowIndex: number) =>
      row.map((item: GridItemType, itemIndex: number) => {
        if (
          rowIndex === 0 ||
          rowIndex === Height - 1 ||
          itemIndex === 0 ||
          itemIndex === Width - 1
        ) {
          item.led = ledNumber;

          ledNumber++;
        }

        return item;
      })
    );
    setComponent({
      ...component,
      LedCount: ledNumber,
    });

    setGrid(newGrid);
  }, [component, grid]);

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

  const mapShape = useCallback(
    (shape: string) => {
      switch (shape) {
        case 'circle':
          break;
        case 'square':
          mapSquareOnGrid();
          break;
        case 'clear':
          clearGrid();
          break;
        case 'clockwise':
          shiftLedsClockWise();
          break;
        case 'anti-clockwise':
          shiftLedsAntiClockWise();
          break;
      }
    },
    [clearGrid, mapSquareOnGrid, shiftLedsAntiClockWise, shiftLedsClockWise]
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
      mapLed,
      focusedInput,
      setFocusedInput,
      mapShape,
      setImage,
    }),
    [component, setImage, grid, mapLed, focusedInput, LedsUsed]
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
