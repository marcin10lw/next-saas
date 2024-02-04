import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Expand } from "lucide-react";
import { useState } from "react";
import SimpleBar from "simplebar-react";

const PdfFullScreen = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Dialog
      open={modalOpen}
      onOpenChange={() => {
        setModalOpen((modalOpen) => !modalOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button aria-label="fullscreen pdf" variant="ghost">
          <Expand className="h-4 w-4 text-zinc-700" />
        </Button>
      </DialogTrigger>
      <DialogContent className="h-full max-h-[96vh] w-full max-w-[98vw]">
        <SimpleBar className="max-h-[calc(100vh-10rem)] mt-6">
          
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
};

export default PdfFullScreen;
