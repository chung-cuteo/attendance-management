import connectDB from "@/libs/connectDB";
import { UserModel } from "@/models/User";
import { isAdmin } from "../auth/[...nextauth]/route";

export async function GET() {
  await connectDB();

  if (!await isAdmin()) {
    throw Error('Not Done')
  }

  const users = await UserModel.find();
  if (users) {
    return Response.json(users);
  }

  return Response.json([]);
}

export async function PUT(req: Request) {
  await connectDB()


  if (!await isAdmin()) {
    throw Error('Not Done')
  }

  const bodyData = await req.json()

  const filter = {
    _id: bodyData._id
  }

  const document = await UserModel.updateOne(filter, bodyData)

  if (!document) throw Error("Error updating")

  return Response.json({ message: "Update success" }, {
    status: 200
  })
}

export async function DELETE(req: Request) {
  await connectDB()
  const url = new URL(req.url);
  const _id = url.searchParams.get("_id");


  if (!await isAdmin()) {
    throw Error('Not Done')
  }

  const doc = await UserModel.deleteOne({ _id })

  if (!doc) throw Error('Delete fail')

  return Response.json({ message: 'Delete success' }, {
    status: 200
  })
}
