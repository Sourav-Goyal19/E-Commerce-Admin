"use client";
import { useUser } from "@/zustand/store";
import MainNav from "./MainNav";
import StoreSwitcher from "./StoreSwitcher";
import Profile from "./ui/profile";
import { useEffect, useState } from "react";
import axios from "axios";
import { StoreData } from "@/models/store.modal";

const Navbar = () => {
  const { user } = useUser();
  const [items, setItems] = useState<StoreData[]>([]);

  useEffect(() => {
    const fetchStores = async () => {
      axios
        .get(`/api/store/${user?._id}`)
        .then((res) => {
          console.log(res.data);
          setItems(res.data.stores);
        })
        .catch((err) => console.log(err));
    };
    fetchStores();
  }, [user?._id]);

  return (
    <div className="border-b w-full">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={items} />
        <MainNav className="mx-6" />
        <Profile />
      </div>
    </div>
  );
};

export default Navbar;
