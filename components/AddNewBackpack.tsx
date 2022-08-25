import * as React from 'react';
import Button from './atoms/Button';

function AddItem() {
  const handleSubmit = () => null;

  return (
    <form className="addItem">
      <h2>
        What needs to be inserted?
      </h2>
      <input
        type="text"
        id="new-todo-input"
        name="text"
      />
      <Button text="Add" onSubmit={handleSubmit} />
    </form>
  );
}

function FilterItem() {
  return (
    <div className="filterItems">
      <Button text="All" />
      <Button text="To buy" />
      <Button text="Ready" />
    </div>
  );
}

function ListItems() {
  const items = ['eat', 'sleep', 'repeat'];
  return (
    <ul className="listItems">
      {items.map((item) => (
        <li>
          <div>
            <input type="checkbox" defaultChecked />
            <span>{item}</span>
          </div>
          <div className="btn-group">
            <Button text="Edit" />
            <Button text="Delete" />
          </div>
        </li>
      ))}
    </ul>
  );
}

function AddNewBackpack() {
  return (
    <div className="flex flex-col">
      <h1>TodoMatic</h1>
      <AddItem />
      <FilterItem />
      <h2>things remaining</h2>
      <ListItems />

    </div>
  );
}

export default AddNewBackpack;
