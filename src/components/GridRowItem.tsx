import { ChangeEvent, useEffect, useState } from 'react';
import { GridItemType, useComponent } from '../context/ComponentContext';

export default function GridRowItem({ item }: { item: GridItemType }) {
  const { led, x, y, active } = item;
  const { component, mapLed } = useComponent();
  const { LedCount } = component;

  const onChangeActiveHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { target } = e;

    const value = parseInt(target.value) - 1;
    mapLed(x, y, value);
  };

  return (
    <div className="grid-item">
      <input
        type="number"
        className={active ? 'active' : ''}
        onChange={onChangeActiveHandler}
        min={0}
        max={LedCount}
        placeholder={`${led + 1}`}
      />
    </div>
  );
}
