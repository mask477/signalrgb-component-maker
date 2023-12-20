import React, { useEffect, useState } from 'react';

type GridItemType = {
  led?: number;
  x: number;
  y: number;
  selected: boolean;
};

export default function Grid({
  leds,
  width,
  height,
}: {
  leds: number;
  width: number;
  height: number;
}) {
  const [grid, setGrid] = useState<GridItemType[][]>([]);

  useEffect(() => {
    const newGrid = [];

    for (let y = 0; y < height; y++) {
      let row: GridItemType[] = [];
      for (let x = 0; x < width; x++) {
        const item: GridItemType = {
          x,
          y,
          selected: false,
        };
        row.push(item);
      }
      newGrid.push(row);
      setGrid(newGrid);
    }
  }, [width, height]);

  return (
    <div className="card">
      <div className="card-body">
        <h4>Draw here:</h4>
        {grid.map((items, idx) => (
          <div className="d-flex justify-content-center mb-1">
            <div className="grid-item index">{idx + 1}</div>
            <GridRow key={`row-${idx}`} items={items} />
          </div>
        ))}
      </div>
    </div>
  );
}

const GridRow = ({ items }: { items: GridItemType[] }) => {
  return (
    <div className="d-flex justify-content-center align-items-center">
      {items.map((item, idx) => (
        <GridRowItem key={`item-${idx}`} {...item} />
      ))}
    </div>
  );
};

const GridRowItem = ({ led, x, y, selected }: GridItemType) => {
  return (
    <div>
      <div className="grid-item"></div>
    </div>
  );
};
