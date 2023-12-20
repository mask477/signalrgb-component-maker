import React, { ChangeEventHandler, useEffect, useMemo, useState } from 'react';
import { Form, Row } from 'react-bootstrap';
import Field from './Field';
import Grid from './Grid';

/**
 * 
 * @returns {
    "ProductName": "Product’s actual name",
    "DisplayName": "The name SignalRGB displays for the product",
    "Brand": "Put the device brand here.",
    "Type": "Tells SignalRGB what type of device this is. (Fan, AIO, etc.)",
    "LedCount": Insert number of LEDS here.,
    "Width": Width on SignalRGB’s canvas,
    "Height": Height on SignalRGB’s Canvas,
    "LedMapping": [
        0,1,2,3,4,5,6,7,8,9,10
    ],
    "LedCoordinates": [
        [1,2],[2,1],[3,0],[4,0],[5,2],[6,3],[5,4],[4,5],[3,3],[3,4],[1,3]
    ],
    "LedNames": [
        "Led1",
        "Led2",
        "Led3",
        "Led4",
        "Led5",
        "Led6",
        "Led7",
        "Led8",
        "Led9",
        "Led10",
        "Led11"
    ],
    "Image": "The image of the device goes here. The image needs encoded into base 64.""
}
 */

const placeholders: any = {
  ProductName: 'Product’s actual name',
  DisplayName: 'The name SignalRGB displays for the product',
  Brand: 'The device brand.',
  Type: 'Tells SignalRGB what type of device this is. (Fan, AIO, etc.)',
  LedCount: 'Insert number of LEDS here.',
  Width: 'Width on SignalRGB’s canvas',
  Height: 'Height on SignalRGB’s Canvas',
  Image:
    'The image of the device goes here. The image needs encoded into base 64.',
};

export default function ComponentForm() {
  const [component, setComponent] = useState({
    ProductName: '',
    DisplayName: '',
    Brand: '',
    Type: '',
    LedCount: 1,
    Width: 1,
    Height: 1,
    LedMapping: [],
    LedCoordinates: [],
    LedNames: [],
    Image: null,
  });

  useEffect(() => {
    console.log(component);
  }, [component]);

  const formFields = [
    {
      name: 'ProductName',
      label: 'Product Name',
      placeholder: 'Product’s actual name',
    },
    {
      name: 'DisplayName',
      label: 'Display Name',
      placeholder: 'The name SignalRGB displays for the product',
    },
    {
      name: 'Brand',
      label: 'Brand',
      placeholder: 'The device brand',
    },
    {
      name: 'Type',
      label: 'Type',
      placeholder:
        'Tells SignalRGB what type of device this is. (Fan, AIO, etc.)',
    },
    {
      name: 'LedCount',
      label: 'Led Count',
      placeholder: 'Insert number of LEDS here.',
      type: 'number',
      width: 'col-md-4',
    },
    {
      name: 'Width',
      label: 'Width',
      placeholder: 'Width on SignalRGB’s canvas',
      type: 'number',
      width: 'col-md-4',
    },
    {
      name: 'Height',
      label: 'Height',
      placeholder: 'Height on SignalRGB’s canvas',
      type: 'number',
      width: 'col-md-4',
    },
  ];

  const onChangeHandler = (e: any) => {
    const { target } = e;
    const { name, value } = target;

    setComponent({ ...component, [name]: value });
  };

  return (
    <div className="card">
      <div className="card-body">
        <Form>
          <div className="row">
            {formFields.map((field, idx) => (
              <Field key={idx} {...field} onChange={onChangeHandler} />
            ))}
          </div>
          <Grid
            leds={component.LedCount}
            width={component.Width}
            height={component.Height}
          />
        </Form>
      </div>
    </div>
  );
}
