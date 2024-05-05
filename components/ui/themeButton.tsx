"use client";
import { useTheme } from "next-themes";
import { Button } from "./button";
import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

const ThemeButton = () => {
  const { setTheme } = useTheme();
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef<any>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current?.contains(event.target)) {
        setDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button size="icon" variant={"outline"} onClick={() => setDropdown(true)}>
        <IoSunnyOutline className="h-[1.2rem] w-[1.2rem] transition-all dark:hidden" />
        <IoMoonOutline className="hidden h-[1.2rem] w-[1.2rem] transition-all dark:block" />
        <span className="sr-only">Toggle theme</span>
      </Button>
      <ul
        className={clsx(
          "-left-24 -bottom-[6.5rem] flex flex-col p-1 border shadow w-28 bg-background rounded",
          dropdown ? "absolute" : "hidden"
        )}
      >
        <li
          className="cursor-pointer hover:bg-muted py-1 px-2 text-sm rounded"
          onClick={() => {
            setTheme("system");
            setDropdown(false);
          }}
        >
          System
        </li>
        <li
          className="cursor-pointer hover:bg-muted py-1 px-2 text-sm rounded"
          onClick={() => {
            setTheme("light");
            setDropdown(false);
          }}
        >
          Light
        </li>
        <li
          className="cursor-pointer hover:bg-muted py-1 px-2 text-sm rounded"
          onClick={() => {
            setTheme("dark");
            setDropdown(false);
          }}
        >
          Dark
        </li>
      </ul>
    </div>
  );
};

export default ThemeButton;
