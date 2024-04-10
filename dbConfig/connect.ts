import mongoose from "mongoose";

export async function Connect() {
  try {
    mongoose.connect(process.env.NEXT_PUBLIC_DATABASE_URL as string);
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("MongoDB Connected Successfully");
    });
    connection.on("disconnected", () => {
      console.log("MongoDB Disconnected");
    });
    connection.on("error", (error) => {
      console.log("Error in connecting to MongoDB");
      console.log(error);
      process.exit(1);
      return;
    });
  } catch (error) {
    console.log("Something Went Wrong in connecting to db");
    console.log(error);
  }
}
