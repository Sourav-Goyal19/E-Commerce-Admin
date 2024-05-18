import FetchUser from "@/components/FetchUser";
import { StoreModel } from "@/models/store.modal";
import { redirect } from "next/navigation";
import { SettingsForm } from "./components/settings-form";

interface SettingsPageProps {
  params: {
    storeId: string;
  };
}

const SettingsPage: React.FC<SettingsPageProps> = async ({ params }) => {
  const storeId = params.storeId;
  const store = await StoreModel.findById(storeId);
  //   console.log(store);
  if (!store) {
    redirect("/home");
  }
  return (
    <>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <SettingsForm initialData={store} />
        </div>
      </div>
      <FetchUser />
    </>
  );
};

export default SettingsPage;
