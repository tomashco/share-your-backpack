import * as React from 'react';
import Button from '../../atoms/Button';
import Input from '../../atoms/Input';

export type ListItemsProps = {
  items: Array<string>
  }

function ListItems({ items }: ListItemsProps) {
  return (
    <ul className="pl-0">
      {items.map((item) => (
        <li className="flex items-center justify-between">
          <div>
            <Input className="flex-1" type="checkbox" defaultChecked />
            <span>{item}</span>
          </div>
          <div className=" flex justify-between">
            <Button className="scale-75" type="primary" text="Edit" />
            <Button className="ml-1 scale-75" type="secondary" text="Delete" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default ListItems;
