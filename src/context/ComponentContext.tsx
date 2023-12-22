/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

/**
 * 
 * {
    "ProductName": "Product’s actual name",
    "DisplayName": "The name SignalRGB displays for the product",
    "Brand": "Put the device brand here.",
    "Type": "Tells SignalRGB what type of device this is. (Fan, AIO, etc.)",
    "LedCount": Insert number of LEDS here.,
    "Width": Width on SignalRGB’s canvas,
    "Height": Height on SignalRGB’s Canvas,
    "LedMapping": [
        0,1
    ],
    "LedCoordinates": [
        [1,2],[2,1]
    ],
    "LedNames": [
        "Led1",
        "Led2",
    ],
    "Image": "The image of the device goes here. The image needs encoded into base 64.""
  }
 */

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
  active: boolean;
};

type ComponentContextType = {
  component: ComponentType;
  setComponent: Function;
  setImage: Function;
  grid: GridItemType[][];
  setGrid: Function;
  mapLed: Function;
  LedsUsed: number;
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
  setImage: () => {},
  grid: [
    [
      {
        led: -1,
        x: 1,
        y: 0,
        active: false,
      },
    ],
  ],
  setGrid: () => {},
  mapLed: () => {},
  LedsUsed: 0,
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
        active: false,
      },
    ],
  ]);

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
    const { LedMapping } = newComponent;

    setComponent(newComponent);

    const newGrid = grid.map((row: GridItemType[]) =>
      row.map((item: GridItemType) => {
        const newItem = { ...item };
        const { led }: { led: number } = newItem;

        if (LedMapping.includes(led)) {
          newItem.active = true;
        } else {
          newItem.active = false;
        }

        return newItem;
      })
    );

    setGrid(newGrid);
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
            active: false,
          })),
        ];
      }
    }

    setGrid(newGrid);
    console.log('GRID:', newGrid);
    console.log('COMPONENT:', component);
  }, [component.Width, component.Height]);

  const LedsUsed = useMemo(() => {
    let leds = 0;
    grid.map((row) => {
      row.map((item) => {
        if (item.active) {
          leds++;
        }
      });
    });
    return leds;
  }, [grid]);

  useEffect(() => {
    const flatGrid = grid
      .flat()
      .filter((a: GridItemType) => a.active)
      .sort((a: GridItemType, b: GridItemType) => a.led - b.led);

    setComponent({
      ...component,
      LedCoordinates: flatGrid.map((item) => [item.x, item.y]),
    });
  }, [grid]);

  const mapLed = useCallback(
    (x: number, y: number, led: number) => {
      const { LedMapping } = component;

      let newGrid = [...grid];
      let newGridRow = [...grid[y]];
      let newGridItem = { ...grid[y][x - 1] };

      newGridItem.led = led;
      if (LedMapping.includes(led)) {
        newGridItem.active = true;
      } else {
        newGridItem.active = false;
      }

      newGridRow[x - 1] = newGridItem;
      newGrid[y] = newGridRow;

      setGrid(newGrid);
    },
    [grid]
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
      setImage,
      grid,
      setGrid,
      mapLed,
      LedsUsed,
    }),
    [grid, component]
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
