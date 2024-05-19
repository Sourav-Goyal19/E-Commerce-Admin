import { Button } from "../ui/button";
import { Modal } from "./modal";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Are you sure"
      description="This action cannot be undone."
    >
      <div className="flex justify-end items-center pt-3 w-full space-x-3 ">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="destructive" disabled={loading}>
          Continue
        </Button>
      </div>
    </Modal>
  );
};
