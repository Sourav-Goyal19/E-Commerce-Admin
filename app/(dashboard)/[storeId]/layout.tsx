import { StoreModel } from "@/models/store.modal";
import { redirect } from "next/navigation";
import React from "react";

const DashboardLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) => {
  const store = await StoreModel.findById(params.storeId);

  if (!store) {
    redirect("/");
  }

  return (
    <div>
      <p>{store.name}</p>
      {children}
    </div>
  );
};

export default DashboardLayout;
