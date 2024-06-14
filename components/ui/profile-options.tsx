"use client";
import { LogOut } from "lucide-react";
import Avatar from "@/components/ui/avatar";
import { UserData } from "@/models/user.model";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ProfileOptionsProps {
  user: UserData | null;
}

export const ProfileOptions: React.FC<ProfileOptionsProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={cn(
          "absolute inset-x-0 -top-16 p-2 bg-background border w-full shadow-lg transition-all duration-300 ease-in-out transform rounded-xl",
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-2 pointer-events-none"
        )}
      >
        <p className="text-base transition flex items-center cursor-pointer hover:bg-muted rounded-lg py-2 px-2">
          <LogOut className="mr-2 h-5 w-5" /> Logout
        </p>
      </div>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="border-2 p-2 rounded-xl flex items-center w-full mb-4 gap-3 hover:bg-muted cursor-pointer"
      >
        <Avatar url={user?.image!} />
        <p className="text-lg">{user?.username}</p>
      </div>
    </div>
  );
};
