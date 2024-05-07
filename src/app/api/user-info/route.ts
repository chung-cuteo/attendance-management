import connectDB from "@/libs/connectDB";
import { UserModel } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  await connectDB();

  const session = await getServerSession(authOptions);
  const email = session?.user?.email
  if (!session) {
    throw Error('Not authenticate')
  }

  const users = await UserModel.findOne({ email });

  if (users) {
    return Response.json(users);
  }

  return Response.json([]);
}