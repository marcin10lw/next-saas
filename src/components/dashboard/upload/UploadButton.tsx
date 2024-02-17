"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import UploadDropzone from "./UploadDropzone";
import { SubscriptionPlan } from "@/types/subscriptionPlan";

const UploadButton = ({ isSubscribed }: { isSubscribed: boolean }) => {
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
          isSubscribed={isSubscribed}
          isUploadingFile={isUploadingFile}
          setIsUploadingFile={setIsUploadingFile}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UploadButton;
