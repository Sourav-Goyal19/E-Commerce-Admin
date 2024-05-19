"use client";
import { useUser } from "@/zustand/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useStoreModal } from "@/hooks/useStore";
import { useRouter } from "next/navigation";
import LoadingModal from "@/components/ui/LoadingModal";
import FetchUser from "@/components/FetchUser";

const Home = () => {
  const { user } = useUser();
  const { isOpen, onOpen } = useStoreModal();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  useEffect(() => {
    const fetchStore = async () => {
      setIsLoading(true);
      if (user?._id) {
        axios
          .get(`/api/store?userId=${user?._id}`)
          .then((res) => {
            console.log(res.data.stores);
            router.push(`/${res.data.stores[0]._id}`);
          })
          .catch((err) => {
            console.log(err.message);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    };
    fetchStore();
  }, [user]);

  return (
    <>
      {isLoading && <LoadingModal />}
      <FetchUser />
    </>
  );
};

export default Home;
