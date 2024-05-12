import { Document, models } from "mongoose";
import mongoose, { Schema, model } from "mongoose";

export interface User extends Document {
  username: string;
  email: string;
  hashedPassword?: string;
  salt?: string;
  image?: string;
  isAdmin: boolean;
  isVerified?: boolean;
  provider?: string;
  type?: string;
  verifyToken?: string | undefined;
  verifyTokenExpiry?: Date | undefined;
  forgotPasswordToken?: string | undefined;
  forgotPasswordTokenExpiry?: Date | undefined;
}

export interface UserData {
  _id: string;
  username: string;
  email: string;
  hashedPassword?: string;
  salt?: string;
  image?: string;
  isAdmin?: boolean;
  isVerified?: boolean;
  provider?: string;
  type?: string;
  verifyToken?: string | undefined;
  verifyTokenExpiry?: Date | undefined;
  forgotPasswordToken?: string | undefined;
  forgotPasswordTokenExpiry?: Date | undefined;
}

const userSchema: Schema<User> = new Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "Please provide a username"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide an email"],
  },
  hashedPassword: {
    type: String,
  },
  salt: {
    type: String,
  },
  image: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  provider: {
    type: String,
    default: "email",
  },
  type: {
    type: String,
  },
  verifyToken: {
    type: String,
  },
  verifyTokenExpiry: {
    type: Date,
  },
  forgotPasswordToken: {
    type: String,
  },
  forgotPasswordTokenExpiry: {
    type: Date,
  },
});

const UserModel =
  (models.users as mongoose.Model<User>) || model<User>("users", userSchema);

export default UserModel;
