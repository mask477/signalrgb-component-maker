import React, { ChangeEventHandler, useEffect, useMemo, useState } from 'react';
import { Button, Form, Row } from 'react-bootstrap';
import { useComponent } from '../context/ComponentContext';
import Field from './Field';
import Grid from './Grid';

type FormFieldType = {
  name: string;
  label: string;
  placeholder: string;
  value: any;
  type?: string;
  width?: string;
};

export default function ComponentForm() {
  const { component, setComponent } = useComponent();

  const formFields = [
    {
      name: 'ProductName',
      label: 'Product Name',
      placeholder: 'Product’s actual name',
      value: component.ProductName,
    },
    {
      name: 'DisplayName',
      label: 'Display Name',
      placeholder: 'The name SignalRGB displays for the product',
      value: component.DisplayName,
    },
    {
      name: 'Brand',
      label: 'Brand',
      placeholder: 'The device brand',
      value: component.Brand,
    },
    {
      name: 'Type',
      label: 'Type',
      placeholder:
        'Tells SignalRGB what type of device this is. (Fan, AIO, etc.)',
      value: component.Type,
    },
    {
      name: 'LedCount',
      label: 'Led Count',
      placeholder: 'Insert number of LEDS here.',
      value: component.LedCount,
      type: 'number',
      width: 'col-md-4',
    },
    {
      name: 'Width',
      label: 'Width',
      placeholder: 'Width on SignalRGB’s canvas',
      value: component.Width,
      type: 'number',
      width: 'col-md-4',
    },
    {
      name: 'Height',
      label: 'Height',
      placeholder: 'Height on SignalRGB’s canvas',
      value: component.Height,
      type: 'number',
      width: 'col-md-4',
    },
  ];

  const onChangeHandler = (e: any) => {
    console.log('onChangeHandler');

    const { target } = e;
    let { name, value } = target;

    const field = formFields.find((field) => field.name === name);
    console.log('FIELD:', field);

    if (field && field.type === 'number') {
      value = parseInt(value);
    }

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
          <Grid />
          <div className="d-grid">
            <Button size="lg" type="submit">
              Generate
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
