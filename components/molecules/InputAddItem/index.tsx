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
    <div className="">
      <Input type="text" inputId={inputId} name="addItem" required />
      <Button text={buttonText} onSubmit={handleSubmit} />
    </div>
  );
}

export default InputAddItem;
