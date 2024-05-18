"use client";
import Avatar from "./avatar";
import { useUser } from "@/zustand/store";

const Profile = () => {
  const { user } = useUser();
  return (
    <div className="ml-auto flex items-center justify-self-end">
      <Avatar url={user?.image!} />
    </div>
  );
};

export default Profile;
