import { GridItemType, useComponent } from '../context/ComponentContext';

export default function GridRowItem({
  item,
  rowId,
  idx,
  onClickItem,
}: {
  item: GridItemType;
  rowId: number;
  idx: number;
  onClickItem: Function;
}) {
  const { component, setComponent } = useComponent();
  const { LedCount, LedNames } = component;

  const { x, y, active } = item;

  const handelOnClick = () => {
    onClickItem(rowId, idx);
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const LedCoordinates = component.LedCoordinates.map(
      (coordinate: Array<number>, idx: number) => {
        if (idx === parseInt(e.target.value)) {
          return [x, y];
        }

        return coordinate;
      }
    );
    setComponent({
      ...component,
      LedCoordinates,
    });
  };

  return (
    <div className="grid-item">
      <div
        className={`status ${active && 'active'}`}
        onClick={handelOnClick}
      ></div>

      <select disabled={!active} onChange={onChangeHandler} defaultValue={''}>
        {!active && <option value="" hidden></option>}
        {LedNames.map((led, idx) => (
          <option key={idx} value={idx}>
            {led}
          </option>
        ))}
      </select>
    </div>
  );
}
