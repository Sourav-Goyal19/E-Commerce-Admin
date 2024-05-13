"use client";
import { useUser } from "@/zustand/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useStoreModal } from "@/hooks/useStore";
import { useRouter } from "next/navigation";
import LoadingModal from "@/components/ui/LoadingModal";

const Home = () => {
  const session = useSession();
  const { user, setUser } = useUser();
  const { isOpen, onOpen } = useStoreModal();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log(session.status);
    if (session.status === "authenticated" && session.data.user) {
      axios
        .get(`/api/users/getuser/${session.data.user.email}`)
        .then((res) => {
          setUser(res.data.user);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [session.status]);

  useEffect(() => {
    if (user?._id) return;
    axios
      .get("/api/users/me")
      .then((res) => {
        console.log(res);
        setUser(res.data.user);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  useEffect(() => {
    const fetchStore = async () => {
      if (user?._id) {
        axios
          .get(`/api/store/${user?._id}`)
          .then((res) => {
            setIsLoading(true);
            console.log(res.data.store);
            router.push(`/${res.data.store._id}`);
          })
          .catch((err) => {
            setIsLoading(false);
            console.log(err.message);
          });
      }
    };
    fetchStore();
  }, [user]);

  return <>{isLoading && <LoadingModal />}</>;
};

export default Home;
