import React, { useEffect } from 'react';
import { Alert, ListGroup } from 'react-bootstrap';
import { useComponent } from '../context/ComponentContext';
import GridRowItem from './GridRowItem';

export default function Grid() {
  const { grid, LedsUsed } = useComponent();

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

          <div className="grid">
            {grid.map((items, idx) => (
              <div className="grid-row" key={`row-${idx}`}>
                {items.map((item, itemIdx) => (
                  <GridRowItem key={`item-${itemIdx}`} item={item} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
