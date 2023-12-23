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

  const onKeyDownHandler = useCallback(
    (event: any) => {
      const { key } = event;
      if (isNaN(key) && ['ArrowUp', 'ArrowDown'].includes(key)) {
        event.preventDefault();

        switch (key) {
          case 'ArrowUp':
            setShapeThreshold(+(shapeThreshold + 0.1).toFixed(1));
            break;
          case 'ArrowDown':
            setShapeThreshold(+(shapeThreshold - 0.1).toFixed(1));
            break;
        }
      }
    },
    [setShapeThreshold, shapeThreshold]
  );

  return (
    <InputGroup>
      <InputGroup.Text>Threshold:</InputGroup.Text>
      <Form.Control
        type="number"
        min={0}
        onChange={onThresholdChangeHandler}
        value={shapeThreshold}
        onKeyDown={onKeyDownHandler}
        size="sm"
        style={{ width: 100 }}
      />
      <InputGroup.Text>%</InputGroup.Text>
    </InputGroup>
  );
}
