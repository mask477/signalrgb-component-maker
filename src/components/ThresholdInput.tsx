import React, { ChangeEvent, useCallback, useRef } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { useComponent } from '../context/ComponentContext';

export default function ThresholdInput() {
  const { shapeThreshold, setShapeThreshold } = useComponent();

  const onThresholdChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    let { value } = target;

    if (parseFloat(value)) {
      setShapeThreshold(parseFloat(value));
    }
  };

  return (
    <InputGroup>
      <InputGroup.Text>Threshold:</InputGroup.Text>
      <Form.Control
        type="number"
        step="0.1"
        min={0}
        onChange={onThresholdChangeHandler}
        value={shapeThreshold}
        size="sm"
        style={{ width: 100 }}
      />
      <InputGroup.Text>%</InputGroup.Text>
    </InputGroup>
  );
}
