import { model, models, Schema, Document } from "mongoose";

export interface UserType {
  _id: string
  name: string
  email: string,
  admin: boolean,
  image: string
  salary: number
  salaryPaymentType: string
}

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    admin: { type: Boolean, default: false },
    salary: { type: Number, default: 1100 },
    salaryPaymentType: { type: String, default: "hourly", enum: ["hourly", "monthly"] },
  },
  {
    timestamps: true,
    collection: "users"
  }
);

export const UserModel = models?.User || model("User", userSchema);
