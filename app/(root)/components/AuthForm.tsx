"use client";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BsGithub, BsGoogle } from "react-icons/bs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import ThemeButton from "@/components/ui/themeButton";

type Variant = "LOGIN" | "REGISTER";

export default function AuthForm() {
  axios.defaults.withCredentials = true;
  const router = useRouter();
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);

  const formSchema =
    variant === "LOGIN"
      ? z.object({
          email: z.string().email({
            message: "Invalid Email",
          }),
          password: z.string().min(8, {
            message: "Password must be at least 8 characters",
          }),
        })
      : z.object({
          username: z.string().min(3, {
            message: "Username must be at least 3 characters",
          }),
          email: z.string().email({
            message: "Invalid Email",
          }),
          password: z.string().min(8, {
            message: "Password must be at least 8 characters",
          }),
        });

  type FormFields = z.infer<typeof formSchema>;

  const defaultFormValues =
    variant === "LOGIN"
      ? { email: "", password: "" }
      : { username: "", email: "", password: "" };

  const form = useForm<FormFields>({
    defaultValues: defaultFormValues,
    resolver: zodResolver(formSchema),
  });

  const toggleVariant = () => {
    setVariant((prev) => (prev === "LOGIN" ? "REGISTER" : "LOGIN"));
  };

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    setIsLoading(true);
    if (variant == "REGISTER") {
      axios
        .post("/api/users/signup", data)
        .then((res) => {
          console.log(res);
          toast.success("Account created successfully");
          toast.success("Verification Email Sent", {
            style: {
              borderRadius: "10px",
              background: "#fff",
              color: "#333",
            },
          });
          setVariant("LOGIN");
        })
        .catch((err) => {
          toast.error(err.response.data.message);
          console.log(err);
        })
        .finally(() => setIsLoading(false));
    } else {
      axios
        .post("/api/users/login", data)
        .then((res) => {
          console.log(res);
          if (!res.data.user.isVerified) {
            return router.push("/verifyemail");
          }
          toast.success("Login Successful");
          router.push("/me");
        })
        .catch((err) => {
          toast.error(err.response.data.message);
          console.log(err);
        })
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <div className="p-4 flex flex-col items-center justify-center h-full">
      <div className="flex flex-col items-center justify-center w-full max-w-lg py-8 px-4 rounded-md shadow-md border">
        <h1 className="text-2xl sm:text-3xl text-center font-bold mb-2 text-foreground">
          Sign Into Your Account
        </h1>
        <div className="max-w-md w-full">
          <div className="flex gap-3 w-full my-2">
            <Button
              className="py-1 w-full border shadow flex items-center justify-center gap-1 text-sm"
              disabled={isLoading}
            >
              <BsGoogle />
              <span>Google</span>
            </Button>
            <Button
              className="py-1 w-full border shadow flex items-center justify-center gap-1 text-sm"
              disabled={isLoading}
            >
              <BsGithub />
              <span>Github</span>
            </Button>
          </div>

          <div className="mt-6 w-full ">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background">Or Contiue With</span>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className=" w-full flex flex-col gap-4 mt-3"
            >
              {variant == "REGISTER" ? (
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isLoading}
                            placeholder="Name"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              ) : null}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="Email Address"
                          type="email"
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
                name="password"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="Password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <p className="text-right">
                <Link href="/forgotpassword" className="underline italic">
                  forgot password?
                </Link>
              </p>
              <Button type="submit" disabled={isLoading} className="w-full">
                Submit
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center">
            {variant === "LOGIN" ? "New Here?" : "Already Have An Account?"}
            <span
              onClick={toggleVariant}
              className="underline cursor-pointer ml-1"
            >
              {variant === "LOGIN" ? "Create An Account" : "Login Here"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
