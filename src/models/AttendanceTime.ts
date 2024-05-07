import { model, Schema, models } from "mongoose";

export interface AttendanceTimeType {
  user: string
  _id: string
  workingDay: Date
  workStartTime: string
  workEndTime: string
  restStartTime: string
  restEndTime: string
  fromStation: string
  toStation: string
  sumWorkingMinutes: number
  sumRestingMinutes: number
  transportationFee: string
}


const attendanceTimeCardSchema = new Schema(
  {
    user: { type: String },
    workingDay: { type: Date, default: Date.now },
    workStartTime: { type: String, required: true },
    workEndTime: { type: String, required: true },
    restStartTime: { type: String },
    restEndTime: { type: String },
    fromStation: { type: String },
    toStation: { type: String },
    sumWorkingMinutes: { type: Number },
    sumRestingMinutes: { type: Number },
    transportationFee: { type: String },
  },
  {
    timestamps: true,
    collection: "attendances"
  }
);

export const AttendanceTimeCardModel = models?.AttendanceTime || model("AttendanceTime", attendanceTimeCardSchema);
