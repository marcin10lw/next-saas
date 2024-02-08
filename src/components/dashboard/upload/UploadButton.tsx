"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import UploadDropzone from "./UploadDropzone";

const UploadButton = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  return (
    <Dialog
      open={modalOpen}
      onOpenChange={() => {
        setModalOpen((modalOpen) => !modalOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="default">Upload PDF</Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(event) => {
          if (isUploadingFile) {
            event.preventDefault();
          }
        }}
      >
        <UploadDropzone
          isUploadingFile={isUploadingFile}
          setIsUploadingFile={setIsUploadingFile}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UploadButton;
