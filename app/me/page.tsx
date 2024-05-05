"use client";
import { Button } from "@/components/ui/button";
import { useUser } from "@/zustand/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Modal } from "@/components/ui/modal";

const Profile = () => {
  const router = useRouter();
  const { user } = useUser();
  useEffect(() => {
    console.log(user);
    if (user == (null || undefined)) return router.push("/");
  }, []);
  return (
    <div className="p-4">
      <Modal
        title="Test"
        description="Hey There everyone"
        isOpen
        onClose={() => {}}
      >
        <Button>Test</Button>
      </Modal>
    </div>
  );
};

export default Profile;
