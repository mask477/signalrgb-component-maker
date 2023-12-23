import React, { useEffect } from 'react';
import { Alert, Button, ListGroup } from 'react-bootstrap';
import { useComponent } from '../context/ComponentContext';
import GridRowItem from './GridRowItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faCircle, faSquare } from '@fortawesome/free-regular-svg-icons';
import {
  faArrowRotateLeft,
  faArrowRotateRight,
  faEraser,
} from '@fortawesome/free-solid-svg-icons';

export default function Grid() {
  const { grid, LedsUsed, mapShape } = useComponent();

  const onClickShapeHandler = (shape: string) => mapShape(shape);

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
            <div className="grid">
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
                <Button onClick={() => onClickShapeHandler('circle')}>
                  <FontAwesomeIcon icon={faCircle} />
                </Button>
                <Button onClick={() => onClickShapeHandler('square')}>
                  <FontAwesomeIcon icon={faSquare} />
                </Button>
                <Button onClick={() => onClickShapeHandler('clear')}>
                  <FontAwesomeIcon icon={faEraser} />
                </Button>
              </div>

              <div>
                <Button onClick={() => onClickShapeHandler('clockwise')}>
                  <FontAwesomeIcon icon={faArrowRotateLeft} />
                </Button>
                <Button onClick={() => onClickShapeHandler('anti-clockwise')}>
                  <FontAwesomeIcon icon={faArrowRotateRight} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
