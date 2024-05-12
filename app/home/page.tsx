"use client";
import { useUser } from "@/zustand/store";
import { useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useStoreModal } from "@/hooks/useStore";

const Home = () => {
  const session = useSession();
  const { isOpen, onOpen, onClose } = useStoreModal();
  const { user, setUser } = useUser();

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

  return <div className="p-4">Root Page</div>;
};

export default Home;
