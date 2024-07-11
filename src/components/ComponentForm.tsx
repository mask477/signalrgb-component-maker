import React, {
  ChangeEvent,
  ChangeEventHandler,
  SyntheticEvent,
  useRef,
  useState,
} from 'react';
import { Button, Form } from 'react-bootstrap';
import { useComponent } from '../context/ComponentContext';
import Field from './Field';
import Grid from './Grid';
import ImageUpload from './ImageUpload';

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

  const formRef = useRef<HTMLFormElement>(null);

  const formFields: FormFieldType[] = [
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

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    let { name, value } = target;

    const field = formFields.find((field) => field.name === name);

    if (field && field.type === 'number') {
      setComponent({ ...component, [name]: parseInt(value) });
    } else {
      setComponent({ ...component, [name]: value });
    }
  };

  const onSubmitHandler = (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();

    const json: any = {
      ...component,
      LedMapping: component.LedCoordinates.map((_: number[], i: number) => i),
      LedNames: component.LedCoordinates.map(
        (_: number[], i: number) => `Led${i}`
      ),
    };
    console.log('json:', json);

    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(json, null, 1)
    )}`;
    console.log('json:', jsonString);

    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `${json.DisplayName}.json`;

    link.click();
  };

  return (
    <div className="card">
      <div className="card-body">
        <Form onSubmit={onSubmitHandler} ref={formRef}>
          <div className="row">
            {formFields.map((field, idx) => (
              <Field key={idx} {...field} onChange={onChangeHandler} />
            ))}
          </div>
          <Grid />
          <ImageUpload />
          <div className="d-grid">
            <Button type="submit">Lesss Go!!!</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
