import connectDB from "@/libs/connectDB";
import { AttendanceTimeCardModel } from "@/models/AttendanceTime";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { convertToMinutes, getHoursMinutesFromClientInput, getNextDayFromDate, getNextMonthFirstDate } from "@/libs/datetime"
import { getSelectDataMongo } from "@/utils/mongoDB"


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const queryDate = searchParams.get('date') as string
  await connectDB()
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    throw Error('Not authenticate')
  }

  const currentDate = new Date(queryDate)
  const nextMonthDate = getNextMonthFirstDate(currentDate)

  const selectFieldArray = [
    'workingDay',
    'workStartTime',
    'workEndTime',
    'restStartTime',
    'restEndTime',
    'fromStation',
    'toStation',
    'sumWorkingMinutes',
    'sumRestingMinutes',
    'transportationFee',
    '_id',
  ]

  const filter = {
    user: email,
    workingDay: {
      $gte: currentDate,
      $lt: nextMonthDate
    }
  }

  const document = await AttendanceTimeCardModel.find(filter).select(getSelectDataMongo(selectFieldArray)).lean()

  if (!document) throw Error("Not found")
  return Response.json(document)

}

export async function POST(req: Request) {
  await connectDB()
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) {
    throw Error('Not authenticate')
  }
  const {
    workStartTime,
    workEndTime,
    restStartTime,
    restEndTime,
    fromStation,
    toStation,
    transportationFee } = await req.json()

  const { hour: workStartTimeHour, minutes: workStartTimeMinutes } = getHoursMinutesFromClientInput(workStartTime)
  const { hour: workEndTimeHour, minutes: workEndTimeMinutes } = getHoursMinutesFromClientInput(workEndTime)
  const { hour: restStartTimeHour, minutes: restStartTimeMinutes } = getHoursMinutesFromClientInput(restStartTime)
  const { hour: restEndTimeHour, minutes: restEndTimeMinutes } = getHoursMinutesFromClientInput(restEndTime)

  const workedStartTime = convertToMinutes(workStartTimeHour, workStartTimeMinutes)
  const workedEndTime = convertToMinutes(workEndTimeHour, workEndTimeMinutes)
  const restedStartTime = convertToMinutes(restStartTimeHour, restStartTimeMinutes)
  const restedEndTime = convertToMinutes(restEndTimeHour, restEndTimeMinutes)

  const sumRestedMinutes = restedEndTime - restedStartTime
  const sumWorkedMinutes = workedEndTime - workedStartTime - sumRestedMinutes

  const createData = {
    user: email,
    workStartTime: `${workStartTimeHour}:${workStartTimeMinutes}`,
    workEndTime: `${workEndTimeHour}:${workEndTimeMinutes}`,
    restStartTime: `${restStartTimeHour}:${restStartTimeMinutes}`,
    restEndTime: `${restEndTimeHour}:${restEndTimeMinutes}`,
    fromStation,
    toStation,
    sumWorkingMinutes: sumWorkedMinutes || 0,
    sumRestingMinutes: sumRestedMinutes || 0,
    transportationFee: transportationFee ? Number(transportationFee) : null
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0)
  const tomorrow = getNextDayFromDate(today)

  const filter = {
    user: email,
    workingDay: {
      $gte: today,
      $lt: tomorrow
    }
  }

  const document = await AttendanceTimeCardModel.findOneAndUpdate(filter, createData, {
    upsert: true, new: true
  })

  if (!document) throw Error("Error creating")

  return Response.json({ message: "Create success" }, {
    status: 201
  })
}

export async function PUT(req: Request) {
  await connectDB()
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) {
    throw Error('Not authenticate')
  }
  const {
    _id,
    workStartTime,
    workEndTime,
    restStartTime,
    restEndTime,
    fromStation,
    toStation,
    transportationFee } = await req.json()


  const { hour: workStartTimeHour, minutes: workStartTimeMinutes } = getHoursMinutesFromClientInput(workStartTime)
  const { hour: workEndTimeHour, minutes: workEndTimeMinutes } = getHoursMinutesFromClientInput(workEndTime)
  const { hour: restStartTimeHour, minutes: restStartTimeMinutes } = getHoursMinutesFromClientInput(restStartTime)
  const { hour: restEndTimeHour, minutes: restEndTimeMinutes } = getHoursMinutesFromClientInput(restEndTime)

  const workedStartTime = convertToMinutes(workStartTimeHour, workStartTimeMinutes)
  const workedEndTime = convertToMinutes(workEndTimeHour, workEndTimeMinutes)
  const restedStartTime = convertToMinutes(restStartTimeHour, restStartTimeMinutes)
  const restedEndTime = convertToMinutes(restEndTimeHour, restEndTimeMinutes)

  const sumWorkedMinutes = workedEndTime - workedStartTime
  const sumRestedMinutes = restedEndTime - restedStartTime


  const updateData = {
    user: email,
    workStartTime: `${workStartTimeHour}:${workStartTimeMinutes}`,
    workEndTime: `${workEndTimeHour}:${workEndTimeMinutes}`,
    restStartTime: `${restStartTimeHour}:${restStartTimeMinutes}`,
    restEndTime: `${restEndTimeHour}:${restEndTimeMinutes}`,
    fromStation,
    toStation,
    sumWorkingMinutes: sumWorkedMinutes || 0,
    sumRestingMinutes: sumRestedMinutes || 0,
    transportationFee: transportationFee ? Number(transportationFee) : null
  }


  const filter = {
    _id
  }

  const document = await AttendanceTimeCardModel.updateOne(filter, updateData)

  if (!document) throw Error("Error updating")

  return Response.json({ message: "Update success" }, {
    status: 200
  })
}

export async function DELETE(req: Request) {
  await connectDB()
  const url = new URL(req.url);
  const _id = url.searchParams.get("_id");

  const session = await getServerSession(authOptions);
  if (!session) {
    throw Error('Not authenticate')
  }

  const doc = await AttendanceTimeCardModel.deleteOne({ _id })

  if (!doc) throw Error('Delete fail')

  return Response.json({ message: 'Delete success' }, {
    status: 200
  })
}