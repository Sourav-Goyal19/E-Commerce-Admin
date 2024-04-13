import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: boolean;
};

const connectionObj: ConnectionObject = {};

export async function Connect(): Promise<void> {
  if (connectionObj.isConnected) {
    console.log("Already connected");
    return;
  }
  try {
    mongoose.connect(process.env.NEXT_PUBLIC_DATABASE_URL as string);
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("MongoDB Connected Successfully");
      connectionObj.isConnected = true;
    });
    connection.on("disconnected", () => {
      console.log("MongoDB Disconnected");
      connectionObj.isConnected = false;
    });
    connection.on("error", (error) => {
      console.log("Error in connecting to MongoDB");
      connectionObj.isConnected = false;
      console.log(error);
      process.exit(1);
      return;
    });
  } catch (error) {
    console.log("Something Went Wrong in connecting to db");
    console.log(error);
  }
}
