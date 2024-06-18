"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { OrderColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface OrderClientProps {
  data: OrderColumn[] | null;
}

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  return (
    <>
      <Heading
        title={`Orders (${data?.length || 0})`}
        description="Manage orders for your store"
      />
      <Separator />
      <DataTable
        columns={columns}
        searchKey="products"
        //@ts-ignore
        data={data}
      />
    </>
  );
};
