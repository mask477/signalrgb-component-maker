/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  ReactNode,
  createContext,
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
  Image: null;
};
type ComponentContextType = {
  component: ComponentType;
  setComponent: Function;
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
    Image: null,
  },
  setComponent: () => {},
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
    Image: null,
  });

  useEffect(() => {
    console.log('COMPONENT:', component);
  }, [component]);

  useEffect(() => {
    setComponent({
      ...component,
      LedMapping: Array.from({ length: component.LedCount }, (_, i) => i),
      LedNames: Array.from(
        { length: component.LedCount },
        (_, i) => `Led${i + 1}`
      ),
      LedCoordinates: Array.from({ length: component.LedCount }, (_, i) => [
        0, 0,
      ]),
    });
  }, [component.LedCount]);

  const context = useMemo(
    () => ({
      component,
      setComponent,
    }),
    [component]
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
