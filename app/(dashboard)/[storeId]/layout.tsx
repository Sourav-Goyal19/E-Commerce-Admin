import ModalProvider from "@/components/modals/modalProvider";
import Navbar from "@/components/ui/navbar";
import { StoreModel } from "@/models/store.model";
import mongoose from "mongoose";
import { redirect } from "next/navigation";

const DashboardLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) => {
  if (!mongoose.Types.ObjectId.isValid(params.storeId)) {
    redirect("/home");
  }

  const store = await StoreModel.findById(params.storeId);

  if (!store) {
    redirect("/home");
  }

  return (
    <div className="custom-scroll">
      <ModalProvider />
      <Navbar />
      {children}
    </div>
  );
};

export default DashboardLayout;
