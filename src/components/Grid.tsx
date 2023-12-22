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
                <b>Usage:</b> Enter the led number in the box.
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
