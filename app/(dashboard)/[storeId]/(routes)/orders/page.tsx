import mongoose from "mongoose";
import FetchUser from "@/components/FetchUser";
import { format } from "date-fns";
import { OrderClient } from "./components/client";
import { OrderData, OrderModel } from "@/models/order.model";
import { OrderItemData } from "@/models/orderitem.model";
import { ProductData } from "@/models/product.model";
import { formatter } from "@/lib/utils";

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  let orders = null;
  if (mongoose.Types.ObjectId.isValid(params.storeId)) {
    orders = await OrderModel.find({
      storeId: params.storeId,
    })
      .sort({ createdAt: -1 })
      .populate({ path: "orderItems", populate: { path: "products" } });

    orders = orders.map((order) => ({
      id: order._id.toString(),
      phone: order.phone,
      address: order.address,
      products: (order.orderItems as OrderItemData[])
        .map((orderItem) => (orderItem.productId as ProductData).name)
        .join(","),
      totalPrice: formatter.format(
        order.orderItems.reduce((total, item) => {
          //@ts-ignore
          return total + Number((item.product as ProductData).price);
        }, 0)
      ),
      isPaid: order.isPaid,
      createdAt: format(order.createdAt, "MMMM do, yyyy"),
    }));
  }
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={orders} />
      </div>
      <FetchUser />
    </div>
  );
};

export default OrdersPage;
