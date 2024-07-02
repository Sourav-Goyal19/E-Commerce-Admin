"use client";

import { cn } from "@/lib/utils";
import { StoreData } from "@/models/store.model";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import {
  Check,
  ChevronsUpDown,
  PlusCircle,
  Store as StoreIcon,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useStoreModal } from "@/hooks/useStore";

interface StoreSwitcherProps {
  items: StoreData[];
}

const StoreSwitcher: React.FC<StoreSwitcherProps> = ({ items = [] }) => {
  const params = useParams();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const storeModal = useStoreModal();

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item._id,
  }));

  const currentStore = items.find((item) => item._id === params.storeId);

  const onStoreSelect = (storeId: string) => {
    setIsOpen(false);
    router.push(`/${storeId}`);
  };

  return (
    <>
      {items.length < 1 ? (
        <Button variant="outline" className="w-[200px]" disabled>
          Loading.......
        </Button>
      ) : (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger>
            <Button
              variant={"outline"}
              role="combobox"
              size={"sm"}
              aria-expanded={isOpen}
              aria-controls="stores"
              aria-label="Select a store"
              className="w-[200px] justify-between"
            >
              <StoreIcon className="mr-2 h-4 w-4" />
              <span className="capitalize truncate">
                {currentStore?.name || "Loading......."}
              </span>
              <ChevronsUpDown className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Command>
              <CommandList>
                <CommandInput placeholder="Search store....." />
                <CommandEmpty>No Store Found</CommandEmpty>
                <CommandGroup heading="Stores">
                  {formattedItems.map((store) => (
                    <CommandItem
                      key={store.value}
                      onSelect={() => onStoreSelect(store.value)}
                      className={cn(
                        "text-sm",
                        currentStore?._id === store.value
                          ? "bg-accent"
                          : "text-muted-foreground"
                      )}
                    >
                      {store.label}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          currentStore?._id === store.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
              <CommandSeparator />
              <CommandList>
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      setIsOpen(false);
                      storeModal.onOpen();
                    }}
                  >
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create a new store
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
};

export default StoreSwitcher;
