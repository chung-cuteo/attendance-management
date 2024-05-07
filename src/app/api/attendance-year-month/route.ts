import connectDB from "@/libs/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { AttendanceTimeCardModel } from "@/models/AttendanceTime";
import { getSelectDataMongo } from "@/utils/mongoDB";

export async function GET() {
  await connectDB()
  const session = await getServerSession(authOptions);
  if (!session) {
    throw Error('Not authenticate')
  }
  const email = session?.user?.email
  const selectArray = [
    "workingDay"
  ]

  const docs = await AttendanceTimeCardModel.find({ user: email }).select(getSelectDataMongo(selectArray)).lean();

  if (!docs) throw Error('Not found')

  const uniqueYearsMonths = new Set();
  docs.forEach((doc) => {
    const year = doc.workingDay.getFullYear();
    const month = doc.workingDay.getMonth() + 1;
    uniqueYearsMonths.add(`${year}-${month}`);
  })

  return Response.json(Array.from(uniqueYearsMonths))


}