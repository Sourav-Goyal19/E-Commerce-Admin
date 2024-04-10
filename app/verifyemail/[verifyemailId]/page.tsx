"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface IParams {
  verifyemailId: string;
}

const VerifyEmailId = ({ params }: { params: IParams }) => {
  const [verified, setVerified] = useState(false);
  const [tokenError, setTokenError] = useState(false);
  const token = params.verifyemailId;

  const handleVerification = () => {
    axios
      .post("/api/users/verifyemail", { token: token })
      .then((res) => {
        console.log(res);
        setVerified(true);
      })
      .catch((err) => {
        console.log(err);
        setTokenError(true);
        toast.error(err.response.data.message);
      });
  };

  return (
    <div className="bg-background w-full">
      {verified ? (
        <div className="flex flex-col gap-2 justify-center items-center pt-12">
          <h1 className="text-3xl font-semibold">
            Email Verified Successfully
          </h1>
          <h2 className="text-xl">Now you can close this page</h2>
        </div>
      ) : (
        <>
          {tokenError ? (
            <div className="flex flex-col gap-4 justify-center items-center h-screen border p-4 text-center">
              <h1 className="text-3xl text-destructive font-semibold capitalize">
                Invalid Token
              </h1>
              <p className="text-base capitalize">
                <Link
                  href="/verifyemail"
                  className="underline underline-offset-2"
                >
                  Request a new Verification Email
                </Link>
              </p>
              <p className="text-lg font-semibold">Or</p>
              <Link href="/" className="underline underline-offset-2">
                Back to Login
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3 pt-12 justify-center items-center w-full">
              <h1 className="text-3xl text-foreground">Verify Email Id</h1>
              <Button onClick={handleVerification}>Click Here</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VerifyEmailId;
