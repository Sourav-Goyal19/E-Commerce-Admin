import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { StoreData } from "@/models/store.modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface SettingsFormProps {
  initialData: StoreData;
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type SettingFormValues = z.infer<typeof formSchema>;

export const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const form = useForm<SettingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name,
    },
  });

  return (
    <>
      <div className="flex justify-between items-center">
        <Heading title="Settings" description="Modify Store preferences" />
        <Button variant="destructive" size="icon">
          <Trash className="h-4 w-4" />
          <span className="sr-only">Trash</span>
        </Button>
      </div>
      <Separator />
    </>
  );
};
