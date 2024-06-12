"use client";
import { Copy, Server as ServerIcon } from "lucide-react";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface ApiAlertProps {
  title: string;
  description: string;
  variant: "Admin" | "Public";
}

const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
  Public: "secondary",
  Admin: "destructive",
};

export const ApiAlert: React.FC<ApiAlertProps> = ({
  title,
  description,
  variant = "Public",
}) => {
  const onCopy = () => {
    navigator.clipboard.writeText(description);
    toast.success("API Route copied to the clipboard");
  };

  return (
    <div className="w-full p-3 border rounded-md flex gap-3 overflow-x-auto">
      <ServerIcon className="w-4 h-4 mt-1" />
      <div className="flex flex-col w-full">
        <div className="flex items-center gap-3">
          <p className="font-bold leading-normal">{title}</p>
          <Badge variant={variantMap[variant]}>{variant}</Badge>
        </div>
        <div className="mt-3 w-full flex items-center justify-between gap-2">
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
            {description}
          </code>
          <Button
            variant="outline"
            size="icon"
            className="mx-2 p-2"
            onClick={onCopy}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
