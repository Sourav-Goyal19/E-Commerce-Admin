import { UserData } from "@/models/user.model";
import { create } from "zustand";

interface User {
  user: UserData | null;
  setUser: (user: UserData) => void;
  clearUser: () => void;
}

export const useUser = create<User>((set) => ({
  setUser: (user: UserData) => {
    set((state) => ({ user }));
  },
  user: null,
  clearUser: () => {
    set((state) => ({ user: null }));
  },
}));
