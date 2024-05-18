import ModalProvider from "@/components/modals/modalProvider";
import Navbar from "@/components/navbar";
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
      <ModalProvider />
      <Navbar />
      {children}
    </div>
  );
};

export default DashboardLayout;
