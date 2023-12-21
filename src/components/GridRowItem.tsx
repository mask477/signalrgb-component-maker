import { useState } from 'react';
import { GridItemType, useComponent } from '../context/ComponentContext';

export default function GridRowItem({ item }: { item: GridItemType }) {
  const { led, x, y, active } = item;
  const { component, grid, setGrid, LedsUsed } = useComponent();
  const { LedNames, LedCount } = component;

  const handelOnClick = () => {
    let newGrid = [...grid];
    let newGridRow = [...grid[y]];
    let newGridItem = { ...grid[y][x - 1] };

    if (LedsUsed < LedCount || newGridItem.active) {
      newGridItem.active = !newGridItem.active;
      if (!newGridItem.active) {
        newGridItem.led = -1;
      }

      newGridRow[x - 1] = newGridItem;
      newGrid[y] = newGridRow;

      setGrid(newGrid);
    }
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    let newGrid = [...grid];
    let newGridRow = [...grid[y]];
    let newGridItem = { ...grid[y][x - 1] };

    newGridItem.led = parseInt(e.target.value);

    newGridRow[x - 1] = newGridItem;
    newGrid[y] = newGridRow;

    setGrid(newGrid);
  };

  return (
    <div className="grid-item">
      <div
        className={`status ${active && 'active'}`}
        onClick={handelOnClick}
      ></div>

      <select
        disabled={!active}
        onChange={onChangeHandler}
        value={led === null ? 'null' : led}
      >
        <option value="-1"></option>
        {LedNames.map((name, idx) => (
          <option key={`name-${idx}`} value={`${idx}`}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}
