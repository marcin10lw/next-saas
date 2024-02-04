import { Expand } from "lucide-react";
import { useState } from "react";
import SimpleBar from "simplebar-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useResizeDetector } from "react-resize-detector";
import PdfDisplay from "./PdfDisplay";

const PdfFullScreen = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { ref, width } = useResizeDetector();

  return (
    <Dialog
      modal
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

      <DialogContent className="h-full max-h-full w-full max-w-full pt-10">
        <SimpleBar
          autoHide={true}
          className="h-full max-h-[calc(100vh-80px)]"
          style={{ width: "100%" }}
        >
          <div ref={ref}>
            <PdfDisplay pageWidth={width} isFullscreen />
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
};

export default PdfFullScreen;
