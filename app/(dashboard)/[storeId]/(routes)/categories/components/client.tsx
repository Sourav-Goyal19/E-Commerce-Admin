"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { CategoryColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface CategoryClientProps {
  data: CategoryColumn[];
}

export const CategoryClient: React.FC<CategoryClientProps> = ({ data }) => {
  console.log(data);
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
        <Heading
          title={`Categories (${data?.length || 0})`}
          description="Manage Categories for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/categories/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          <span>Add new</span>
        </Button>
      </div>
      <Separator />
      <DataTable
        columns={columns}
        searchKey="name"
        //@ts-ignore
        data={data}
      />
      <Heading title="API" description="API calls for Categories" />
      <Separator />
      <ApiList entityName="categories" entityIdName="categoryId" />
    </>
  );
};
