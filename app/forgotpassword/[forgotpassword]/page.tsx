"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

interface IParams {
  forgotpassword: string;
}

const ResetPassword = ({ params }: { params: IParams }) => {
  const [isTokenVerified, setIsTokenVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState<any>(null);
  const [pageLoading, setPageLoading] = useState(true);

  const schema = z
    .object({
      password: z
        .string()
        .min(8, {
          message: "Password must be at least 8 characters long",
        })
        .max(32),
      confirmPassword: z
        .string()
        .min(8, {
          message: "Password must be at least 8 characters long",
        })
        .max(32),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  type formSchema = z.infer<typeof schema>;

  const form = useForm<formSchema>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<formSchema> = (data) => {
    setIsLoading(true);
    axios
      .post("/api/users/forgotpassword/resetpassword", {
        password: data.password,
        userId: resetPasswordUser?._id,
      })
      .then((res) => {
        setPasswordUpdated(true);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    axios
      .post("/api/users/forgotpassword/verifytoken", {
        token: params.forgotpassword,
      })
      .then((res) => {
        // console.log(res.data);
        setResetPasswordUser(res.data.user);
        setIsTokenVerified(true);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setPageLoading(false);
      });
  }, []);

  return (
    <div className="h-screen flex justify-center items-center p-4">
      <>
        {pageLoading ? (
          <div className="h-10 w-10 border-2 border-foreground rounded-full border-b-transparent animate-spin"></div>
        ) : (
          <>
            {isTokenVerified ? (
              <>
                {passwordUpdated ? (
                  <div className="text-center">
                    <h1 className="text-2xl ">
                      Your Password Updated Successfully
                    </h1>
                    <p className="text-xl mt-1">Now you can close this page</p>
                    <p className="text-lg mt-2">Or</p>
                    <p className=" text-xl mt-2">
                      <Link href="/" className="font-semibold underline">
                        Login Here
                      </Link>
                    </p>
                  </div>
                ) : (
                  <div className="max-w-lg w-full p-4 border shadow-sm">
                    <p className="text-3xl font-bold">Reset Your Password</p>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full flex flex-col gap-4 mt-3"
                      >
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => {
                            return (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <Input
                                    disabled={isLoading}
                                    placeholder="Password"
                                    type="text"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                        <FormField
                          control={form.control}
                          name="confirmPassword"
                          render={({ field }) => {
                            return (
                              <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                  <Input
                                    disabled={isLoading}
                                    placeholder="Confirm Password"
                                    type="password"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full"
                        >
                          Submit
                        </Button>
                      </form>
                    </Form>
                  </div>
                )}
              </>
            ) : (
              <div>
                <p className="text-destructive text-2xl text-center">
                  Invalid Token
                </p>
                <p className="text-base">
                  Request a new reset password email{" "}
                  <Link
                    href="/forgotpassword"
                    className="font-semibold underline"
                  >
                    here
                  </Link>
                </p>
              </div>
            )}
          </>
        )}
      </>
    </div>
  );
};

export default ResetPassword;
