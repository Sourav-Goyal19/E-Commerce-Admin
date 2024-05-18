import FetchUser from "@/components/FetchUser";
import { StoreModel } from "@/models/store.modal";
import React from "react";

const Dashboard = async ({ params }: { params: { storeId: string } }) => {
  const store = await StoreModel.findById(params.storeId);
  return (
    <div>
      <p>{store?.name}</p>
      <FetchUser />
    </div>
  );
};

export default Dashboard;
