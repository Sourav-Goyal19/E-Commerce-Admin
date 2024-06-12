"use client";
import React from "react";
import { ApiAlert } from "./api-alert";
import { useOrigin } from "@/hooks/useOrigin";
import { useParams } from "next/navigation";

interface ApiListProps {
  entityName: string;
  entityIdName: string;
}

export const ApiList: React.FC<ApiListProps> = ({
  entityIdName,
  entityName,
}) => {
  const origin = useOrigin();
  const params = useParams();

  const baseUrl = `${origin}/api`;
  return (
    <>
      <ApiAlert
        title="GET"
        variant="Public"
        description={`${baseUrl}/${params.storeId}/${entityName}`}
      />
      <ApiAlert
        title="GET"
        variant="Public"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
      />
      <ApiAlert
        title="POST"
        variant="Admin"
        description={`${baseUrl}/${entityName}/${params.storeId}`}
      />
      <ApiAlert
        title="PATCH"
        variant="Admin"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
      />
      <ApiAlert
        title="DELETE"
        variant="Admin"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
      />
    </>
  );
};
