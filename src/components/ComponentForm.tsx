import React, {
  ChangeEvent,
  ChangeEventHandler,
  SyntheticEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
  const [selectedFile, setSelectedFile] = useState<any>();
  const [preview, setPreview] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

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

  const onChangeHandler = (e: any) => {
    const { target } = e;
    let { name, value } = target;

    const field = formFields.find((field) => field.name === name);

    if (field && field.type === 'number') {
      value = parseInt(value);
    }

    setComponent({ ...component, [name]: value });
  };

  const onSubmitHandler = (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();

    console.log(JSON.stringify(component, null, 1));
  };

  const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0]);
  };

  return (
    <div className="card">
      <div className="card-body">
        <Form onSubmit={onSubmitHandler}>
          <div className="row">
            {formFields.map((field, idx) => (
              <Field key={idx} {...field} onChange={onChangeHandler} />
            ))}
          </div>
          <div className="row">
            <h4>Component Image:</h4>
            <div className="col-12 d-flex flex-column justify-content-center align-items-center">
              <div className="image-container mb-4">
                {selectedFile ? (
                  <img src={preview} />
                ) : (
                  <small>Choose an Image</small>
                )}
              </div>
              <Form.Group controlId="formFileLg" className="mb-3">
                <Form.Control type="file" onChange={onSelectFile} size="lg" />
              </Form.Group>
            </div>
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
