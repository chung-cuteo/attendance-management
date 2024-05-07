import clientPromise from "@/libs/mongoConnect";
import bcrypt from "bcrypt";
import connectDB from "@/libs/connectDB";
import { UserModel } from "@/models/User";
import NextAuth, { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { Adapter } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
  secret: process.env.APP_SECRET,
  adapter: MongoDBAdapter(clientPromise) as Adapter,
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      id: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string
        const password = credentials?.password as string

        await connectDB();

        const foundUser = await UserModel.findOne({ email });

        const bcryptPassword =
          foundUser && bcrypt.compareSync(password, foundUser.password);

        if (bcryptPassword) {
          const dataUser = {
            email: foundUser.email,
            name: foundUser.name,
            phone: foundUser.phone,
            admin: foundUser.admin,
          } as typeof foundUser;

          return dataUser;
        }

        return null;
      },
    }),
  ]
};

export async function isAdmin() {
  await connectDB()
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return false;
  }
  const userInfo = await UserModel.findOne({ email: userEmail });
  if (!userInfo) {
    return false;
  }
  return userInfo.admin;
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
