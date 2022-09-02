import * as React from 'react';
import Button from '../../atoms/Button';

function HeaderMenu() {
  return (
    <header className="flex flex-col flex-0 h-24 w-screen flex items-center">
      <nav>
        <Button text="Home" type="link" linkHref="/" />
        <Button text="About" type="link" linkHref="/about" />
        <Button text="Users List" type="link" linkHref="/users" />
        <Button text="Users API" type="link" linkHref="/api/users" />
      </nav>
    </header>
  );
}

export default HeaderMenu;
