import React, { useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import { useComponent } from '../context/ComponentContext';
import GridRowItem from './GridRowItem';

export default function Grid() {
  const { grid, LedsUsed } = useComponent();

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h4 className="mb-3">LED Mapping:</h4>
        <ListGroup className="mb-4">
          <ListGroup.Item>LEDs used: {LedsUsed}</ListGroup.Item>
        </ListGroup>

        <div className="grid">
          {grid.map((items, idx) => (
            <div key={`row-${idx}`} className="mb-2">
              <div className="grid-row">
                {items.map((item, itemIdx) => (
                  <GridRowItem key={`item-${itemIdx}`} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
