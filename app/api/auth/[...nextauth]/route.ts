import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import NextAuth from "next-auth/next";
import { AuthOptions } from "next-auth";
import { Connect } from "@/dbConfig/connect";
import UserModel from "@/models/user.model";

Connect();

const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        console.log("User", user);
        console.log("Account", account);
        const existingUser = await UserModel.findOne({
          email: user.email || "",
        });
        if (!existingUser) {
          const newUser = await UserModel.create({
            username: user.name,
            email: user.email,
            image: user.image,
            provider: account?.provider,
            type: account?.type,
            isVerified: true,
          });
        }
      } catch (error) {
        console.log(error);
      }
      return true;
    },
  },
};

const hanlder = NextAuth(authOptions);

export { hanlder as GET, hanlder as POST };
