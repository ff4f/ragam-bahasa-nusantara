import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "./ui/button";

interface ConfirmationDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  handleClose: () => void;
  handleSubmit: () => void;
}

const ConfirmationDialog = ({ open, title, description, handleClose, handleSubmit }: ConfirmationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">{description}</DialogDescription>
        </DialogHeader>
        <div className="flex gap-3">
          <Button onClick={handleSubmit} className="flex-1">
            Ya
          </Button>
          <Button onClick={handleClose} variant="outline" className="flex-1">
            Tidak
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;