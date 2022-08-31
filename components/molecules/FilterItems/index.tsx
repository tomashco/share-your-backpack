import * as React from 'react';
import Button from '../../atoms/Button';

export type FilterItemsProps = {
  items: Array<string>
  }

function FilterItems({ items }: FilterItemsProps) {
  return (
    <div className="flex">
      {items.map((label) => <Button key={label} type="link" className="" text={label} />)}
    </div>
  );
}

export default FilterItems;
