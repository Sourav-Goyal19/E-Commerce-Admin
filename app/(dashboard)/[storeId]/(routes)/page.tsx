import FetchUser from "@/components/FetchUser";
import Overview from "@/components/overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { formatter } from "@/lib/utils";
import { StoreModel } from "@/models/store.model";
import { CreditCard, IndianRupee, Package } from "lucide-react";
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
  const totalProducts = store.products.length;
  console.log(store);
  return (
    <>
      <div className="flex flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <Heading title="Dashboard" description="Overview of your store" />
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-center truncate">
                  Total Revenuce
                </CardTitle>
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold truncate">
                  {formatter.format(3999)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-center truncate">
                  Sales
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold truncate">+36</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-center truncate">
                  Product in stock
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold truncate">
                  {totalProducts}
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview data={[]} />
            </CardContent>
          </Card>
        </div>
      </div>
      <FetchUser />
    </>
  );
};

export default Dashboard;
