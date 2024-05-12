import ModalProvider from "@/components/modals/modalProvider";

export default function MeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <ModalProvider />
      {children}
    </div>
  );
}
