"use client";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

interface ColorPickerProps {
  disabled?: boolean;
  onChange: (color: string) => void;
  value: string;
  placeholder?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  onChange,
  value = "#000000",
  placeholder,
  disabled,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="relative">
      <Input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute right-0 w-16 inset-y-0 h-full opacity-0 cursor-pointer"
        disabled={disabled}
      />
      <div className="absolute right-0 w-16 inset-y-0 pointer-events-none flex flex-col justify-center items-center">
        <div
          className="h-7 w-7 border cursor-pointer rounded-full pointer-events-none"
          style={{ backgroundColor: value }}
        />
      </div>
    </div>
  );
};
