import * as React from 'react';
import Button from '../../atoms/Button';
import Input from '../../atoms/Input';

export type InputAddItemProps = {
  handleSubmit?: (event: React.FormEvent<HTMLButtonElement>) => void
  inputId: string
  buttonText: string
  }

function InputAddItem({ handleSubmit, inputId, buttonText }: InputAddItemProps) {
  return (
    <div className="flex justify-between">
      <Input className="" type="text" inputId={inputId} name="addItem" required />
      <Button type="primary" className="ml-3" text={buttonText} onSubmit={handleSubmit} />
    </div>
  );
}

export default InputAddItem;
