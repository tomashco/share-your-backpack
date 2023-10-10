import { type ReactNode } from "react";
import Navbar from "./NavBar";

export const Header = ({ pageTitle }: { pageTitle: ReactNode }) => {
  return (
    <div className="w-full">
      <Navbar />
      <h1 className="px-4 pb-16 pt-4 text-center text-5xl font-extrabold tracking-tight text-primary drop-shadow-xl sm:text-[5rem]">
        {pageTitle}
      </h1>
    </div>
  );
};
