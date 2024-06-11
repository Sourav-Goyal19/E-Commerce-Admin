import { cn } from "@/lib/utils";
import { UserData } from "@/models/user.model";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Fragment } from "react";
import { Button } from "./button";
import { X } from "lucide-react";
import { ProfileOptions } from "./profile-options";

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserData | null;
}

const MenuDrawer: React.FC<MenuDrawerProps> = ({ isOpen, onClose, user }) => {
  const params = useParams();
  const pathname = usePathname();
  const routes = [
    {
      href: `/${params.storeId}/`,
      label: "Overview",
      active: pathname === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/billboards`,
      label: "Billboards",
      active: pathname === `/${params.storeId}/billboards`,
    },
    {
      href: `/${params.storeId}/categories`,
      label: "Categories",
      active: pathname === `/${params.storeId}/categories`,
    },
    {
      href: `/${params.storeId}/sizes`,
      label: "Sizes",
      active: pathname === `/${params.storeId}/sizes`,
    },
    {
      href: `/${params.storeId}/colors`,
      label: "colors",
      active: pathname === `/${params.storeId}/colors`,
    },
    {
      href: `/${params.storeId}/products`,
      label: "products",
      active: pathname === `/${params.storeId}/products`,
    },
    {
      href: `/${params.storeId}/orders`,
      label: "orders",
      active: pathname === `/${params.storeId}/orders`,
    },
    {
      href: `/${params.storeId}/settings`,
      label: "Settings",
      active: pathname === `/${params.storeId}/settings`,
    },
  ];
  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="fixed pointer-events-none inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-sm">
                    <div className="h-full flex flex-col justify-between bg-background overflow-y-auto py-5 shadow-xl">
                      <div className="px-4 sm:px-6 h-full flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-end">
                            <div className="ml-3 flex h-7 items-center">
                              <Button
                                onClick={onClose}
                                variant={"outline"}
                                size={"icon"}
                                className="rounded-lg"
                              >
                                <span className="sr-only">Close Panel</span>
                                <X className="h-5 w-5" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex flex-col mt-3">
                            {routes.map((route) => (
                              <>
                                <Link
                                  key={route.label}
                                  href={route.href}
                                  onClick={onClose}
                                  className={cn(
                                    "text-lg capitalize pb-2 pt-3 rounded pl-2 text-foreground border-b-2 border-gray-500 hover:bg-muted transition-all tracking-wider",
                                    route.active ? "bg-muted" : ""
                                  )}
                                >
                                  {route.label}
                                </Link>
                              </>
                            ))}
                          </div>
                        </div>
                        <ProfileOptions user={user} />
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default MenuDrawer;
