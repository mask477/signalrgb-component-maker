import React, { ChangeEvent, useEffect } from 'react';
import {
  Alert,
  Button,
  ButtonGroup,
  Form,
  InputGroup,
  ListGroup,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import { Shape, useComponent } from '../context/ComponentContext';
import GridRowItem from './GridRowItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faCircle, faSquare } from '@fortawesome/free-regular-svg-icons';
import {
  faArrowRightArrowLeft,
  faArrowRotateLeft,
  faArrowRotateRight,
  faEraser,
} from '@fortawesome/free-solid-svg-icons';
import ThresholdInput from './ThresholdInput';
import GridControlButton from './GridControlButton';

export default function Grid() {
  const { grid, LedsUsed, gridAction, shape } = useComponent();

  const onClickActionHandler = (shape: string) => gridAction(shape);

  return (
    <>
      <h4>LED Mapping:</h4>
      <div className="card mb-3">
        <div className="card-body">
          <Alert variant="light">
            <ul>
              <li>
                <b>Usage:</b>
                <ul>
                  <li>Use arrow keys to navigate</li>
                  <li>
                    Enter the led number in the circle to map an led on the
                    desired coordinate.
                  </li>
                  <li>
                    <span
                      style={{
                        background: 'gray',
                        color: 'black',
                        paddingInline: 3,
                      }}
                    >
                      Gray
                    </span>
                    : No led has been mapped.
                  </li>
                  <li>
                    <span
                      style={{
                        background: 'yellowgreen',
                        color: 'black',
                        paddingInline: 3,
                      }}
                    >
                      Green
                    </span>
                    : The mapping is correct and the desired input led wil be
                    mapped to that coordinate.
                  </li>
                  <li>
                    <span
                      style={{
                        background: 'red',
                        color: 'black',
                        paddingInline: 3,
                      }}
                    >
                      Red
                    </span>
                    : There are redundent led number mapping.
                  </li>
                </ul>
              </li>
              <li>
                <b>LEDs used:</b> {LedsUsed}
              </li>
            </ul>
          </Alert>
          <div className="row justify-content-center">
            <div className="grid mb-4">
              {grid.map((items, idx) => (
                <div className="grid-row" key={`row-${idx}`}>
                  {items.map((item, itemIdx) => (
                    <GridRowItem key={`item-${itemIdx}`} item={item} />
                  ))}
                </div>
              ))}
            </div>

            <div className="shape-controls">
              <div>
                <ButtonGroup>
                  <Button
                    onClick={() => onClickActionHandler(Shape.Circle)}
                    variant={shape === Shape.Circle ? 'primary' : 'secondary'}
                  >
                    <FontAwesomeIcon icon={faCircle} />
                  </Button>
                  <Button
                    onClick={() => onClickActionHandler(Shape.Square)}
                    variant={shape === Shape.Square ? 'primary' : 'secondary'}
                  >
                    <FontAwesomeIcon icon={faSquare} />
                  </Button>
                </ButtonGroup>
                <GridControlButton
                  onClick={() => onClickActionHandler('clear')}
                  toolTipText="Clear the grid mappings"
                  icon={faEraser}
                />
              </div>

              <div>
                {shape === Shape.Circle && <ThresholdInput />}
                <ButtonGroup>
                  <GridControlButton
                    onClick={() => onClickActionHandler('clockwise')}
                    toolTipText="Shift Leds Clockwise"
                    icon={faArrowRotateLeft}
                  />
                  <GridControlButton
                    onClick={() => onClickActionHandler('anti-clockwise')}
                    toolTipText="Shift Leds Anti-Clockwise"
                    icon={faArrowRotateRight}
                  />
                  <GridControlButton
                    onClick={() => onClickActionHandler('reverse')}
                    toolTipText="Reverse the direction of the led sequence"
                    icon={faArrowRightArrowLeft}
                  />
                </ButtonGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
