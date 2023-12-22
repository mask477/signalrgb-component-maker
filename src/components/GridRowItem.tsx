import { ChangeEvent, useCallback, useEffect, useMemo, useRef } from 'react';
import { GridItemType, useComponent } from '../context/ComponentContext';

export default function GridRowItem({ item }: { item: GridItemType }) {
  const { led, x, y, active } = item;
  const { component, grid, mapLed, focusedInput, setFocusedInput } =
    useComponent();
  const { Width, Height, LedCount } = component;

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusedInput.x === x && focusedInput.y === y) {
      ref?.current?.focus();
      ref?.current?.select();
    }
  }, [focusedInput, ref, x, y]);

  const onKeyDownHandler = useCallback(
    (event: any) => {
      const { key } = event;
      if (
        isNaN(key) &&
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)
      ) {
        event.preventDefault();

        switch (key) {
          case 'ArrowUp':
            if (y !== 0) {
              setFocusedInput({
                ...focusedInput,
                y: focusedInput.y - 1,
              });
              ref?.current?.blur();
            }
            break;
          case 'ArrowDown':
            if (y < Height - 1) {
              setFocusedInput({
                ...focusedInput,
                y: focusedInput.y + 1,
              });
              ref?.current?.blur();
            }
            break;
          case 'ArrowLeft':
            if (x !== 1) {
              setFocusedInput({
                ...focusedInput,
                x: focusedInput.x - 1,
              });
              ref?.current?.blur();
            }
            break;
          case 'ArrowRight':
            if (x < Width) {
              setFocusedInput({
                ...focusedInput,
                x: focusedInput.x + 1,
              });
              ref?.current?.blur();
            }
            break;
        }
      }
    },
    [y, Height, x, Width, setFocusedInput, focusedInput]
  );

  const onChangeActiveHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { target } = e;

    const value = parseInt(target.value) - 1;
    mapLed(x, y, value);
  };

  const onFocusHandler = (e: any) => {
    setFocusedInput({ x, y });
  };

  const hasError = useMemo(() => {
    const flatGrid = grid
      .flat()
      .filter((a: GridItemType) => a.led === led && led !== -1);

    console.log('FLAT GRID:', flatGrid);

    return flatGrid.length > 1;
  }, [grid]);

  return (
    <div className="grid-item">
      <input
        type="number"
        className={hasError ? 'error' : active ? 'active' : ''}
        onChange={onChangeActiveHandler}
        onKeyDown={onKeyDownHandler}
        min={0}
        max={LedCount}
        placeholder={`${led + 1}`}
        ref={ref}
        onFocus={onFocusHandler}
      />
    </div>
  );
}
