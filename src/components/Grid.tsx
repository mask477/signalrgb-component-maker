import React, { useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import { useComponent } from '../context/ComponentContext';
import GridRowItem from './GridRowItem';

export default function Grid() {
  const { grid, setGrid, ledsUsed } = useComponent();

  const onClickItem = (x: number, y: number) => {
    const updatedGrid = [...grid];
    updatedGrid[x][y].active = !updatedGrid[x][y].active;

    setGrid(updatedGrid);
  };

  useEffect(() => {
    console.log('GRID:', grid);
  }, [grid]);

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h4 className="mb-3">LED Mapping:</h4>
        <ListGroup className="mb-4">
          <ListGroup.Item>LEDs used: {ledsUsed}</ListGroup.Item>
        </ListGroup>

        <div className="grid">
          {grid.map((items, idx) => (
            <div key={`row-${idx}`} className="mb-2">
              <div className="grid-row">
                {items.map((item, itemIdx) => (
                  <GridRowItem
                    key={`item-${itemIdx}`}
                    item={item}
                    rowId={idx}
                    idx={itemIdx}
                    onClickItem={onClickItem}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
