"use client";

import { useUser } from "@/zustand/store";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const FetchUser = () => {
  const session = useSession();
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

  return null;
};

export default FetchUser;
