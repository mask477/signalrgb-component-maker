import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useComponent } from '../context/ComponentContext';

type GridItemType = {
  led?: number;
  x: number;
  y: number;
  active: boolean;
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
          active: false,
        };
        row.push(item);
      }
      newGrid.push(row);
      setGrid(newGrid);
    }
  }, [width, height]);

  const onClickItem = (x: number, y: number) => {
    console.log({ x, y });

    const updatedGrid = [...grid];
    updatedGrid[x][y].active = !updatedGrid[x][y].active;

    setGrid(updatedGrid);
  };

  return (
    <div className="card">
      <div className="card-body">
        <h4>Draw here:</h4>
        {grid.map((items, idx) => (
          <div
            key={`row-${idx}`}
            className="d-flex justify-content-center mb-2"
          >
            <GridRow rowId={idx} items={items} onClickItem={onClickItem} />
          </div>
        ))}
      </div>
    </div>
  );
}

const GridRow = ({
  rowId,
  items,
  onClickItem,
}: {
  rowId: number;
  items: GridItemType[];
  onClickItem: Function;
}) => {
  return (
    <div className="grid-row">
      {items.map((item, idx) => (
        <GridRowItem
          key={`item-${idx}`}
          item={item}
          rowId={rowId}
          idx={idx}
          onClickItem={onClickItem}
        />
      ))}
    </div>
  );
};

const GridRowItem = ({
  item,
  rowId,
  idx,
  onClickItem,
}: {
  item: GridItemType;
  rowId: number;
  idx: number;
  onClickItem: Function;
}) => {
  const { component } = useComponent();
  const { LedCount } = component;

  const { x, y, active } = item;

  const handelOnClick = () => {
    onClickItem(rowId, idx);
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
  };

  return (
    <div className="grid-item">
      <div
        className={`status ${active && 'active'}`}
        onClick={handelOnClick}
      ></div>
      {/* <small className="text-muted">{active ? 'Enabled' : 'Disabled'}</small> */}

      <input
        type="number"
        disabled={!active}
        max={LedCount}
        min={1}
        onChange={onChangeHandler}
      />
    </div>
  );
};
