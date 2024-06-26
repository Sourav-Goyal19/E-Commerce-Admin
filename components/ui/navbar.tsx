"use client";
import { useUser } from "@/zustand/store";
import StoreSwitcher from "@/components/StoreSwitcher";
import Profile from "@/components/ui/profile";
import { useEffect, useState } from "react";
import axios from "axios";
import { StoreData } from "@/models/store.model";
import MenuDrawer from "@/components/ui/menu-drawer";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ModeToggle } from "@/components/ui/theme";
import MainNav from "./MainNav";

const Navbar = () => {
  const { user } = useUser();
  const [items, setItems] = useState<StoreData[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    });
    const fetchStores = async () => {
      if (!user?._id) return;
      axios
        .get(`/api/store?userId=${user?._id}`)
        .then((res) => {
          console.log(res.data);
          setItems(res.data.stores);
        })
        .catch((err) => console.log(err));
    };
    fetchStores();
  }, [user?._id]);

  return (
    <>
      <MenuDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        user={user}
      />
      <div className="border-b w-full">
        <div className="flex h-16 items-center px-4">
          <StoreSwitcher items={items} />
          <div className="opacity-0 scale-0 hidden lg:opacity-100 lg:scale-100 lg:flex h-16 items-center gap-4 w-full">
            <MainNav className="mx-6" />
            <ModeToggle />
            <Profile />
          </div>
          <div className="scale-100 opacity-100 block ml-auto lg:scale-0 lg:opacity-0 lg:hidden">
            <Button
              variant={"outline"}
              size={"icon"}
              onClick={() => setIsOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
