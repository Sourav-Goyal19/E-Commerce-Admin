import FetchUser from "@/components/FetchUser";
import { StoreModel } from "@/models/store.model";
import mongoose from "mongoose";
import { redirect } from "next/navigation";

const Dashboard = async ({ params }: { params: { storeId: string } }) => {
  if (!mongoose.Types.ObjectId.isValid(params.storeId)) {
    console.log("called");
    return redirect("/home");
  }

  const store = await StoreModel.findById(params.storeId);
  if (!store) {
    return redirect("/home");
  }
  console.log(store);
  return (
    <div>
      <p>{store?.name}</p>
      <FetchUser />
    </div>
  );
};

export default Dashboard;
