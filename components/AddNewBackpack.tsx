import * as React from 'react';
import InputAddItem from './molecules/InputAddItem';
import ListItems from './molecules/ListItems';
import FilterItems from './molecules/FilterItems';

function AddItem() {
  const handleSubmit = () => null;

  return (
    <form className="addItem">
      <InputAddItem handleSubmit={handleSubmit} inputId="new-todo-input" buttonText="Add" />
    </form>
  );
}

function AddNewBackpack() {
  return (
    <div className="flex flex-col">
      <h2>
        What needs to be inserted?
      </h2>
      <AddItem />
      <FilterItems items={['All', 'To buy', 'Ready']} />
      <h2>things remaining</h2>
      <ListItems items={['eat', 'sleep', 'repeat']} />

    </div>
  );
}

export default AddNewBackpack;
