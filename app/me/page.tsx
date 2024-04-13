// "use client";
import { Button } from "@/components/ui/button";
// import { clearUser } from "@/redux/features/userSlice";
// import { signOut } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";

const Profile = () => {
  // const dispatch = useDispatch();
  // const router = useRouter();
  // useEffect(() => {
  //   router.push("/");
  // }, []);
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1>Profile Page</h1>
      <Button>Logout</Button>
    </div>
  );
};

export default Profile;
